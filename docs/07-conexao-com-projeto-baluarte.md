# 07 — Conexão com o Projeto-Baluarte

O `Projeto-Baluarte` é a plataforma-mãe (web, JS puro + Vite) com um universo
narrativo rico. Este jogo vive **nesse** universo e pode **integrar** nele.

## O que reaproveitamos (lore e dados)
- **26 equipes de elite (ALFA→ZULU)**: viram os esquadrões que você comanda nas
  Eras de defesa/tática. Ver [51 — Facções](51-faccoes-e-equipes-baluarte.md).
- **Universos/Crônicas**: pano de fundo e arcos narrativos.
- **Sistema de contas/XP/ranking** (`players-engine`) do Arcade: pode dar
  progressão/perfil compartilhados.

## Integração técnica
Mesma stack (JS puro + Vite) → o jogo pode entrar como **rota/jogo do Arcade**
do Baluarte, ou rodar standalone. Ver [80 — Arquitetura](80-arquitetura-tecnica.md).

## Direção
Era 0 (reciclagem) é o elo mais natural com o Baluarte hoje; as Eras seguintes
expandem o mesmo universo.
