# 34 — Crafting e receitas

## Princípio
Tudo se faz de **sucata processada**. Receita = entradas → saída + tempo.

## Cadeia (exemplo)
- 3× Sucata → 1× Matéria-prima (triadora).
- 2× Matéria-prima → 1× Componente (montadora).
- 4× Componente → 1× Módulo de construção.

## Manual vs automático
- Era 1: craft manual numa bancada.
- Era 2: as mesmas receitas rodam em máquinas/esteiras. Ver [35](35-automacao-esteiras-e-fabricas.md).

## Dados
Receitas em JSON (`data/recipes.json`, futuro): `{ id, inputs[], output, tempo,
maquina }`. Mantém o jogo dirigido por dados.

## Regra educativa
Receitas que usam material **reciclado** custam menos que "fabricar do zero",
reforçando o ciclo. Ver [31](31-economia-circular-e-recursos.md).
