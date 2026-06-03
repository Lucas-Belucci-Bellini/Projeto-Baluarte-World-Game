/**
 * sim.js — Simulador de fábrica da Era 2 (Automação). Lógica pura, sem DOM.
 *
 * Grade esparsa de construções. A cada PASSO discreto: máquinas processam e os
 * itens andam UMA célula na direção da construção. Capacidade 1 por esteira
 * (com marca anti-salto) — simples e determinístico, por isso testável
 * (ver tests/era2.test.mjs).
 *
 * Pilar Satisfactory: a IDEIA (cadeias em esteira), implementada do zero,
 * processando SUCATA → MATÉRIA → COMPONENTE (a economia circular em escala).
 *
 * Cada construção guarda seu `build` (id da máquina); o `tipo` lógico
 * ('fonte'|'esteira'|'maquina'|'sink') vem de MAQ[build].
 */

export const PASSO = 0.15; // segundos por passo de simulação
export const BASE_ENERGIA = 4; // energia "grátis" do módulo de pouso
export const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // cima, direita, baixo, esquerda

const chave = (x, y) => x + ',' + y;

/** Fração de energia disponível (1 = tudo roda a todo vapor). */
export function energiaRatio(supply, demand) {
  return demand <= 0 ? 1 : Math.min(1, supply / demand);
}

export function novaFabrica(cols, rows) {
  return { cols, rows, cells: new Map(), produced: {} };
}

export function dentro(f, x, y) { return x >= 0 && y >= 0 && x < f.cols && y < f.rows; }
export function get(f, x, y) { return f.cells.get(chave(x, y)) || null; }

export function colocar(f, x, y, build, dir = 1) {
  if (!dentro(f, x, y)) return false;
  f.cells.set(chave(x, y), { build, dir, x, y, item: null, inBuf: {}, out: null, t: 0, spawnT: 0 });
  return true;
}
export function remover(f, x, y) { return f.cells.delete(chave(x, y)); }

function temEntradas(b, def) {
  return Object.entries(def.entrada).every(([it, q]) => (b.inBuf[it] || 0) >= q);
}
function consome(b, def) {
  for (const [it, q] of Object.entries(def.entrada)) b.inBuf[it] -= q;
}
function aceita(tgt, tdef, item) {
  if (tdef.tipo === 'esteira') return tgt.item == null;
  if (tdef.tipo === 'sink') return true;
  if (tdef.tipo === 'maquina') {
    return tdef.entrada && tdef.entrada[item] != null && (tgt.inBuf[item] || 0) < tdef.entrada[item] * 3;
  }
  return false; // fonte não recebe
}
function entrega(f, tgt, tdef, item) {
  if (tdef.tipo === 'esteira') tgt.item = item;
  else if (tdef.tipo === 'sink') f.produced[item] = (f.produced[item] || 0) + 1;
  else if (tdef.tipo === 'maquina') tgt.inBuf[item] = (tgt.inBuf[item] || 0) + 1;
}

/** Um passo discreto da simulação. MAQ = mapa de defs por id de construção. */
export function passo(f, MAQ) {
  // 0) Energia: oferta (base + geradores) vs demanda (máquinas ativas).
  let supply = BASE_ENERGIA, demand = 0;
  for (const b of f.cells.values()) {
    const def = MAQ[b.build];
    if (def && def.tipo === 'gerador') supply += def.geracao || 0;
  }
  for (const b of f.cells.values()) {
    const def = MAQ[b.build];
    if (def && def.tipo === 'maquina' && b.out == null && (b.t > 0 || temEntradas(b, def))) {
      demand += def.consumo || 0;
    }
  }
  const ratio = energiaRatio(supply, demand);
  f.energia = { supply, demand, ratio };

  // 1) Máquinas (na velocidade da energia) e fontes processam.
  for (const b of f.cells.values()) {
    const def = MAQ[b.build];
    if (!def) continue;
    if (def.tipo === 'maquina') {
      if (b.out == null) {
        if (b.t > 0) { b.t -= PASSO * ratio; if (b.t <= 0) { b.out = def.saida; b.t = 0; } }
        else if (temEntradas(b, def)) { consome(b, def); b.t = def.tempo; }
      }
    } else if (def.tipo === 'fonte') {
      if (b.out == null) { b.spawnT -= PASSO; if (b.spawnT <= 0) { b.out = def.saida; b.spawnT = def.intervalo; } }
    }
  }

  // 2) Movimento: no máximo um salto por item por passo.
  const moved = new Set();
  for (const b of f.cells.values()) {
    const def = MAQ[b.build];
    if (!def || def.tipo === 'sink') continue;
    const item = def.tipo === 'esteira' ? b.item : b.out;
    if (item == null || moved.has(b)) continue;
    const [dx, dy] = DIRS[b.dir];
    const tgt = get(f, b.x + dx, b.y + dy);
    if (!tgt || moved.has(tgt)) continue;
    const tdef = MAQ[tgt.build];
    if (!tdef) continue;
    if (aceita(tgt, tdef, item)) {
      entrega(f, tgt, tdef, item);
      if (def.tipo === 'esteira') b.item = null; else b.out = null;
      moved.add(b); moved.add(tgt);
    }
  }
}

/** Avança a fábrica por `dt` segundos, acumulando passos discretos. */
export function avancar(f, MAQ, dt, acc) {
  acc.t = (acc.t || 0) + dt;
  let n = 0;
  while (acc.t >= PASSO && n < 8) { passo(f, MAQ); acc.t -= PASSO; n++; }
}
