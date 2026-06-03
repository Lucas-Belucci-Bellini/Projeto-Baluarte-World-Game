/**
 * game2.js — Orquestrador da Era 2 (Automação).
 * Monta a fábrica, trata input de construção, roda o simulador e checa a vitória
 * (produzir N Componentes). `startEra2(root)` devolve um teardown().
 */

import { MAQ, ITEM, TECH } from '../engine/data2.js';
import { novaFabrica, colocar, remover, avancar, desbloquear } from './sim.js';
import { render, layout, celulaEm } from './render2.js';
import { createHUD2 } from './hud2.js';
import { initAudio, sfx } from '../era1/audio.js';

const INICIAIS = ['fonte', 'esteira', 'trituradora', 'estoque']; // máquinas iniciais

const COLS = 20, ROWS = 12, META_COMP = 12, META_MOD = 4;

export function startEra2(root) {
  root.innerHTML = `<canvas class="e2-canvas"></canvas><div class="e2-hud"></div>`;
  const canvas = root.querySelector('.e2-canvas');
  const ctx = canvas.getContext('2d');
  const hudEl = root.querySelector('.e2-hud');

  const f = novaFabrica(COLS, ROWS);
  const state = {
    f, tool: 'esteira', dir: 1, hover: null,
    meta: { comp: META_COMP, mod: META_MOD }, stage: 1,
    unlocked: new Set(INICIAIS),
    tempo: 0, rate: 0, rateMax: 0, lastComp: 0, rateTimer: 0,
    indice: 50, poluicao: 0,
    acc: { t: 0 }, pausado: true, acabou: false,
  };

  const bloqueada = (id) => TECH.some((x) => x.maquina === id) && !state.unlocked.has(id);
  const reqTexto = (id) => {
    const t = TECH.find((x) => x.maquina === id);
    return t ? 'produza ' + Object.entries(t.req).map(([it, q]) => `${q} ${ITEM[it] ? ITEM[it].nome : it}`).join(' + ') : '';
  };
  const indiceEra2 = () => Math.max(0, Math.min(100, 50 + (f.produced.modulo || 0) * 3 - Math.floor((f.poluicao || 0) / 2)));

  const handlers = { onMenu: null, onRestart: null };
  const hud = createHUD2(hudEl, {
    menu: () => handlers.onMenu && handlers.onMenu(),
    restart: () => handlers.onRestart && handlers.onRestart(),
    selectTool: (t) => {
      if (t !== 'remover' && bloqueada(t)) { hud.toast(`🔒 ${MAQ[t] ? MAQ[t].nome : t}: ${reqTexto(t)}`); return; }
      state.tool = t;
    },
    rotate: () => { state.dir = (state.dir + 1) % 4; },
  });
  hud.showIntro(() => { state.pausado = false; initAudio(); });

  /* ===== Input ===== */
  let dragging = false, lastCell = null;
  function pxFromEvent(e) {
    const r = canvas.getBoundingClientRect();
    const p = e.touches && e.touches[0] ? e.touches[0] : e;
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  }
  function celulaDoEvento(e) {
    const p = pxFromEvent(e);
    return celulaEm(f, layout(canvas, f), p.x, p.y);
  }
  function colocarEm(c) {
    if (!c || state.acabou || state.pausado) return;
    if (state.tool === 'remover') remover(f, c.cx, c.cy);
    else { colocar(f, c.cx, c.cy, state.tool, state.dir); sfx.build(); }
  }
  function onDown(e) {
    const c = celulaDoEvento(e);
    if (!c) return;
    e.preventDefault();
    dragging = true; lastCell = c; colocarEm(c);
  }
  function onMove(e) {
    const c = celulaDoEvento(e);
    state.hover = c;
    if (dragging && c && (!lastCell || c.cx !== lastCell.cx || c.cy !== lastCell.cy)) {
      lastCell = c; colocarEm(c);
    }
  }
  function onUp() { dragging = false; lastCell = null; }
  canvas.addEventListener('mousedown', onDown);
  canvas.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  canvas.addEventListener('touchstart', onDown, { passive: false });
  canvas.addEventListener('touchmove', (e) => { onMove(e); if (dragging) e.preventDefault(); }, { passive: false });
  window.addEventListener('touchend', onUp);
  const onKey = (e) => { if (e.key.toLowerCase() === 'r') state.dir = (state.dir + 1) % 4; };
  window.addEventListener('keydown', onKey);

  /* ===== Loop ===== */
  function resize() { canvas.width = root.clientWidth || 800; canvas.height = root.clientHeight || 600; }
  window.addEventListener('resize', resize);
  resize();

  let raf = 0, last = performance.now();
  function frame(now) {
    let dt = (now - last) / 1000; last = now;
    if (dt > 0.1) dt = 0.1;

    if (!state.pausado && !state.acabou) {
      avancar(f, MAQ, dt, state.acc);
      state.tempo += dt;
      state.poluicao = f.poluicao || 0;
      const novos = desbloquear(f.produced, TECH, state.unlocked);
      for (const id of novos) { state.unlocked.add(id); hud.toast(`🔓 Desbloqueado: ${MAQ[id] ? MAQ[id].nome : id}`); sfx.build(); }
      state.rateTimer += dt;
      if (state.rateTimer >= 1) {
        const c = f.produced.componente || 0;
        state.rate = Math.round((c - state.lastComp) * 60 / state.rateTimer);
        state.lastComp = c; state.rateTimer = 0;
        state.rateMax = Math.max(state.rateMax, state.rate);
      }
      if (state.stage === 1 && (f.produced.componente || 0) >= state.meta.comp) {
        state.stage = 2;
        hud.toast('✅ Componentes prontos! Agora produza Módulos (Forja + Linha + Gerador).');
      }
      if (state.stage === 2 && (f.produced.modulo || 0) >= state.meta.mod) vencer();
    }

    render(ctx, f, state);
    hud.update(state);
    raf = requestAnimationFrame(frame);
  }
  function vencer() {
    if (state.acabou) return;
    state.acabou = true;
    state.indice = indiceEra2();
    sfx.vitoria();
    hud.showEnd(state);
  }
  raf = requestAnimationFrame(frame);

  return {
    onMenu(fn) { handlers.onMenu = fn; },
    onRestart(fn) { handlers.onRestart = fn; },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', resize);
      root.innerHTML = '';
    },
  };
}
