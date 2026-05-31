# DESIGN — Escopo educacional

Este documento resume o que **vai ser construído**. O escopo é proporcional a
um **jogo educacional**, não AAA. A versão aspiracional (Space Engineers +
Satisfactory + Ark + Cities Skylines) vive separada como
[**blueprint** no repositório de docs][bp] e é o **norte**, não a meta de
sprint.

[bp]: https://github.com/Lucas-Belucci-Bellini/Recycle-game/tree/main/docs/blueprint

## Fantasia central

Você começa pequeno, **com as mãos sujas de lixo**, e descobre que **separar
direito e fechar o ciclo paga mais** do que queimar ou aterrar. A cidade vai
ficando mais limpa, e o terreno verde aparece. Esse é o loop — frustração →
ação → alívio → ambição (ver doc 02 do GDD).

## Pilares (do que NÃO se abre mão)

1. **As 7 cores CONAMA são o núcleo**: azul, vermelho, verde, amarelo,
   marrom, cinza, laranja. Já estão todas no protótipo.
2. **Hierarquia do lixo (D-04) é regra de jogo**: reutilizar > reciclar /
   compostar > incinerar > aterro. Os pontos diferem — **a lição vem dos
   números**, não do texto.
3. **Dúbio ensina por contraste**: itens que parecem uma coisa (papel sujo,
   pilha) mas são outra. Acertar o dúbio é a parte mais educativa.
4. **Logística reversa** é canal à parte (perigosos) — paga bem em EcoPontos
   porque previne contaminação.
5. **Setor limpo = vitória**: cada partida tem um objetivo claro — limpar o
   setor. O "governo reforma a área" é o payoff.

## O que entra no escopo educacional

Camadas, do MVP pra cima:

### Núcleo (já no protótipo 2D, vai virar 3D)
- 7 lixeiras / 11 itens (incluindo 3 dúbios).
- Triagem por cor (arrastar / interagir).
- Roteamento por destino (escolher: reutilizar/reciclar/compostar/incinerar/
  aterro/devolver).
- Créditos + EcoPontos, com a hierarquia D-04 valendo pontos diferentes.
- Metas de setor (limpar N itens) com vitória "setor limpo".
- Loja com 4 upgrades permanentes (vida extra, +crédito, +EcoPonto, dica do
  melhor destino).
- Relatório de fim de jogo com taxa de acerto por categoria (base do
  **Modo Escola**).

### Expansão educativa (versões 1.x)
- **Mais itens** (eletrônicos, vidros quebrados, óleo, medicamentos) —
  ampliando a árvore de exemplos.
- **Tooltip "por quê?"** ao errar — fica explícito o que ensinou.
- **Cartas educativas** colecionáveis sobre cada material/destino.
- **Mini-quiz** entre fases.
- **Modo Escola** com relatório de turma (CSV/PDF exportável).

### Expansão de gameplay (versões 2.x, opcional)
- **Caçambas e capacidade** das lixeiras (encher, esvaziar, comprar maior).
- **Esteiras simples** (1 esteira leva o lixo até uma estação).
- **Um robô básico** ("priorizar plástico").
- **Cidade pequena** que gera lixo (estilo Cities Skylines, mas modesto).

> Tudo além disso (mundo aberto, naves, terraformar planetas) é blueprint
> aspiracional — fica fora do escopo deste repo.

## O que NÃO entra (regras de escopo)

- Mundo aberto procedural ❌
- Construção livre por blocos (voxel) ❌
- Naves / espaço ❌
- Multiplayer ❌
- Renderização AAA (Nanite/Lumen full) — **uso moderado** ok
- Simulação urbana profunda (Cities Skylines completo) ❌
- Domesticação de criaturas (Ark) ❌

> Se um desses bater à porta, **paramos e replanejamos** — não enfiamos goela
> abaixo.

## Engine e arquitetura

- **Unreal Engine** (D-03). C++ + Blueprints.
- **Dados fora do código**: JSONs em [`data/`](data/) → DataTables com structs
  C++. O protótipo já está nesse formato — port direto.
- **Trade-off conhecido**: a versão final é executável nativo, não roda no
  navegador. O **protótipo 2D web** continua sendo o canal "abre na escola
  sem instalar" para a aula de reciclagem.
- Ver [doc 10 — Técnico][doc10] do GDD para detalhes.

[doc10]: https://github.com/Lucas-Belucci-Bellini/Recycle-game/blob/main/docs/10-tecnico-e-arquitetura.md

## Conteúdo pedagógico — onde está escrito

| Tema | Documento |
|------|-----------|
| As 7 cores CONAMA | [recycle-game doc 03][d03] |
| Hierarquia do lixo (D-04) | [recycle-game doc 03][d03] |
| Destinos e logística reversa | [recycle-game doc 03][d03] |
| Modo Escola | [recycle-game doc 08][d08] |
| Acessibilidade | [recycle-game doc 09][d09] |

[d03]: https://github.com/Lucas-Belucci-Bellini/Recycle-game/blob/main/docs/03-residuos-e-categorias.md
[d08]: https://github.com/Lucas-Belucci-Bellini/Recycle-game/blob/main/docs/08-conteudo-educativo-e-modo-escola.md
[d09]: https://github.com/Lucas-Belucci-Bellini/Recycle-game/blob/main/docs/09-ui-ux-e-acessibilidade.md

## Loop de uma partida (3 minutos)

1. **Setor sujo**: lixo aparece. Meta visível ("limpe 6 itens").
2. **Triagem**: separa por cor (drag, ou clique/toque no 3D).
3. **Destino**: escolhe pra onde vai. Vê os pontos ganhos pela escolha.
4. **Dúbio aparece**: você quase erra, lê a dica de inspeção, acerta.
5. **Erra um**: perde vida, recebe explicação clara.
6. **Setor limpo**: celebração, bônus, vidas restauradas, próximo setor
   maior. Loja desbloqueia melhorias permanentes.

## Métricas de qualidade educativa

A meta não é só "ser divertido" — é **ensinar**. Vamos medir:

- Taxa de acerto **por categoria** (qual cor a turma acerta menos).
- Tempo médio de decisão.
- Taxa de retorno (aluno volta a jogar?).
- Pré/pós-teste em sala (opcional, ver Modo Escola).
