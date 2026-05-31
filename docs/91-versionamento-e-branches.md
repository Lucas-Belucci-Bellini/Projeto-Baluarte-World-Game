# 91 — Versionamento e branches

Estratégia de segurança definida com o autor: **cada versão vira uma branch e o
`main` é atualizado**, para sempre haver como voltar.

## Fluxo
1. Desenvolver na branch de trabalho (ex.: `claude/...`).
2. A cada versão entregue, criar **branch de versão**:
   `versao/X.Y.Z-descricao` (ponto de restauração imutável na prática).
3. Atualizar o **`main`** (fast-forward/merge) para a versão boa.
4. PR como registro/revisão quando fizer sentido.

## Por quê
Se uma versão futura quebrar, basta voltar à `versao/anterior` ou ao `main`
estável anterior.

## Convenção de versões
- `0.1.0` — Era 0 web jogável.
- `0.2.0` — este plano-mestre (docs).
- `0.3.0+` — Era 1 e seguintes.

## Observação do ambiente
Push de **tags** está bloqueado (HTTP 403) aqui; por isso usamos **branches de
versão** como pontos de restauração.
