# 84 — Performance e orçamento

## Web
- Alvo: rodar liso em **hardware modesto** (PC de escola, celular).
- Simulação por tique de passo fixo; evitar trabalho por frame desnecessário.
- Limitar entidades ativas; usar grades/índices espaciais quando crescer.

## Orçamento de escopo (anti-explosão)
Cada Era tem um **teto**: nº de sistemas novos, entidades simultâneas, tamanho de
mapa. Passou do teto, vira backlog. Ver [94](94-riscos-e-mitigacao.md).

## 3D (futuro)
Uso **moderado** de recursos pesados (sem Nanite/Lumen full obrigatório). Testar
cedo em máquina fraca.

## Métrica
FPS estável > beleza. Um protótipo que roda e ensina vale mais que um lindo que
trava.
