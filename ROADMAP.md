# ROADMAP

Plano de construção do **Projeto-Baluarte-World-Game**, do MVP em diante.
Cada milestone (M) é um corte jogável e demonstrável.

## M0 — Onde estamos (✅ feito)

**Protótipo 2D web validando a mecânica.**

- ✅ 7 cores CONAMA.
- ✅ Roteamento por destino com hierarquia D-04.
- ✅ Itens dúbios (papel engordurado, pilha, aerossol).
- ✅ Metas de setor com vitória "setor limpo".
- ✅ Loja com upgrades permanentes.
- ✅ Relatório de fim de jogo (base do Modo Escola).
- ✅ Dados em tabelas (`BINS`, `ITEMS`, `DESTINOS`, `SETORES`, `UPGRADES`)
  — exportados pra JSON em [`data/`](data/).
- ✅ Stack Unreal decidida (D-03).

> O protótipo está em `recycle-game/Jogo da Reciclagem.html` e foi mergeado
> na main.

## M0.5 — Versão web jogável neste repo (✅ feito)

**Port modular do protótipo para a stack do Projeto-Baluarte (JS puro + Vite),
dirigido pelos JSONs de `data/`.**

- ✅ Projeto Vite (`index.html`, `src/`, `package.json`).
- ✅ Dados carregados de `data/*.json` (fonte única) — sem duplicar tabelas.
- ✅ Lógica separada em módulos: `engine/` (sem DOM) e `ui/` (DOM + arte).
- ✅ Pontuação isolada em `rules.js`, com **paridade de números** garantida por
      testes (`npm test`) — critério de aceite "mesmos números do protótipo".
- ✅ Invariantes pedagógicos (data/README.md) validados em runtime e no teste.
- ✅ `npm run build` gera estático deployável; roda no navegador (canal "sem
      instalar" + caminho de **integração na plataforma Baluarte**).
- **Critério de aceite**: jogar uma partida no navegador (`npm run dev`) com os
      mesmos resultados de pontuação do protótipo. ⏳ falta o playtest manual por
      outra pessoa (ver "Definição de pronto").

> Por que web e não Unreal já? Unreal não roda neste ambiente nem no navegador,
> e a meta imediata é **integrar com o Projeto-Baluarte** (plataforma web). A
> versão web cumpre isso hoje; o port Unreal (M1) segue como norte 3D.

## M1 — Projeto Unreal nasce (próximo)

**Esqueleto Unreal com a mecânica do MVP rodando em 3D.**

- [ ] Criar projeto Unreal em [`unreal/`](unreal/).
- [ ] Importar os JSONs de [`data/`](data/) como DataTables (ver
      [`data/README.md`](data/README.md)).
- [ ] Cena 3D mínima: chão, 7 lixeiras, um spawner de itens.
- [ ] Loop básico: pegar item → escolher lixeira → escolher destino →
      pontos. Sem arte caprichada — cubos coloridos servem.
- [ ] HUD: pontos, EcoPontos, vidas, barra de setor.
- [ ] Reproduzir as regras do protótipo (mesmos números).
- **Critério de aceite**: jogar uma partida completa em 3D, com os
      mesmos resultados de pontuação que no protótipo 2D.

> **Dependência**: arte placeholder (cubos OK) e Unreal Engine instalada.

## M2 — Conteúdo educativo cheio

**O jogo ensina, com clareza.**

- [ ] Tooltip "por quê?" ao errar (não só "OPA!").
- [ ] **Modo Escola** com tela de relatório por turma (exportável CSV).
- [ ] Mais itens (eletrônico, vidro quebrado, óleo de cozinha) — preencher
      buracos do currículo de reciclagem.
- [ ] Cartas educativas colecionáveis (1 por categoria).
- [ ] Mini-quiz entre fases (opcional).

## M3 — Polimento e identidade visual

**Estética do universo Baluarte.**

- [ ] Modelos 3D próprios para as 7 lixeiras (cumprir a identidade visual).
- [ ] Modelos 3D para os itens (substituir cubos coloridos).
- [ ] UI consistente com o universo Baluarte.
- [ ] Sons e feedback (manter o "feel" de cesta/combo do protótipo).
- [ ] Tela inicial e menu.

## M4 — Expansão de gameplay (opcional)

**Se ainda há tempo, e só se ainda há tempo.**

- [ ] Caçambas e capacidade variável das lixeiras.
- [ ] Esteira simples (1 esteira leva pra uma estação).
- [ ] Robô básico ("priorizar plástico").
- [ ] Cidade pequena que gera o lixo (NPCs simples).

## M∞ — Norte aspiracional

Os marcos abaixo são do [blueprint aspiracional][bp] — não fazem parte do
escopo deste projeto. Ficam aqui como referência:

[bp]: https://github.com/Lucas-Belucci-Bellini/Recycle-game/tree/main/docs/blueprint

- Era 3 — Cidade (Cities Skylines completo)
- Era 4 — Mundo (open world, construção livre)
- Era 5 — Órbita
- Era 6 — Interplanetário (terraformar planetas)

> Se um dia o projeto crescer pra fora do educacional, esses são os
> próximos passos. Não agora.

## Riscos conhecidos

| Risco | Mitigação |
|-------|-----------|
| Arte 3D demora muito | Cubos coloridos como placeholder; M1 não depende de arte final |
| Escopo cresce ("e se eu adicionar...") | Este ROADMAP é o filtro. Tudo fora vira blueprint |
| Performance no PC da escola | Unreal pode ser pesado; testar em hardware modesto cedo |
| Não roda no navegador | Aceito (D-03); protótipo web continua sendo o canal "sem instalar" |
| Equipe de 1 pessoa | Priorizar M1 → M2 → M3. M4 só se sobrar tempo |

## Definição de pronto (por milestone)

- [ ] Mecânica testada por outra pessoa (não eu/Claude).
- [ ] Sem regressão visível (pontuação bate com o protótipo).
- [ ] Commit limpo + push + tag opcional.
- [ ] Vídeo curto de demonstração (~30 s).
