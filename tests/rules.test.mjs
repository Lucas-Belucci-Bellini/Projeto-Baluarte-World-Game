/**
 * tests/rules.test.mjs — Testes sem dependências (rode com `npm test`).
 *
 * Cobre duas coisas que o ROADMAP/data-README exigem:
 *   1. INVARIANTES dos dados (data/README.md) — o jogo não pode ensinar errado.
 *   2. PARIDADE de pontuação com o protótipo 2D — os números abaixo são
 *      fixados à mão a partir do protótipo; se rules.js mudar, o teste quebra.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  sortingPoints, routingCredits, routingEco, sectorBonusCredits,
  sectorBonusEco, maxLives, upgradeCost, getSetor, starsFor,
} from '../src/engine/rules.js';
import { validateData } from '../src/engine/validate.js';

const here = dirname(fileURLToPath(import.meta.url));
const readJson = (p) => JSON.parse(readFileSync(join(here, '..', 'data', p), 'utf8'));

const bins = readJson('bins.json');
const items = readJson('items.json');
const setores = readJson('setores.json');
const upgrades = readJson('upgrades.json');
const destinosRaw = readJson('destinos.json');
const destinos = Object.fromEntries(
  Object.entries(destinosRaw).filter(([k]) => !k.startsWith('_'))
);

/* ===== mini harness ===== */
let pass = 0;
let fail = 0;
function eq(actual, expected, msg) {
  if (actual === expected) { pass++; }
  else { fail++; console.error(`✗ ${msg}\n    esperado ${JSON.stringify(expected)}, veio ${JSON.stringify(actual)}`); }
}
function ok(cond, msg) {
  if (cond) { pass++; } else { fail++; console.error(`✗ ${msg}`); }
}

/* ===== 1. Invariantes dos dados ===== */
const problems = validateData({ bins, destinos, items });
ok(problems.length === 0, 'invariantes dos dados: ' + (problems.join(' | ') || 'OK'));

// Esperado: 7 lixeiras, 11 itens (3 dúbios), 5 setores, 4 upgrades.
eq(bins.length, 7, 'bins = 7');
eq(items.length, 11, 'items = 11');
eq(items.filter((i) => i.dubio).length, 3, 'itens dúbios = 3');
eq(setores.length, 5, 'setores = 5');
eq(upgrades.length, 4, 'upgrades = 4');

/* ===== 2. Paridade de pontuação (números do protótipo) ===== */
// Separação: 10 + streak*2.
eq(sortingPoints(0), 10, 'sortingPoints(0)');
eq(sortingPoints(1), 12, 'sortingPoints(1)');
eq(sortingPoints(5), 20, 'sortingPoints(5)');

// Roteamento de créditos: dest.credits + floor(streak/3) + creditoLevel.
const reciclar = destinos.reciclar;   // credits 4, eco 4
const incinerar = destinos.incinerar; // credits 2, eco 0
eq(routingCredits(reciclar, 0, 0), 4, 'credits reciclar streak0');
eq(routingCredits(reciclar, 3, 0), 5, 'credits reciclar streak3 (+1)');
eq(routingCredits(reciclar, 6, 2), 8, 'credits reciclar streak6 lvl2 (4+2+2)');

// EcoPontos: só destinos verdes (eco>0) ganham o bônus do Selo verde.
eq(routingEco(reciclar, 0), 4, 'eco reciclar lvl0');
eq(routingEco(reciclar, 2), 6, 'eco reciclar lvl2');
eq(routingEco(incinerar, 5), 0, 'eco incinerar sempre 0');

// Bônus de setor.
eq(sectorBonusCredits(0), 5, 'bonusC setor0');
eq(sectorBonusCredits(2), 11, 'bonusC setor2');
eq(sectorBonusEco(0), 5, 'bonusE setor0');
eq(sectorBonusEco(2), 9, 'bonusE setor2');

// Vidas e custo de upgrade.
eq(maxLives(0), 3, 'maxLives base');
eq(maxLives(2), 5, 'maxLives +2');
const credUpg = upgrades.find((u) => u.id === 'credito'); // base 20, scale 1.8
eq(upgradeCost(credUpg, 0), 20, 'upgradeCost credito lvl0');
eq(upgradeCost(credUpg, 1), 36, 'upgradeCost credito lvl1');
eq(upgradeCost(credUpg, 2), 65, 'upgradeCost credito lvl2');

// Setores além do último são gerados crescentes.
eq(getSetor(setores, 0).meta, 6, 'getSetor 0 meta');
eq(getSetor(setores, 5).meta, 16, 'getSetor 5 (gerado) meta');
eq(getSetor(setores, 5).nome, 'Setor 6', 'getSetor 5 nome');

// Estrelas no fim de jogo.
eq(starsFor(0), 1, 'stars 0');
eq(starsFor(60), 2, 'stars 60');
eq(starsFor(90), 3, 'stars 90');
eq(starsFor(500), 3, 'stars cap 3');

/* ===== resultado ===== */
console.log(`\n${pass} passou, ${fail} falhou.`);
process.exit(fail ? 1 : 0);
