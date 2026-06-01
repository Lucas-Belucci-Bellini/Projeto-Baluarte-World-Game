/**
 * hud.js — Interface (DOM) sobre o canvas da Era 1.
 *
 * Tutorial inicial, medidores, relógio/dia, Índice (com feedback flutuante),
 * rastreador de objetivo, minimapa, inventário, painéis de craft/comando,
 * controles touch e modais de fim. Recebe `handlers` para devolver ações.
 */

import { RECIPES, RESOURCE, BIOME } from '../engine/data1.js';
import { podeCraftar, faseDoDia } from '../engine/survival.js';

const FASE_ICONE = { amanhecer: '🌅', dia: '☀️', entardecer: '🌇', noite: '🌙' };

export function createHUD(container, handlers) {
  container.innerHTML = `
    <div class="e1-top">
      <div class="e1-clock" id="e1-clock">☀️ Dia 1 · dia</div>
      <div class="e1-indice" id="e1-indice"><span id="e1-indice-val">Índice da Segunda Chance: 50</span></div>
      <button class="e1-btn ghost" id="e1-menu">↩ Menu</button>
    </div>
    <canvas class="e1-minimap" id="e1-minimap" width="120" height="120"></canvas>
    <div class="e1-meters">
      <div class="e1-meter"><span>⚡ Energia</span><div class="bar"><i id="e1-energia"></i></div></div>
      <div class="e1-meter"><span>🍖 Fome</span><div class="bar"><i id="e1-fome"></i></div></div>
    </div>
    <div class="e1-objective" id="e1-obj">Objetivo…</div>
    <div class="e1-cold hidden" id="e1-cold">🥶 Frio! Chegue perto da fogueira ou do abrigo.</div>
    <div class="e1-inv" id="e1-inv"></div>

    <div class="e1-dpad">
      <button data-d="up">▲</button>
      <div class="row"><button data-d="left">◀</button><button data-d="down">▼</button><button data-d="right">▶</button></div>
    </div>
    <div class="e1-actions">
      <button class="e1-btn" data-act="interact">✋ Coletar</button>
      <button class="e1-btn" data-act="craft">🛠️ Craftar</button>
      <button class="e1-btn" data-act="command">🫡 Comando</button>
    </div>

    <div class="e1-panel hidden" id="e1-panel"></div>
    <div class="e1-toast hidden" id="e1-toast"></div>
    <div class="e1-intro hidden" id="e1-intro"></div>
  `;

  const $ = (id) => container.querySelector(id);
  const panel = $('#e1-panel');
  const toastEl = $('#e1-toast');
  const mini = $('#e1-minimap');
  const miniCtx = mini.getContext('2d');

  $('#e1-menu').onclick = () => handlers.menu();
  container.querySelectorAll('.e1-actions [data-act]').forEach((b) => {
    b.onclick = () => {
      const a = b.dataset.act;
      if (a === 'interact') handlers.interact();
      if (a === 'craft') openCraft();
      if (a === 'command') openCommand();
    };
  });

  container.querySelectorAll('.e1-dpad [data-d]').forEach((b) => {
    const dirs = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    const press = (e) => { e.preventDefault(); handlers.dpad(...dirs[b.dataset.d]); };
    const release = () => handlers.dpad(0, 0);
    b.addEventListener('pointerdown', press);
    b.addEventListener('pointerup', release);
    b.addEventListener('pointerleave', release);
    b.addEventListener('pointercancel', release);
  });

  let lastState = null;
  function fecharPainel() { panel.classList.add('hidden'); panel.innerHTML = ''; }

  function openCraft() {
    if (!lastState) return;
    const inv = lastState.inventory;
    panel.classList.remove('hidden');
    panel.innerHTML = `<div class="e1-panel-head"><b>🛠️ Craftar</b><button id="e1-close">✕</button></div>
      <div class="e1-recipes">${RECIPES.map((r) => {
        const cost = Object.entries(r.entradas).map(([k, q]) => `${q}× ${RESOURCE[k].nome}`).join(', ');
        const can = podeCraftar(r, inv);
        return `<button class="e1-recipe ${can ? '' : 'no'}" data-r="${r.id}" ${can ? '' : 'disabled'}>
          <span class="ic">${r.icon}</span>
          <span class="info"><b>${r.nome}</b><small>${r.desc}</small><em>${cost}</em></span>
        </button>`;
      }).join('')}</div>`;
    panel.querySelector('#e1-close').onclick = fecharPainel;
    panel.querySelectorAll('.e1-recipe').forEach((b) => {
      b.onclick = () => { handlers.craft(b.dataset.r); openCraft(); };
    });
  }

  function openCommand() {
    if (!lastState) return;
    panel.classList.remove('hidden');
    const ordens = [
      { id: 'seguir', label: '🚶 Seguir você' },
      { id: 'coletar:sucata', label: '🔧 Coletar sucata' },
      { id: 'coletar:organico', label: '🌿 Coletar orgânico' },
      { id: 'ficar', label: '✋ Ficar parado' },
    ];
    panel.innerHTML = `<div class="e1-panel-head"><b>🫡 Comando dos colonos</b><button id="e1-close">✕</button></div>
      <p class="e1-hint">Ordene a todos os colonos (semente do sistema de 16):</p>
      <div class="e1-orders">${ordens.map((o) => `<button class="e1-order" data-o="${o.id}">${o.label}</button>`).join('')}</div>`;
    panel.querySelector('#e1-close').onclick = fecharPainel;
    panel.querySelectorAll('.e1-order').forEach((b) => {
      b.onclick = () => { handlers.command(b.dataset.o); toast('Ordem: ' + b.textContent.trim()); fecharPainel(); };
    });
  }

  function showIntro(onStart) {
    const intro = $('#e1-intro');
    intro.classList.remove('hidden');
    intro.innerHTML = `<div class="e1-intro-card">
      <span class="kick">ERA 1 · POUSO E SOBREVIVÊNCIA</span>
      <h2>Você pousou. 🪐</h2>
      <p>A nave caiu num mundo desconhecido em outra galáxia. A noite vem aí — e o frio mata.
         Use os destroços (sucata) para sobreviver e dar à humanidade uma segunda chance.</p>
      <ul class="e1-intro-goals">
        <li>✋ <b>Colete</b> Sucata e Fibra — tecla <b>E</b> (ou ✋)</li>
        <li>🛠️ <b>Crafte</b> um <b>Abrigo</b> — tecla <b>C</b></li>
        <li>🌙 <b>Sobreviva</b> à 1ª noite, perto do abrigo ou de uma fogueira</li>
        <li>🫡 <b>Comande</b> os colonos pra coletar — tecla <b>T</b></li>
      </ul>
      <p class="e1-intro-ctrl">Mover: <b>WASD</b> / setas — ou ◀ ▲ ▼ ▶ no toque.</p>
      <button class="e1-btn" id="e1-start">Pousar →</button>
    </div>`;
    $('#e1-start').onclick = () => { intro.classList.add('hidden'); onStart(); };
  }

  function flashIndice(delta) {
    if (!delta) return;
    const el = document.createElement('div');
    el.className = 'e1-indice-flash ' + (delta > 0 ? 'up' : 'down');
    el.textContent = (delta > 0 ? '+' : '') + Math.round(delta);
    $('#e1-indice').appendChild(el);
    setTimeout(() => el.remove(), 1400);
    const ind = $('#e1-indice'); ind.classList.remove('pulse'); void ind.offsetWidth; ind.classList.add('pulse');
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.remove('hidden');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toastEl.classList.add('hidden'), 1800);
  }

  function showEnd(win, state) {
    panel.classList.remove('hidden');
    panel.innerHTML = `<div class="e1-end ${win ? 'win' : 'lose'}">
      <h2>${win ? '🌅 Você sobreviveu à primeira noite!' : '💀 Você sucumbiu...'}</h2>
      <p>${win
        ? 'A colônia resistiu. A segunda chance ficou um pouco mais perto.'
        : 'A energia acabou antes do amanhecer. O recomeço terá de esperar.'}</p>
      <p class="e1-end-stats">Índice da Segunda Chance: <b>${Math.round(state.indice)}</b></p>
      <div class="e1-end-actions">
        <button class="e1-btn" id="e1-retry">↻ Tentar de novo</button>
        <button class="e1-btn ghost" id="e1-tomenu">↩ Menu</button>
      </div>
    </div>`;
    panel.querySelector('#e1-retry').onclick = () => handlers.restart();
    panel.querySelector('#e1-tomenu').onclick = () => handlers.menu();
  }

  function objetivoTexto(state) {
    const inv = state.inventory;
    const temAbrigo = state.structures.some((s) => s.tipo === 'abrigo');
    const s = inv.sucata || 0, f = inv.fibra || 0;
    if (temAbrigo) return `🌙 Sobreviva à noite — fique perto do abrigo/fogueira (Dia ${state.dia}).`;
    if (s >= 6 && f >= 4) return '✅ Recursos prontos — crafte o ABRIGO (🛠️ Craftar / C).';
    return `🎯 Junte para o Abrigo: Sucata ${Math.min(s, 6)}/6 · Fibra ${Math.min(f, 4)}/4 (✋ Coletar / E).`;
  }

  function drawMinimap(state) {
    const w = state.world; if (!w) return;
    const MW = mini.width, MH = mini.height;
    const sx = MW / w.W, sy = MH / w.H;
    miniCtx.fillStyle = '#04060a'; miniCtx.fillRect(0, 0, MW, MH);
    for (let y = 0; y < w.H; y++) {
      for (let x = 0; x < w.W; x++) {
        if (!w.seen[w.idx(x, y)]) continue;
        miniCtx.fillStyle = BIOME[w.biomaEm(x, y)].cor;
        miniCtx.fillRect(x * sx, y * sy, Math.ceil(sx), Math.ceil(sy));
      }
    }
    for (const st of state.structures) {
      miniCtx.fillStyle = st.tipo === 'fogueira' ? '#e8842a' : '#d9c08a';
      miniCtx.fillRect((st.x / w.TILE) * sx - 1, (st.y / w.TILE) * sy - 1, 3, 3);
    }
    miniCtx.fillStyle = '#f0b315';
    miniCtx.beginPath();
    miniCtx.arc((state.player.x / w.TILE) * sx, (state.player.y / w.TILE) * sy, 2.6, 0, Math.PI * 2);
    miniCtx.fill();
  }

  function setBar(el, pct, cor) { el.style.width = Math.max(0, Math.min(100, pct)) + '%'; el.style.background = cor; }

  function update(state) {
    lastState = state;
    const fase = faseDoDia(state.clock);
    $('#e1-clock').textContent = `${FASE_ICONE[fase]} Dia ${state.dia} · ${fase}`;
    $('#e1-indice-val').textContent = `Índice da Segunda Chance: ${Math.round(state.indice)}`;
    setBar($('#e1-energia'), state.energia, state.energia < 25 ? '#d23636' : '#2f9d8f');
    setBar($('#e1-fome'), state.fome, state.fome > 70 ? '#d23636' : '#e8a13a');
    $('#e1-obj').textContent = objetivoTexto(state);
    $('#e1-cold').classList.toggle('hidden', !state.frio);

    const inv = state.inventory;
    const chips = Object.entries(inv).filter(([, q]) => q > 0).map(([k, q]) =>
      `<span class="chip" style="--c:${RESOURCE[k] ? RESOURCE[k].cor : '#888'}">${RESOURCE[k] ? RESOURCE[k].nome : k}: <b>${q}</b></span>`).join('');
    let tools = '';
    if (state.tools.coletor) tools += `<span class="chip tool">🛠️ Coletor x${state.tools.coletor}</span>`;
    if (state.tools.tocha) tools += `<span class="chip tool">🔦 Tocha</span>`;
    $('#e1-inv').innerHTML = (chips || '<span class="chip vazio">mochila vazia</span>') + tools;

    drawMinimap(state);
  }

  return { update, toast, showEnd, showIntro, flashIndice, fecharPainel };
}
