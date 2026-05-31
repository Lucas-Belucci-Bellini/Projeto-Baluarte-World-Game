/**
 * rules.js — Regras de pontuação (funções puras, sem DOM).
 *
 * Reproduzem EXATAMENTE os números do protótipo 2D
 * (`recycle-game/Jogo da Reciclagem.html`). O critério de aceite do port
 * (ROADMAP M1) é "mesma pontuação para a mesma sequência de ações" — por isso
 * a lógica de pontos vive isolada aqui e é coberta por testes
 * (`tests/rules.test.mjs`).
 */

/** Pontos por acertar a cor (separação). `streak` é ANTES de incrementar. */
export function sortingPoints(streak) {
  return 10 + streak * 2;
}

/** Créditos por rotear ao destino `dest`, com bônus de sequência e upgrade. */
export function routingCredits(dest, streak, creditoLevel = 0) {
  return dest.credits + Math.floor(streak / 3) + creditoLevel;
}

/** EcoPontos: só destinos "verdes" (eco > 0) recebem o bônus do Selo verde. */
export function routingEco(dest, ecoLevel = 0) {
  return dest.eco > 0 ? dest.eco + ecoLevel : 0;
}

/** Bônus de créditos ao limpar o setor de índice `setorIndex` (0-based). */
export function sectorBonusCredits(setorIndex) {
  return 5 + setorIndex * 3;
}

/** Bônus de EcoPontos ao limpar o setor de índice `setorIndex` (0-based). */
export function sectorBonusEco(setorIndex) {
  return 5 + setorIndex * 2;
}

/** Vidas máximas: base 3 + nível do upgrade "Coração extra". */
export function maxLives(vidaLevel = 0) {
  return 3 + vidaLevel;
}

/** Custo do PRÓXIMO nível de um upgrade dado o nível atual. */
export function upgradeCost(upgrade, level = 0) {
  return Math.round(upgrade.baseCost * Math.pow(upgrade.scale, level));
}

/** Setor de índice `i`. Depois do último, gera setores cada vez maiores. */
export function getSetor(setores, i) {
  if (i < setores.length) return setores[i];
  const last = setores[setores.length - 1];
  return { nome: 'Setor ' + (i + 1), meta: last.meta + (i - setores.length + 1) * 2 };
}

/** Estrelas no fim de jogo (1 a 3) a partir da pontuação. */
export function starsFor(score) {
  return Math.min(3, Math.max(1, Math.floor(score / 30)));
}
