/**
 * state.js — Estado do jogo + persistência (LocalStorage).
 *
 * Campos PERMANENTES (sobrevivem entre partidas e sessões): créditos,
 * EcoPontos, recordes, upgrades comprados e estatísticas de aprendizado.
 * Campos de PARTIDA (score, vidas, setor, fila…) são reiniciados a cada run.
 */

import { maxLives } from './rules.js';

const SAVE_KEY = 'pbwg-reciclagem-save-v1';

export const state = {
  // --- partida ---
  score: 0,
  streak: 0,
  best: 0,
  lives: 3,
  maxLives: 3,
  runCredits: 0,
  runEco: 0,
  setorIndex: 0,
  setorProgress: 0,
  current: null,
  queue: [],
  phase: 'sorting', // 'sorting' → arrastar p/ lixeira · 'routing' → escolher destino
  hintShown: true,
  // --- permanentes ---
  credits: 0,
  ecoPoints: 0,
  highScore: 0,
  bestSetor: 0,
  upgrades: {},
  stats: {},
};

export function upgLevel(id) {
  return state.upgrades[id] || 0;
}

export function loadSave() {
  let data = {};
  try { data = JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch (e) { /* sem save */ }
  state.credits = data.credits || 0;
  state.ecoPoints = data.ecoPoints || 0;
  state.highScore = data.highScore || 0;
  state.bestSetor = data.bestSetor || 0;
  state.upgrades = data.upgrades || {};
  state.stats = data.stats || {};
  state.maxLives = maxLives(upgLevel('vida'));
}

export function persist() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      credits: state.credits,
      ecoPoints: state.ecoPoints,
      highScore: state.highScore,
      bestSetor: state.bestSetor,
      upgrades: state.upgrades,
      stats: state.stats,
    }));
  } catch (e) { /* armazenamento indisponível — segue sem salvar */ }
}

/** Registra acerto/erro de separação por categoria (relatório de aprendizado). */
export function recordResult(catId, ok) {
  if (!state.stats[catId]) state.stats[catId] = { ok: 0, err: 0 };
  state.stats[catId][ok ? 'ok' : 'err'] += 1;
}

/** Registra se o roteamento escolheu o destino ideal. */
export function recordDestino(optimal) {
  if (!state.stats.__routing) state.stats.__routing = { opt: 0, sub: 0 };
  state.stats.__routing[optimal ? 'opt' : 'sub'] += 1;
}
