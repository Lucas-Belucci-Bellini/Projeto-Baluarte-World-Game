/**
 * tests/era2.test.mjs — Testes da Era 2 (sem dependências; `node`).
 * Cobre invariantes dos dados E o simulador de fábrica (linha real produzindo).
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { validateEra2 } from '../src/engine/validate2.js';
import { novaFabrica, colocar, passo, PASSO, DIRS } from '../src/era2/sim.js';

const here = dirname(fileURLToPath(import.meta.url));
const readJson = (p) => JSON.parse(readFileSync(join(here, '..', 'data', p), 'utf8'));
const maquinas = readJson('maquinas.json');
const itens = readJson('itens-fluxo.json');
const MAQ = Object.fromEntries(maquinas.map((m) => [m.id, m]));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.error(`✗ ${m}`); } };
const eq = (a, e, m) => ok(a === e, `${m} (esperado ${e}, veio ${a})`);

/* ===== Invariantes dos dados ===== */
const problems = validateEra2({ maquinas, itens });
ok(problems.length === 0, 'invariantes Era 2: ' + (problems.join(' | ') || 'OK'));
eq(maquinas.length, 5, 'máquinas = 5');
eq(itens.length, 3, 'itens de fluxo = 3');
eq(DIRS.length, 4, '4 direções');
ok(PASSO > 0, 'PASSO > 0');

/* ===== Sim A: itens fluem fonte → esteira → esteira → estoque ===== */
{
  const f = novaFabrica(8, 3);
  colocar(f, 0, 1, 'fonte', 1);
  colocar(f, 1, 1, 'esteira', 1);
  colocar(f, 2, 1, 'esteira', 1);
  colocar(f, 3, 1, 'estoque', 1);
  for (let i = 0; i < 200; i++) passo(f, MAQ); // ~30s
  ok((f.produced.sucata || 0) > 0, `transporte: sucata chega ao estoque (${f.produced.sucata || 0})`);
}

/* ===== Sim B: cadeia completa → Componente ===== */
{
  const f = novaFabrica(10, 3);
  colocar(f, 0, 1, 'fonte', 1);
  colocar(f, 1, 1, 'esteira', 1);
  colocar(f, 2, 1, 'trituradora', 1); // sucata → materia
  colocar(f, 3, 1, 'esteira', 1);
  colocar(f, 4, 1, 'montadora', 1);   // 2 materia → componente
  colocar(f, 5, 1, 'esteira', 1);
  colocar(f, 6, 1, 'estoque', 1);
  for (let i = 0; i < 500; i++) passo(f, MAQ); // ~75s
  ok((f.produced.componente || 0) >= 1, `cadeia completa produz Componente (${f.produced.componente || 0})`);
}

/* ===== Sim C: máquina sem insumo não produz ===== */
{
  const f = novaFabrica(5, 3);
  colocar(f, 0, 1, 'trituradora', 1);
  colocar(f, 1, 1, 'estoque', 1);
  for (let i = 0; i < 100; i++) passo(f, MAQ);
  ok(!(f.produced.materia > 0), 'trituradora sem sucata não produz nada');
}

console.log(`\n${pass} passou, ${fail} falhou.`);
process.exit(fail ? 1 : 0);
