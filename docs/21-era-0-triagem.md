# 21 — Era 0: Triagem (✅ jogável)

A **semente** do jogo: o sistema de **processar sucata** — separar por tipo e
escolher o destino certo. É a mecânica de base que, em escala, vira a economia
de toda a colônia.

## O que você faz
Separa resíduos/sucata por categoria (7 cores) e escolhe o destino na hierarquia
(reaproveitar > reciclar > incinerar > aterro). Limpa setores, ganha recursos.

## Por que importa para o jogo grande
- É o **núcleo econômico** reusado nas Eras seguintes (automação, cidade).
- Já embute a regra que vira **consequência**: fechar o ciclo rende mais; o
  atalho sujo rende menos (e, no jogo grande, cobra depois).

## Sistemas
- Triagem por tipo + roteamento de destino. Ver [33](33-coleta-e-triagem.md).
- Economia de sucata (recursos/EcoPontos). Ver [31](31-economia-circular-e-recursos.md).
- Loja de upgrades.

## Estado
Implementada na web em `src/` (JS puro + Vite), dirigida por `data/*.json`,
coberta por testes (`npm test`). Continua como protótipo válido enquanto o resto
cresce.
