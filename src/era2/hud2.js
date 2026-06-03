/**
 * hud2.js — Interface (DOM) da Era 2 (Automação).
 * Paleta de construção, contadores de produção, objetivo, tutorial e vitória.
 */

import { MAQUINAS, ITENS } from '../engine/data2.js';

const DIR_SETA = ['▲', '▶', '▼', '◀'];

export function createHUD2(container, handlers) {
  container.innerHTML = `
    <div class="e2-top">
      <div class="e2-obj" id="e2-obj">Objetivo…</div>
      <div class="e2-counts" id="e2-counts"></div>
      <button class="e2-btn ghost" id="e2-menu">↩ Menu</button>
    </div>
    <div class="e2-palette" id="e2-palette"></div>
    <div class="e2-panel hidden" id="e2-panel"></div>
    <div class="e2-toast hidden" id="e2-toast"></div>
    <div class="e2-intro hidden" id="e2-intro"></div>
  `;
  const $ = (s) => container.querySelector(s);
  const panel = $('#e2-panel');
  const toastEl = $('#e2-toast');
  $('#e2-menu').onclick = () => handlers.menu();

  // Paleta: máquinas + girar + remover
  const pal = $('#e2-palette');
  pal.innerHTML = MAQUINAS.map((m) =>
    `<button class="e2-tool" data-tool="${m.id}"><span class="ic">${m.icon}</span><span>${m.nome}</span></button>`).join('')
    + `<button class="e2-tool" data-tool="remover"><span class="ic">⛔</span><span>Remover</span></button>`
    + `<button class="e2-tool girar" id="e2-girar"><span class="ic" id="e2-dir">▶</span><span>Girar (R)</span></button>`;
  pal.querySelectorAll('[data-tool]').forEach((b) => {
    b.onclick = () => handlers.selectTool(b.dataset.tool);
  });
  $('#e2-girar').onclick = () => handlers.rotate();

  let lastState = null;
  function fecharPainel() { panel.classList.add('hidden'); panel.innerHTML = ''; }

  function showIntro(onStart) {
    const intro = $('#e2-intro');
    intro.classList.remove('hidden');
    intro.innerHTML = `<div class="e2-intro-card">
      <span class="kick">ERA 2 · AUTOMAÇÃO</span>
      <h2>A linha que roda sozinha 🏭</h2>
      <p>Cansou de catar na mão? Monte uma <b>linha de produção</b> que transforma
         sucata em recurso — orgulho industrial, limpo.</p>
      <ul class="e2-intro-goals">
        <li>⛏️ <b>Fonte</b> despeja Sucata na esteira à frente</li>
        <li>➡ <b>Esteira</b> leva os itens (gire com <b>R</b> para escolher a direção)</li>
        <li>⚙ <b>Trituradora</b>: Sucata → Matéria-prima</li>
        <li>🏭 <b>Montadora</b>: 2 Matéria → Componente · 🔩 <b>Forja</b>: 2 Matéria → Liga</li>
        <li>🛠 <b>Linha de Módulos</b>: Componente + Liga → Módulo (avançado)</li>
        <li>🔋 <b>Gerador</b> dá energia — sem energia, as máquinas desaceleram</li>
        <li>📦 <b>Estoque</b> recolhe e conta a produção</li>
      </ul>
      <p class="e2-intro-ctrl">Clique para construir (arraste para fazer linhas). Objetivo em 2 etapas:
        <b>${(lastState && lastState.meta && lastState.meta.comp) || 12} Componentes</b> →
        depois <b>${(lastState && lastState.meta && lastState.meta.mod) || 4} Módulos</b>.</p>
      <button class="e2-btn" id="e2-start">Ligar a fábrica →</button>
    </div>`;
    $('#e2-start').onclick = () => { intro.classList.add('hidden'); onStart(); };
  }

  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.remove('hidden');
    clearTimeout(toast._t); toast._t = setTimeout(() => toastEl.classList.add('hidden'), 1600);
  }

  function showEnd(state) {
    panel.classList.remove('hidden');
    panel.innerHTML = `<div class="e2-end">
      <h2>🏭 Fábrica completa!</h2>
      <p>Sua linha entregou <b>${state.f.produced.componente || 0} Componentes</b> e
         <b>${state.f.produced.modulo || 0} Módulos</b> sozinha. A automação fecha o ciclo
         da sucata em escala — a colônia pode crescer.</p>
      <p class="e2-end-stats">Tempo: ${Math.round(state.tempo)}s · pico de ${state.rateMax || 0}/min</p>
      <div class="e2-end-actions">
        <button class="e2-btn" id="e2-retry">↻ Nova fábrica</button>
        <button class="e2-btn ghost" id="e2-tomenu">↩ Menu</button>
      </div>
    </div>`;
    panel.querySelector('#e2-retry').onclick = () => handlers.restart();
    panel.querySelector('#e2-tomenu').onclick = () => handlers.menu();
  }

  function update(state) {
    lastState = state;
    const comp = state.f.produced.componente || 0;
    const mod = state.f.produced.modulo || 0;
    $('#e2-obj').textContent = state.stage === 1
      ? `🎯 Etapa 1 — ${state.meta.comp} Componentes: ${Math.min(comp, state.meta.comp)}/${state.meta.comp}`
      : `🎯 Etapa 2 — ${state.meta.mod} Módulos: ${Math.min(mod, state.meta.mod)}/${state.meta.mod}`;
    const en = state.f.energia || { supply: 0, demand: 0 };
    const enBaixa = en.demand > en.supply + 0.01;
    $('#e2-counts').innerHTML =
      `<span class="chip energia${enBaixa ? ' baixa' : ''}">🔋 ${Math.round(en.supply)}/${Math.round(en.demand)}</span>`
      + ITENS.map((it) =>
        `<span class="chip" style="--c:${it.cor}">${it.nome}: <b>${state.f.produced[it.id] || 0}</b></span>`).join('')
      + `<span class="chip rate">⚡ ${state.rate || 0}/min</span>`;
    $('#e2-dir').textContent = DIR_SETA[state.dir];
    container.querySelectorAll('.e2-tool[data-tool]').forEach((b) => {
      b.classList.toggle('sel', b.dataset.tool === state.tool);
    });
  }

  return { update, showIntro, showEnd, toast, fecharPainel };
}
