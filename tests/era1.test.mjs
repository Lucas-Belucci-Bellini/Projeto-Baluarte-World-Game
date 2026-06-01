/**
 * tests/era1.test.mjs — Testes da Era 1 (sem dependências; `node`).
 *
 * Cobre: invariantes dos dados (validate1) e as regras puras de sobrevivência
 * (ciclo dia-noite, fome/energia, crafting, Índice da Segunda Chance).
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { validateEra1 } from '../src/engine/validate1.js';
import {
  faseDoDia, ehNoite, fomeApos, energiaApos, estaFaminto,
  vidaApos, podeRegenerar, podeCraftar, craftar, aplicarConsequencia, INDICE_INICIAL,
} from '../src/engine/survival.js';

const here = dirname(fileURLToPath(import.meta.url));
const readJson = (p) => JSON.parse(readFileSync(join(here, '..', 'data', p), 'utf8'));
const biomes = readJson('biomes.json');
const resources = readJson('resources.json');
const recipes = readJson('recipes.json');
const creatures = readJson('creatures.json');

let pass = 0, fail = 0;
const eq = (a, e, m) => { if (a === e) pass++; else { fail++; console.error(`✗ ${m}\n    esperado ${JSON.stringify(e)}, veio ${JSON.stringify(a)}`); } };
const ok = (c, m) => { if (c) pass++; else { fail++; console.error(`✗ ${m}`); } };

/* ===== Invariantes dos dados ===== */
const problems = validateEra1({ biomes, resources, recipes, creatures });
ok(problems.length === 0, 'invariantes Era 1: ' + (problems.join(' | ') || 'OK'));
eq(biomes.length, 4, 'biomas = 4');
eq(resources.length, 4, 'recursos = 4');
eq(recipes.length, 7, 'receitas = 7');
eq(creatures.length, 3, 'criaturas = 3');
ok(recipes.some((r) => r.efeito && r.efeito.abrigo), 'existe receita de abrigo');
ok(recipes.some((r) => r.efeito && r.efeito.luz), 'existe a tocha (luz)');
ok(recipes.some((r) => r.efeito && r.efeito.baliza), 'existe a baliza (vitória)');
ok(recipes.some((r) => r.tipo === 'arma' && r.efeito.dano > 0), 'existe arma com dano');
ok(creatures.some((c) => c.comportamento === 'hostil'), 'existe criatura hostil');

/* ===== Ciclo dia-noite ===== */
eq(faseDoDia(0.3), 'dia', 'meio-dia = dia');
eq(faseDoDia(0.6), 'entardecer', '0.6 = entardecer');
eq(faseDoDia(0.8), 'noite', '0.8 = noite');
eq(faseDoDia(0.02), 'amanhecer', '0.02 = amanhecer');
ok(ehNoite(0.8) && !ehNoite(0.3), 'ehNoite');
eq(faseDoDia(1.3), 'dia', 'fase normaliza (1.3 -> 0.3)');

/* ===== Fome ===== */
ok(fomeApos(0, 10) > 0, 'fome sobe com o tempo');
eq(fomeApos(98, 100), 100, 'fome satura em 100');
ok(estaFaminto(80) && !estaFaminto(10), 'estaFaminto no limite');

/* ===== Energia ===== */
ok(energiaApos(50, 5, { faminto: true }) < 50, 'faminto dreno energia');
ok(energiaApos(50, 5, { frio: true }) < 50, 'frio dreno energia');
ok(energiaApos(50, 5, {}) > 50, 'ok regenera energia');
eq(energiaApos(1, 100, { frio: true, faminto: true }), 0, 'energia satura em 0');
eq(energiaApos(99, 100, {}), 100, 'energia satura em 100');

/* ===== Vida ===== */
ok(podeRegenerar({ faminto: false, frio: false, energia: 50 }), 'regenera quando seguro');
ok(!podeRegenerar({ faminto: true, frio: false, energia: 50 }), 'não regenera com fome');
ok(!podeRegenerar({ faminto: false, frio: true, energia: 50 }), 'não regenera com frio');
ok(!podeRegenerar({ faminto: false, frio: false, energia: 10 }), 'não regenera sem energia');
ok(vidaApos(50, 5, true) > 50, 'vida sobe quando pode regenerar');
eq(vidaApos(50, 5, false), 50, 'vida estável quando não pode');
eq(vidaApos(99, 100, true), 100, 'vida satura em 100');

/* ===== Crafting ===== */
const fogueira = recipes.find((r) => r.id === 'fogueira'); // sucata2 + fibra2
ok(podeCraftar(fogueira, { sucata: 2, fibra: 2 }), 'pode craftar com recursos exatos');
ok(!podeCraftar(fogueira, { sucata: 2, fibra: 1 }), 'não pode craftar sem recursos');
const inv = craftar(fogueira, { sucata: 5, fibra: 3, cristal: 1 });
eq(inv.sucata, 3, 'craftar debita sucata');
eq(inv.fibra, 1, 'craftar debita fibra');
eq(inv.cristal, 1, 'craftar não toca em recurso não usado');

/* ===== Consequência ===== */
eq(aplicarConsequencia(INDICE_INICIAL, 'sobreviveu_noite'), 62, 'sobreviver sobe o índice');
eq(aplicarConsequencia(10, 'colapso'), 0, 'índice satura em 0');
eq(aplicarConsequencia(95, 'sobreviveu_noite'), 100, 'índice satura em 100');

console.log(`\n${pass} passou, ${fail} falhou.`);
process.exit(fail ? 1 : 0);
