/**
 * data.js — Fonte única de dados do jogo.
 *
 * Carrega as tabelas canônicas de `data/*.json` (as mesmas que viram
 * DataTables na Unreal — ver `data/README.md`) e expõe-as ao motor. Manter
 * UMA fonte de dados evita o "drift" entre a versão web e o port 3D.
 */

import binsJson from '../../data/bins.json';
import destinosJson from '../../data/destinos.json';
import itemsJson from '../../data/items.json';
import setoresJson from '../../data/setores.json';
import upgradesJson from '../../data/upgrades.json';
import { validateData } from './validate.js';

export const BINS = binsJson;
export const ITEMS = itemsJson;
export const SETORES = setoresJson;
export const UPGRADES = upgradesJson;

/** destinos.json tem um campo `_comment` de documentação — removido aqui. */
export const DESTINOS = Object.fromEntries(
  Object.entries(destinosJson).filter(([k]) => !k.startsWith('_'))
);

/** Valida os invariantes pedagógicos sobre os dados carregados. */
export function validate() {
  return validateData({ bins: BINS, destinos: DESTINOS, items: ITEMS });
}
