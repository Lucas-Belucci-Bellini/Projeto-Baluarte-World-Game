/**
 * data2.js — Dados da Era 2 (Automação): máquinas e itens de fluxo.
 * Carrega de data/*.json (conteúdo fora do código) e valida invariantes.
 */

import maquinasJson from '../../data/maquinas.json';
import itensJson from '../../data/itens-fluxo.json';
import techJson from '../../data/tech.json';
import { validateEra2 } from './validate2.js';

export const MAQUINAS = maquinasJson;
export const ITENS = itensJson;
export const TECH = techJson;

const byId = (arr) => Object.fromEntries(arr.map((x) => [x.id, x]));
export const MAQ = byId(MAQUINAS);
export const ITEM = byId(ITENS);

export function validate() {
  return validateEra2({ maquinas: MAQUINAS, itens: ITENS, tech: TECH });
}
