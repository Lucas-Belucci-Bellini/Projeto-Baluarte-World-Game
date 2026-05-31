/**
 * game.js — Orquestração do jogo (DOM + interação).
 *
 * Máquina de duas fases por item: 'sorting' (arrasta para a cor certa) →
 * 'routing' (escolhe o destino na hierarquia D-04). Pontuação delegada às
 * funções puras de `rules.js`; dados vêm de `data.js`; arte de `art.js`.
 *
 * Port fiel do protótipo 2D — mesmos números, mesma "sensação" de cesta/combo.
 */

import { BINS, DESTINOS, ITEMS, SETORES } from '../engine/data.js';
import {
  state, upgLevel, loadSave, persist, recordResult, recordDestino,
} from '../engine/state.js';
import {
  sortingPoints, routingCredits, routingEco, sectorBonusCredits,
  sectorBonusEco, maxLives, getSetor, starsFor,
} from '../engine/rules.js';
import { itemArt, binArt, hoopSVG } from './art.js';
import { openShop } from './shop.js';

/* ===== Refs de DOM (preenchidos em initGame) ===== */
let $stage, $bins, $item, $itemWrap, $hint, $score, $credits, $eco, $streak;
let $hearts, $restart, $setorName, $setorCount, $setorFill, $shopBtn;
let $destPanel, $destTitle, $destOptions;

/* ===== Estado transitório do arraste (UI pura, fora do save) ===== */
let dragging = false;
let offsetX = 0;
let offsetY = 0;

/* ============================================================
 *  Render
 * ============================================================ */
