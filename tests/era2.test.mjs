/**
 * tests/era2.test.mjs — Testes da Era 2 (sem dependências; `node`).
 * Cobre invariantes dos dados E o simulador de fábrica (linha real produzindo).
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { validateEra2 } from '../src/engine/validate2.js';
import { novaFabrica, colocar, passo, get, PASSO, DIRS, energiaRatio, desbloquear } from '../src/era2/sim.js';

const here = dirname(fileURLToPath(import.meta.url));
const readJson = (p) => JSON.parse(readFileSync(join(here, '..', 'data', p), 'utf8'));
const maquinas = readJson('maquinas.json');
const itens = readJson('itens-fluxo.json');
const tech = readJson('tech.json');
const MAQ = Object.fromEntries(maquinas.map((m) => [m.id, m]));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.error(`✗ ${m}`); } };
const eq = (a, e, m) => ok(a === e, `${m} (esperado ${e}, veio ${a})`);

/* ===== Invariantes dos dados ===== */
const problems = validateEra2({ maquinas, itens, tech });
ok(problems.length === 0, 'invariantes Era 2: ' + (problems.join(' | ') || 'OK'));
eq(maquinas.length, 10, 'máquinas = 10');
eq(itens.length, 5, 'itens de fluxo = 5');
eq(tech.length, 6, 'tech = 6 desbloqueios');
eq(DIRS.length, 4, '4 direções');
ok(PASSO > 0, 'PASSO > 0');
ok(maquinas.some((m) => m.tipo === 'gerador' && !m.sujo), 'existe gerador limpo');
ok(maquinas.some((m) => m.tipo === 'gerador' && m.sujo), 'existe queimador (sujo)');
ok(maquinas.some((m) => m.tipo === 'divisor'), 'existe divisor');

/* ===== Tech: desbloqueios (função pura) ===== */
{
  const unlocked = new Set(['fonte', 'esteira', 'trituradora', 'estoque']);
  ok(desbloquear({ materia: 5 }, tech, unlocked).includes('montadora'), 'montadora desbloqueia com 5 matéria');
  ok(!desbloquear({ materia: 2 }, tech, unlocked).includes('montadora'), 'montadora não desbloqueia com 2 matéria');
  ok(desbloquear({ sucata: 6 }, tech, unlocked).includes('queimador'), 'queimador desbloqueia com 6 sucata');
  unlocked.add('montadora');
  ok(!desbloquear({ materia: 9 }, tech, unlocked).includes('montadora'), 'não re-desbloqueia o que já tem');
}

/* ===== Energia (função pura) ===== */
eq(energiaRatio(10, 4), 1, 'energia sobrando = ratio 1');
eq(energiaRatio(6, 0), 1, 'sem demanda = ratio 1');
eq(energiaRatio(4, 8), 0.5, 'metade da energia = ratio 0.5');
ok(energiaRatio(2, 8) < 0.5, 'pouca energia = ratio baixo');

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

/* ===== Sim D: cadeia da Forja → Liga ===== */
{
  const f = novaFabrica(10, 3);
  colocar(f, 0, 1, 'fonte', 1);
  colocar(f, 1, 1, 'esteira', 1);
  colocar(f, 2, 1, 'trituradora', 1); // sucata → materia
  colocar(f, 3, 1, 'esteira', 1);
  colocar(f, 4, 1, 'forja', 1);       // 2 materia → liga
  colocar(f, 5, 1, 'esteira', 1);
  colocar(f, 6, 1, 'estoque', 1);
  for (let i = 0; i < 500; i++) passo(f, MAQ);
  ok((f.produced.liga || 0) >= 1, `cadeia da Forja produz Liga (${f.produced.liga || 0})`);
}

/* ===== Sim E: divisor alterna entre frente e lado ===== */
{
  const f = novaFabrica(6, 6);
  colocar(f, 1, 1, 'divisor', 1); // dir = direita
  colocar(f, 2, 1, 'esteira', 1); // frente; aponta p/ fora → segura o item
  colocar(f, 1, 2, 'esteira', 2); // lado (baixo); aponta p/ fora → segura o item
  const d = get(f, 1, 1);
  d.item = 'sucata'; passo(f, MAQ);
  d.item = 'sucata'; passo(f, MAQ);
  ok(get(f, 2, 1).item === 'sucata' && get(f, 1, 2).item === 'sucata',
    'divisor distribuiu para frente E lado');
}

/* ===== Sim F: queimador consome sucata e polui ===== */
{
  const f = novaFabrica(5, 3);
  colocar(f, 0, 1, 'fonte', 1);
  colocar(f, 1, 1, 'esteira', 1);
  colocar(f, 2, 1, 'queimador', 1);
  for (let i = 0; i < 200; i++) passo(f, MAQ);
  ok((f.poluicao || 0) > 0, `queimador queima sucata e polui (${f.poluicao || 0})`);
}

console.log(`\n${pass} passou, ${fail} falhou.`);
process.exit(fail ? 1 : 0);
