# Projeto-Baluarte-World-Game

> Jogo **educacional** sobre reciclagem e economia circular — parte do universo
> **Baluarte**. Tem uma **versão web 2D jogável agora** (JS puro + Vite, a mesma
> stack do [Projeto-Baluarte][pb], para integrar depois) e o norte de longo
> prazo em **Unreal Engine** (3D, D-03), com a mecânica já validada.

[pb]: https://github.com/Lucas-Belucci-Bellini/Projeto-Baluarte

## Rodar a versão web (jogável agora)

Stack idêntica à do Projeto-Baluarte — **JS puro (ES2022) + Vite**, sem
framework, sem TypeScript. Roda no navegador (ótimo pro "abre na escola sem
instalar").

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # gera dist/ (estático, deployável)
npm test         # invariantes dos dados + paridade de pontuação
```

O código vive em [`src/`](src/) e lê os dados canônicos de [`data/`](data/):

- `src/main.js` — bootstrap (valida invariantes, inicia o jogo).
- `src/engine/` — `data.js` (carrega JSON), `rules.js` (pontuação pura),
  `state.js` (estado + save), `validate.js` (invariantes pedagógicos).
- `src/ui/` — `game.js` (jogo + arraste), `shop.js` (loja), `art.js` (SVG).

## Pitch

Catar lixo, separar pelas **7 cores CONAMA**, dar o destino certo, limpar
setores da cidade e crescer — aprendendo, **na mão**, por que reciclar paga e
queimar/aterrar não. Não é joguinho de cartilha: a lição **vem da regra**.

Há um norte de longo prazo (catar → fábrica → cidade → planeta → órbita →
civilização interplanetária — ver [blueprint aspiracional][bp]). Mas o
**escopo deste repositório é educacional**, proporcional a um projeto de
estudante: foco no que ensina e cabe no prazo.

[bp]: https://github.com/Lucas-Belucci-Bellini/Recycle-game/tree/main/docs/blueprint

## Estado atual

- ✅ **Versão web 2D jogável (esta pasta)**: port fiel do protótipo em **JS puro
  + Vite** (`src/`, `index.html`), dirigido pelos JSONs de [`data/`](data/). 7
  cores, hierarquia D-04, créditos, EcoPontos, metas de setor, loja, relatório
  de aprendizado e save. Mesmos números do protótipo (cobertos por `npm test`).
- ✅ **Protótipo 2D web original**: arquivo único de referência, em
  [`recycle-game/Jogo da Reciclagem.html`][proto].
- ✅ **Design e dados consolidados**: itens, lixeiras, destinos, setores e
  upgrades já em **JSON** em [`data/`](data/) — fonte única, também prontos pra
  importar como **DataTables na Unreal**.
- ⏳ **Projeto Unreal**: ainda não iniciado. Esperando arte/recursos.
- ⏳ **Arte 3D**: estrutura pronta em [`assets/`](assets/) — preencher.

[proto]: https://github.com/Lucas-Belucci-Bellini/Recycle-game/blob/main/Jogo%20da%20Reciclagem.html

## Estrutura do repositório

```
Projeto-Baluarte-World-Game/
├── README.md          ← você está aqui
├── DESIGN.md          ← design educacional (escopo do que vai ser construído)
├── ROADMAP.md         ← MVP → versões seguintes, marcos
├── index.html         ← entrada da versão web (Vite)
├── package.json       ← scripts: dev / build / preview / test
├── vite.config.js
├── src/               ← código da versão web (JS puro, modular)
│   ├── main.js
│   ├── engine/        ← data · rules · state · validate (lógica, sem DOM)
│   └── ui/            ← game · shop · art (DOM + arte SVG)
├── tests/             ← rules.test.mjs (invariantes + paridade de pontuação)
├── data/              ← tabelas do jogo em JSON (fonte única; Unreal-ready)
│   ├── bins.json      ← as 7 lixeiras CONAMA
│   ├── destinos.json  ← hierarquia do lixo (D-04)
│   ├── items.json     ← itens jogáveis (com destinos e dúbios)
│   ├── setores.json   ← fases / metas
│   └── upgrades.json  ← loja
├── prototype/         ← snapshot do protótipo 2D web (referência viva)
├── unreal/            ← projeto Unreal entra aqui
└── assets/            ← arte, áudio, UI (estrutura pronta, preencher)
    ├── art/
    ├── audio/
    └── ui/
```

## Decisões já fechadas

| ID | O que | Decidido |
|----|-------|----------|
| **D-03** | Engine | **Unreal Engine** (C++ + Blueprints) |
| **D-04** | Hierarquia do lixo (reciclar > incinerar > aterro) paga diferente | ✅ implementado no protótipo |
| **D-05** | 7 cores CONAMA como núcleo | ✅ todas implementadas |
| **Escopo** | Não é AAA — é educacional | ✅ este repositório |

## Como começar (quando os recursos chegarem)

1. **Abrir o protótipo 2D** ([Jogo da Reciclagem.html][proto]) e jogar uma
   partida — pra entender a mecânica que vai ser portada.
2. **Ler [DESIGN.md](DESIGN.md)** — design educacional consolidado.
3. **Ler [ROADMAP.md](ROADMAP.md)** — o que construir primeiro.
4. **Criar o projeto Unreal** em [`unreal/`](unreal/).
5. **Importar os JSONs** de [`data/`](data/) como DataTables (ver
   [`data/README.md`](data/README.md)).
6. **Começar pelo MVP** descrito no ROADMAP.

## Links

- 🎮 **Protótipo jogável**: [recycle-game][proto]
- 📚 **GDD completo**: [recycle-game/docs/][gdd]
- 🌌 **Visão aspiracional (AAA, "do lixo à civilização interplanetária")**:
  [docs/blueprint/][bp]

[gdd]: https://github.com/Lucas-Belucci-Bellini/Recycle-game/tree/main/docs
