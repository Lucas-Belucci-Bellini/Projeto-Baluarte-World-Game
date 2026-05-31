/**
 * hud.js — Camada de interface (DOM) sobre o canvas da Era 1.
 *
 * Medidores, relógio/dia, Índice, inventário, painéis de craft e de comando dos
 * colonos, controles touch (dpad + ação) e modais de fim. Não conhece o loop —
 * recebe `handlers` para devolver as ações ao jogo.
 */

import { RECIPES, RESOURCE } from '../engine/data1.js';
import { podeCraftar, faseDoDia } from '../engine/survival.js';

const FASE_ICONE = { amanhecer: '🌅', dia: '☀️', entardecer: '🌇', noite: '🌙' };

export function createHUD(container, handlers) {
  container.innerHTML = `
    <div class="e1-top">
      <div class="e1-clock" id="e1-clock">☀️ Dia 1 · dia</div>
      <div class="e1-indice" id="e1-indice">Índice da Segunda Chance: 50</div>
      <button class="e1-btn ghost" id="e1-menu">↩ Menu</button>
    </div>
    <div class="e1-meters">
      <div class="e1-meter"><span>⚡ Energia</span><div class="bar"><i id="e1-energia"></i></div></div>
      <div class="e1-meter"><span>🍖 Fome</span><div class="bar"><i id="e1-fome"></i></div></div>
    </div>
    <div class="e1-objective" id="e1-obj">Objetivo: construa um abrigo e sobreviva à primeira noite.</div>
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
  `;

  const $ = (id) => container.querySelector(id);
  const panel = $('#e1-panel');
  const toastEl = $('#e1-toast');

  $('#e1-menu').onclick = () => handlers.menu();
  container.querySelectorAll('.e1-actions [data-act]').forEach((b) => {
    b.onclick = () => {
      const a = b.dataset.act;
      if (a === 'interact') handlers.interact();
      if (a === 'craft') openCraft();
      if (a === 'command') openCommand();
    };
  });

  // dpad (touch/mouse): segura para mover
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
      b.onclick = () => { handlers.command(b.dataset.o); toast('Ordem dada: ' + b.textContent); fecharPainel(); };
    });
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

  function setBar(el, pct, cor) { el.style.width = Math.max(0, Math.min(100, pct)) + '%'; el.style.background = cor; }

  function update(state) {
    lastState = state;
    const fase = faseDoDia(state.clock);
    $('#e1-clock').textContent = `${FASE_ICONE[fase]} Dia ${state.dia} · ${fase}`;
    $('#e1-indice').textContent = `Índice da Segunda Chance: ${Math.round(state.indice)}`;
    setBar($('#e1-energia'), state.energia, state.energia < 25 ? '#d23636' : '#2f9d8f');
    setBar($('#e1-fome'), state.fome, state.fome > 70 ? '#d23636' : '#e8a13a');

    const inv = state.inventory;
    const chips = RESOURCE && Object.keys(inv).length
      ? Object.entries(inv).filter(([, q]) => q > 0).map(([k, q]) =>
          `<span class="chip" style="--c:${RESOURCE[k] ? RESOURCE[k].cor : '#888'}">${RESOURCE[k] ? RESOURCE[k].nome : k}: <b>${q}</b></span>`).join('')
      : '<span class="chip vazio">mochila vazia</span>';
    const tool = state.tools.coletor ? `<span class="chip tool">🛠️ Coletor x${state.tools.coletor}</span>` : '';
    $('#e1-inv').innerHTML = chips + tool;
  }

  return { update, toast, showEnd, fecharPainel };
}
