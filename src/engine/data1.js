/**
 * data1.js — Dados da Era 1 (Pouso e Sobrevivência).
 *
 * Carrega as tabelas canônicas de `data/*.json` (mesma filosofia da Era 0:
 * conteúdo fora do código). Expõe listas + índices por id ao motor da Era 1.
 */

import biomesJson from '../../data/biomes.json';
import resourcesJson from '../../data/resources.json';
import recipesJson from '../../data/recipes.json';
import creaturesJson from '../../data/creatures.json';
import loreJson from '../../data/lore.json';
import { validateEra1 } from './validate1.js';

export const BIOMES = biomesJson;
export const RESOURCES = resourcesJson;
export const RECIPES = recipesJson;
export const CREATURES = creaturesJson;
export const LORE = loreJson;

const byId = (arr) => Object.fromEntries(arr.map((x) => [x.id, x]));
export const BIOME = byId(BIOMES);
export const RESOURCE = byId(RESOURCES);
export const RECIPE = byId(RECIPES);
export const CREATURE = byId(CREATURES);

/** Valida os invariantes da Era 1 sobre os dados carregados. */
export function validate() {
  return validateEra1({ biomes: BIOMES, resources: RESOURCES, recipes: RECIPES, creatures: CREATURES });
}
