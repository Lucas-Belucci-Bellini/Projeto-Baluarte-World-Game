# 80 — Arquitetura técnica

## Princípio
Lógica separada de apresentação; dados fora do código. O que já fizemos na Era 0
é o molde para todas as Eras.

## Camadas (web)
- `engine/` — sem DOM: dados, regras (pontuação/economia), estado, validação.
- `ui/` — DOM + arte (render, input, telas).
- `data/` — JSON canônico (fonte única).

## Por Era
Cada Era adiciona módulos em `engine/` (ex.: `automation.js`, `city.js`) e telas
em `ui/`, reusando o núcleo econômico. Sem reescrever o que existe.

## Integração Baluarte
Mesma stack (JS puro + Vite) → encaixa como rota/jogo do Arcade. Ver [07](07-conexao-com-projeto-baluarte.md).

## Caminho 3D
Eras pesadas podem migrar para Unreal (D-03) reusando os **dados** (DataTables).
Ver [83](83-web-para-3d.md).