function renderBins() {
  $bins.innerHTML = '';
  BINS.forEach((b) => {
    const el = document.createElement('div');
    el.className = 'bin';
    el.dataset.id = b.id;
    el.innerHTML = `
      <div class="hoop">${hoopSVG()}</div>
      ${binArt(b)}
      <div class="label">${b.name}<span class="pt">LATA ${b.ptColor}</span></div>
    `;
    $bins.appendChild(el);
  });
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleQueue() {
  state.queue = shuffle([...ITEMS]);
}

function nextItem() {
  if (state.queue.length === 0) shuffleQueue();
  state.phase = 'sorting';
  state.current = state.queue.shift();
  $item.innerHTML = itemArt(state.current.id);
  $itemWrap.style.opacity = '1';
  $itemWrap.style.transition = 'top 0.45s ease, left 0.45s ease';
  $itemWrap.style.top = '30%';
  $itemWrap.style.left = '50%';
  setTimeout(() => { $itemWrap.style.transition = ''; }, 460);

  // Itens dúbios SEMPRE avisam (enganam de propósito — é onde mais se aprende).
  if (state.current.dubio) {
    $hint.style.display = 'block';
    $hint.childNodes[0].nodeValue = `🔍 ${state.current.inspect || 'Olhe bem antes de jogar!'} `;
  } else if (state.hintShown) {
    $hint.style.display = 'block';
    $hint.childNodes[0].nodeValue = `Onde joga ${state.current.name.toLowerCase()}? `;
  } else {
    $hint.style.display = 'none';
  }
}

export function setHUD() {
  $score.textContent = state.score;
  $credits.textContent = state.credits;
  $eco.textContent = state.ecoPoints;
  $streak.textContent = state.streak;
  let hearts = '';
  for (let i = 0; i < state.maxLives; i++) {
    hearts += `<span class="${i < state.lives ? '' : 'lost'}">❤️</span>`;
  }
  $hearts.innerHTML = hearts;
}

function updateSetorBar() {
  const s = getSetor(SETORES, state.setorIndex);
  $setorName.textContent = `Setor ${state.setorIndex + 1}: ${s.nome}`;
  $setorCount.textContent = `${state.setorProgress}/${s.meta}`;
  $setorFill.style.width = Math.min(100, (state.setorProgress / s.meta) * 100) + '%';
}

/* ============================================================
 *  Arraste (mouse + touch)
 * ============================================================ */
function pointFromEvent(e) {
  if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  if (e.changedTouches && e.changedTouches.length) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function binAt(x, y) {
  return [...document.querySelectorAll('.bin')].find((b) => {
    const r = b.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  });
}

function highlightBinAt(x, y) {
  const target = binAt(x, y);
  document.querySelectorAll('.bin').forEach((b) => b.classList.toggle('hover', b === target));
}

function clearBinHover() {
  document.querySelectorAll('.bin').forEach((b) => b.classList.remove('hover'));
}

function returnItem() {
  $itemWrap.classList.add('return');
  $itemWrap.style.top = '30%';
  $itemWrap.style.left = '50%';
  $itemWrap.style.transform = 'translate(-50%, -50%)';
  setTimeout(() => $itemWrap.classList.remove('return'), 450);
}

function pointerDown(e) {
  if (!state.current || state.phase !== 'sorting') return;
  e.preventDefault();
  dragging = true;
  const p = pointFromEvent(e);
  const rect = $itemWrap.getBoundingClientRect();
  offsetX = p.x - (rect.left + rect.width / 2);
  offsetY = p.y - (rect.top + rect.height / 2);
  $itemWrap.classList.add('dragging');
  if (state.hintShown) {
    $hint.style.display = 'none';
    state.hintShown = false;
  }
}

function pointerMove(e) {
  if (!dragging) return;
  const p = pointFromEvent(e);
  const stageRect = $stage.getBoundingClientRect();
  $itemWrap.style.left = (p.x - stageRect.left - offsetX) + 'px';
  $itemWrap.style.top = (p.y - stageRect.top - offsetY) + 'px';
  $itemWrap.style.transform = 'translate(-50%, -50%)';
  highlightBinAt(p.x, p.y);
}

function pointerUp(e) {
  if (!dragging) return;
  dragging = false;
  $itemWrap.classList.remove('dragging');
  const p = pointFromEvent(e);
  const binEl = binAt(p.x, p.y);
  clearBinHover();
  if (binEl) handleDrop(binEl);
  else returnItem();
}

/* ============================================================
 *  Fase 1 — separação (soltar na lixeira)
 * ============================================================ */
function handleDrop(binEl) {
  const binId = binEl.dataset.id;
  const item = state.current;
  const isCorrect = binId === item.correct;
  const correctBin = BINS.find((b) => b.id === item.correct);
  recordResult(item.correct, isCorrect);

  if (isCorrect) {
    const stageRect = $stage.getBoundingClientRect();
    const binRect = binEl.getBoundingClientRect();
    $itemWrap.classList.add('flying');
    $itemWrap.style.left = (binRect.left + binRect.width / 2 - stageRect.left) + 'px';
    $itemWrap.style.top = (binRect.top + 30 - stageRect.top) + 'px';
    setTimeout(() => binEl.classList.add('correct'), 450);

    const points = sortingPoints(state.streak);
    state.score += points;
    state.streak += 1;
    state.best = Math.max(state.best, state.streak);
    state.highScore = Math.max(state.highScore, state.score);
    persist();
    setHUD();

    setTimeout(() => {
      const swish = ['CESTA!', 'SWISH!', 'NA CESTA!', 'PERFEITO!', 'BELA CESTA!'];
      showFeedback(swish[Math.floor(Math.random() * swish.length)], 'Cor certa! Agora dê o destino certo.', true);
      showPoints(binEl, '+' + points);
      confettiBurst(binEl);
    }, 480);

    setTimeout(() => {
      binEl.classList.remove('correct');
      enterRouting(item, binEl);
    }, 1200);
  } else {
    binEl.classList.add('wrong');
    state.streak = 0;
    state.lives -= 1;
    persist();
    showFeedback('OPA!', `Vai na lata ${correctBin.ptColor} (${correctBin.name}). ${item.tip}`, false);
    setHUD();
    setTimeout(() => binEl.classList.remove('wrong'), 600);
    if (state.lives <= 0) setTimeout(gameOver, 1000);
    else setTimeout(returnItem, 700);
  }
}

/* ============================================================
 *  Fase 2 — roteamento (destino na hierarquia D-04)
 * ============================================================ */
function enterRouting(item, binEl) {
  state.phase = 'routing';
  $itemWrap.classList.remove('flying');
  $itemWrap.style.opacity = '0';
  $itemWrap.style.transition = '';
  $hint.style.display = 'none';
  $destTitle.textContent = `Você separou ${item.name.toLowerCase()}. Pra onde vai agora?`;
  renderDestOptions(item, binEl);
  $destPanel.classList.add('show');
  $destPanel.setAttribute('aria-hidden', 'false');
}

function renderDestOptions(item, binEl) {
  $destOptions.innerHTML = '';
  shuffle([...item.options]).forEach((id) => {
    const d = DESTINOS[id];
    const btn = document.createElement('button');
    btn.className = 'dest-btn';
    btn.style.setProperty('--accent', d.color);
    btn.innerHTML = `<span class="dico">${d.icon}</span><span class="dname">${d.name}</span>`;
    if (upgLevel('dica') > 0 && id === item.destino) {
      btn.classList.add('best');
      btn.innerHTML += '<span class="best-tag">★ melhor</span>';
    }
    btn.addEventListener('click', () => resolveRouting(id, item, binEl));
    $destOptions.appendChild(btn);
  });
}

function resolveRouting(destId, item, binEl) {
  if (state.phase !== 'routing') return; // ignora cliques duplos
  state.phase = 'resolved';
  $destPanel.classList.remove('show');
  $destPanel.setAttribute('aria-hidden', 'true');

  const dest = DESTINOS[destId];
  const best = DESTINOS[item.destino];
  const optimal = destId === item.destino;
  const credits = routingCredits(dest, state.streak, upgLevel('credito'));
  const eco = routingEco(dest, upgLevel('eco'));

  state.credits += credits;
  state.runCredits += credits;
  state.ecoPoints += eco;
  state.runEco += eco;
  recordDestino(optimal);
  persist();
  setHUD();

  if (optimal) {
    showFeedback(dest.name.toUpperCase() + '!', `${dest.tip} +${credits} ♻️ · +${eco} 🌱`, true);
    confettiBurst(binEl);
  } else {
    showFeedback('QUASE!', `Melhor seria ${best.name.toLowerCase()} ${best.icon} — ${best.tip} Você levou só +${credits} ♻️ · +${eco} 🌱.`, false);
  }
  showPoints(binEl, '+' + credits + ' ♻️');

  state.setorProgress += 1;
  updateSetorBar();
  const cleared = state.setorProgress >= getSetor(SETORES, state.setorIndex).meta;
  setTimeout(cleared ? completeSetor : nextItem, optimal ? 1150 : 1550);
}

function completeSetor() {
  const done = getSetor(SETORES, state.setorIndex);
  const bonusC = sectorBonusCredits(state.setorIndex);
  const bonusE = sectorBonusEco(state.setorIndex);
  state.credits += bonusC;
  state.runCredits += bonusC;
  state.ecoPoints += bonusE;
  state.runEco += bonusE;
  state.setorIndex += 1;
  state.setorProgress = 0;
  state.lives = state.maxLives;
  state.bestSetor = Math.max(state.bestSetor, state.setorIndex);
  persist();
  setHUD();
  updateSetorBar();

  const next = getSetor(SETORES, state.setorIndex);
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="card">
      <h2>Setor limpo! 🏞️</h2>
      <div class="big-score">${done.nome}</div>
      <p>O governo reformou a área e suas vidas foram restauradas! ❤️❤️❤️<br/>
         Bônus: <b>+${bonusC} ♻️</b> · <b>+${bonusE} 🌱</b><br/>
         Próximo: <b>Setor ${state.setorIndex + 1} — ${next.nome}</b></p>
      <button id="nextSetor">CONTINUAR →</button>
    </div>`;
  $stage.appendChild(modal);
  document.getElementById('nextSetor').onclick = () => { modal.remove(); nextItem(); };
}

/* ============================================================
 *  Feedback visual
 * ============================================================ */
function showFeedback(word, sub, good) {
  const el = document.createElement('div');
  el.className = 'feedback';
  el.innerHTML = `<div class="word ${good ? 'good' : 'bad'}">${word}</div><div class="sub">${sub}</div>`;
  $stage.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

function showPoints(binEl, text) {
  const r = binEl.getBoundingClientRect();
  const stageRect = $stage.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'points-pop';
  el.textContent = text;
  el.style.left = (r.left + r.width / 2 - stageRect.left) + 'px';
  el.style.top = (r.top - 8 - stageRect.top) + 'px';
  $stage.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

function confettiBurst(binEl) {
  const colors = ['#f0b315', '#2f8f3f', '#2b6cb0', '#d23636', '#e94e9b', '#fff'];
  const r = binEl.getBoundingClientRect();
  const stageRect = $stage.getBoundingClientRect();
  const cx = r.left + r.width / 2 - stageRect.left;
  const cy = r.top + 20 - stageRect.top;
  for (let i = 0; i < 22; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.background = colors[i % colors.length];
    c.style.left = (cx + (Math.random() - 0.5) * 60) + 'px';
    c.style.top = (cy + (Math.random() - 0.5) * 20) + 'px';
    c.style.animationDelay = (Math.random() * 0.15) + 's';
    c.style.transform = `rotate(${Math.random() * 360}deg)`;
    $stage.appendChild(c);
    setTimeout(() => c.remove(), 1500);
  }
}

/* ============================================================
 *  Fim de jogo + relatório de aprendizado
 * ============================================================ */
function reportHTML() {
  const rows = BINS.map((b) => {
    const s = state.stats[b.id];
    const total = s ? s.ok + s.err : 0;
    if (total === 0) return '';
    const pct = Math.round((s.ok / total) * 100);
    return `<div class="row"><span>${b.name}</span><span>${pct}% <small>(${s.ok}/${total})</small></span></div>`;
  }).filter(Boolean).join('');

  const r = state.stats.__routing;
  let routingRow = '';
  if (r && (r.opt + r.sub) > 0) {
    const tot = r.opt + r.sub;
    const pct = Math.round((r.opt / tot) * 100);
    routingRow = `<div class="row"><span>Destino ideal 🔄♻️🌱</span><span>${pct}% <small>(${r.opt}/${tot})</small></span></div>`;
  }

  if (!rows && !routingRow) return '';
  return `<div class="report"><div class="report-title">Seu aprendizado</div>${rows}${routingRow}</div>`;
}

function gameOver() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  const stars = '⭐'.repeat(starsFor(state.score));
  modal.innerHTML = `
    <div class="card">
      <h2>Fim de jogo!</h2>
      <div class="big-score">${state.score}</div>
      <div class="stars">${stars}</div>
      <p>Recorde: <b>${state.highScore}</b> · Melhor sequência: <b>${state.best}</b><br/>
         Setores limpos: <b>${state.setorIndex}</b> (recorde ${state.bestSetor})<br/>
         Créditos: <b>+${state.runCredits} ♻️</b> (total ${state.credits})<br/>
         EcoPontos: <b>+${state.runEco} 🌱</b> (total ${state.ecoPoints})</p>
      ${reportHTML()}
      <button id="playAgain">JOGAR DE NOVO</button>
    </div>`;
  $stage.appendChild(modal);
  document.getElementById('playAgain').onclick = () => { modal.remove(); resetGame(); };
}

function resetGame() {
  state.score = 0;
  state.streak = 0;
  state.maxLives = maxLives(upgLevel('vida'));
  state.lives = state.maxLives;
  state.best = 0;
  state.runCredits = 0;
  state.runEco = 0;
  state.setorIndex = 0;
  state.setorProgress = 0;
  state.phase = 'sorting';
  state.hintShown = true;
  $destPanel.classList.remove('show');
  $destPanel.setAttribute('aria-hidden', 'true');
  $itemWrap.style.opacity = '1';
  setHUD();
  updateSetorBar();
  shuffleQueue();
  nextItem();
}

/* ============================================================
 *  Bootstrap
 * ============================================================ */
export function initGame() {
  $stage = document.getElementById('stage');
  $bins = document.getElementById('bins');
  $item = document.getElementById('item');
  $itemWrap = document.getElementById('itemWrap');
  $hint = document.getElementById('hint');
  $score = document.getElementById('score');
  $credits = document.getElementById('credits');
  $eco = document.getElementById('eco');
  $streak = document.getElementById('streak');
  $hearts = document.getElementById('hearts');
  $restart = document.getElementById('restart');
  $setorName = document.getElementById('setorName');
  $setorCount = document.getElementById('setorCount');
  $setorFill = document.getElementById('setorFill');
  $shopBtn = document.getElementById('shopBtn');
  $destPanel = document.getElementById('destPanel');
  $destTitle = document.getElementById('destTitle');
  $destOptions = document.getElementById('destOptions');

  // Listeners de arraste (mouse + touch).
  $item.addEventListener('mousedown', pointerDown);
  $item.addEventListener('touchstart', pointerDown, { passive: false });
  window.addEventListener('mousemove', pointerMove);
  window.addEventListener('touchmove', pointerMove, { passive: false });
  window.addEventListener('mouseup', pointerUp);
  window.addEventListener('touchend', pointerUp);
  $restart.addEventListener('click', resetGame);
  $shopBtn.addEventListener('click', () => openShop($stage, setHUD));

  // Init.
  loadSave();
  state.lives = state.maxLives;
  renderBins();
  shuffleQueue();
  nextItem();
  setHUD();
  updateSetorBar();
}
