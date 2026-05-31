/**
 * survival.js — Regras puras da Era 1 (sem DOM, sem canvas).
 *
 * Ciclo dia-noite, decaimento de fome/energia, crafting e o Índice da Segunda
 * Chance (ver docs/60). Isolado aqui para ser coberto por testes — o jogo
 * (era1/) só consome estas funções.
 */

/* ===== Ciclo dia-noite (t é fração do dia em [0,1)) ===== */
export const DIA_SEGUNDOS = 150; // duração de um dia completo no protótipo

export function faseDoDia(t) {
  const x = ((t % 1) + 1) % 1;
  if (x < 0.08) return 'amanhecer';
  if (x < 0.55) return 'dia';
  if (x < 0.65) return 'entardecer';
  return 'noite';
}

export function ehNoite(t) {
  return faseDoDia(t) === 'noite';
}

/** Escuridão do céu em [0, 0.8] para escurecer a tela à noite. */
export function escuridao(t) {
  const x = ((t % 1) + 1) % 1;
  if (x < 0.08) return lerp(0.7, 0.0, x / 0.08);          // amanhecer clareia
  if (x < 0.55) return 0.0;                                // dia
  if (x < 0.65) return lerp(0.0, 0.6, (x - 0.55) / 0.10);  // entardecer escurece
  return lerp(0.6, 0.8, Math.min(1, (x - 0.65) / 0.25));   // noite cheia
}

function lerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* ===== Medidores ===== */
export const FOME_POR_SEG = 100 / 220;     // enche em ~3min40 se não comer
export const FOME_LIMITE = 70;             // acima disso, dreno de energia
const DRENO_FOME = 2.4;                     // energia/seg quando faminto
const DRENO_FRIO = 3.4;                     // energia/seg quando com frio
const REGEN = 1.6;                          // energia/seg quando ok

export function fomeApos(fome, dt, taxa = FOME_POR_SEG) {
  return clamp(fome + taxa * dt, 0, 100);
}

/**
 * Nova energia. `faminto` = fome alta; `frio` = noite sem calor/abrigo.
 * Com frio OU fome a energia cai; sem nenhum dos dois, regenera devagar.
 */
export function energiaApos(energia, dt, { faminto = false, frio = false } = {}) {
  let d = 0;
  if (faminto) d -= DRENO_FOME;
  if (frio) d -= DRENO_FRIO;
  if (!faminto && !frio) d += REGEN;
  return clamp(energia + d * dt, 0, 100);
}

export function estaFaminto(fome) { return fome >= FOME_LIMITE; }

/* ===== Crafting ===== */
export function podeCraftar(receita, inv) {
  return Object.entries(receita.entradas).every(([rid, q]) => (inv[rid] || 0) >= q);
}

/** Retorna um NOVO inventário com as entradas debitadas (assume podeCraftar). */
export function craftar(receita, inv) {
  const novo = { ...inv };
  for (const [rid, q] of Object.entries(receita.entradas)) novo[rid] = (novo[rid] || 0) - q;
  return novo;
}

/* ===== Índice da Segunda Chance (ver docs/60) ===== */
export const INDICE_INICIAL = 50;
export const CONSEQUENCIA = {
  sobreviveu_noite: +12,
  reaproveitou: +1,    // craftar a partir de sucata
  colono_perdido: -20,
  colapso: -25,
};

export function aplicarConsequencia(indice, evento) {
  return clamp(indice + (CONSEQUENCIA[evento] || 0), 0, 100);
}
