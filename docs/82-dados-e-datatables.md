# 82 — Dados e DataTables

## Princípio
**Conteúdo fora do código.** Tudo em JSON na pasta [`../data/`](../data/) — fonte
única para web hoje e 3D amanhã.

## Tabelas atuais (Era 0)
`bins.json`, `destinos.json`, `items.json`, `setores.json`, `upgrades.json`.

## Tabelas futuras (por Era)
- `recipes.json` (crafting/automação), `machines.json` (Era 2).
- `modules.json` (construção, Era 3), `creatures.json` (Era 1/4),
  `weapons.json`, `missions.json`, `biomes.json`.

## Invariantes
Regras de consequência (hierarquia D-04, eco=0 em incinerar/aterro) são **validadas**
em runtime e em teste (`src/engine/validate.js`). Novas tabelas ganham seus
próprios invariantes.

## 3D
Arrays viram DataTables (objeto chaveado por id) + USTRUCTs no Unreal. Ver
[`../data/README.md`](../data/README.md).
