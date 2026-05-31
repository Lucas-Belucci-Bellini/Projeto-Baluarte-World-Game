# prototype/ — Protótipo 2D web (referência viva)

A mecânica do **Projeto-Baluarte-World-Game** foi prototipada como **jogo
web 2D** antes do projeto Unreal. Ele continua sendo a referência **viva**
do comportamento esperado: regras, números, sensação de feedback.

## Onde está

O arquivo canônico é:

**`recycle-game/Jogo da Reciclagem.html`** —
[ver no GitHub](https://github.com/Lucas-Belucci-Bellini/Recycle-game/blob/main/Jogo%20da%20Reciclagem.html).

É um **arquivo único** (HTML + CSS + JS, sem build, sem dependências). Abre
em qualquer navegador.

## Como abrir

1. Baixe o arquivo (ou clone o repositório `recycle-game`).
2. Duplo-clique no `Jogo da Reciclagem.html` — abre no navegador.
3. Jogue uma partida. Limpe a "Pracinha".

## O que o protótipo faz (e que vai virar 3D na Unreal)

- 7 lixeiras CONAMA (azul/vermelho/verde/amarelo/marrom/cinza/laranja).
- 11 itens, incluindo 3 dúbios (papel engordurado, pilha, aerossol).
- Triagem por cor (arrastar).
- Roteamento por destino (clicar no painel).
- Hierarquia D-04 valendo pontos diferentes.
- Metas de setor, vitória "setor limpo", vidas restauradas.
- Loja com upgrades permanentes (vida extra, +crédito, +EcoPonto, dica).
- Persistência em LocalStorage.

## Por que o protótipo continua relevante

- **Protótipo no navegador**: roda sem instalar nada.
  Vai continuar sendo o canal "abre rápido em sala" mesmo depois que o jogo
  Unreal estiver pronto. O Unreal precisa ser instalado; o protótipo, não.
- **Sandbox de regras**: ajustar números/itens aqui é instantâneo. Quando
  bater a regra certa no protótipo, **a gente migra pra Unreal**.
- **Verificação cruzada**: as duas versões devem dar a mesma pontuação para
  a mesma sequência de ações. Útil pra QA do port.

## Não copio o arquivo pra cá?

A fonte canônica é o repo `recycle-game` (para evitar dois lugares pra editar
a mesma coisa). Quando o porte para Unreal começar, dá pra **trazer uma
cópia snapshot** pra cá. Por enquanto, vale só o link acima.
