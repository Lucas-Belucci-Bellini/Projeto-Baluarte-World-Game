/**
 * hud2.js — Interface (DOM) da Era 2 (Automação).
 * Paleta de construção, contadores de produção, objetivo, tutorial e vitória.
 */

import { MAQUINAS, ITENS, TECH } from '../engine/data2.js';

const DIR_SETA = ['▲', '▶', '▼', '◀'];

export function createHUD2(container, handlers) {
  container.innerHTML = `
    <div class="e2-top">
      <div class="e2-obj" id="e2-obj">Objetivo…</div>
      <div class="e2-counts" id="e2-counts"></div>
      <div class="e2-ctrls">
        <button class="e2-btn ghost" id="e2-pause">⏸</button>
        <button class="e2-btn ghost" id="e2-speed">x1</button>
        <button class="e2-btn ghost" id="e2-save">💾</button>
        <button class="e2-btn ghost" id="e2-load">📂</button>
        <button class="e2-btn ghost" id="e2-menu">↩ Menu</button>
      </div>
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
  $('#e2-pause').onclick = () => handlers.pause();
  $('#e2-speed').onclick = () => handlers.speed();
  $('#e2-save').onclick = () => handlers.save();
  $('#e2-load').onclick = () => handlers.load();

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
        <li>🔋 <b>Gerador</b> dá energia limpa — sem energia, as máquinas desaceleram</li>
        <li>🔥 <b>Queimador</b>: energia barata da Sucata, mas <b>POLUI</b> (piora a 2ª chance)</li>
        <li>🔓 Começa com poucas peças — <b>produza</b> para desbloquear as outras</li>
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
      <div class="e1-report">
        <div class="row"><span>Tempo</span><b>${Math.round(state.tempo)}s</b></div>
        <div class="row"><span>Pico de produção</span><b>${state.rateMax || 0}/min</b></div>
        <div class="row"><span>Poluição (sucata queimada)</span><b>${Math.round(state.f.poluicao || 0)}</b></div>
        <div class="row"><span>Índice da Segunda Chance</span><b>${Math.round(state.indice || 50)}</b></div>
      </div>
      <p class="e2-end-stats">${(state.f.poluicao || 0) > 10
        ? '⚠️ Muita energia suja — a segunda chance pagou o preço.'
        : '🌱 Você manteve a fábrica limpa. A segunda chance agradece.'}</p>
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
      + ((state.f.poluicao || 0) > 0 ? `<span class="chip pol">🏭 ${Math.round(state.f.poluicao)}</span>` : '')
      + `<span class="chip rate">⚡ ${state.rate || 0}/min</span>`;
    $('#e2-dir').textContent = DIR_SETA[state.dir];
    $('#e2-pause').textContent = state.simPausada ? '▶' : '⏸';
    $('#e2-speed').textContent = 'x' + (state.simSpeed || 1);
    const unlocked = state.unlocked || new Set();
    container.querySelectorAll('.e2-tool[data-tool]').forEach((b) => {
      const t = b.dataset.tool;
      b.classList.toggle('sel', t === state.tool);
      b.classList.toggle('locked', TECH.some((x) => x.maquina === t) && !unlocked.has(t));
    });
  }

  return { update, showIntro, showEnd, toast, fecharPainel };
}
