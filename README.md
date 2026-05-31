# Projeto-Baluarte-World-Game — *Segunda Chance*

> Jogo **AAA** de sobrevivência, construção e **consequência**, do universo
> **Baluarte**. A Terra ruiu sob a poluição e o lixo; uma expedição de **até 16
> pessoas** vai a **outra galáxia** preparar o recomeço da humanidade.
>
> **A função do jogo:** *cada ação sua decide se a humanidade terá — ou não — uma
> segunda chance.* Junta as **ideias** (nunca os arquivos) de vários grandes
> jogos para criar algo novo.

## 🌌 O plano

- **Resumo de 1 página**: [`BLUEPRINT.md`](BLUEPRINT.md)
- **Plano completo (GDD, 60+ documentos)**: [`docs/`](docs/README.md)

Modos: **co-op até 16 jogadores** e **solo** comandando os outros 15 como NPCs
(ver [`docs/61`](docs/61-cooperativo-e-comando-de-npcs.md)). O eixo é a **sucata**
e a **consequência** (ver [`docs/60`](docs/60-consequencia-e-segunda-chance.md)).

> **Alvo AAA, caminho realista.** Construímos por **fatias jogáveis** (Eras):
> protótipo web-first valida cada sistema; o 3D (Unreal, D-03) vem quando o valor
> justifica. Ver [`docs/20`](docs/20-eras-visao-geral.md).

## Rodar a fatia atual (Era 0 — processar sucata)

Stack idêntica à do [Projeto-Baluarte][pb] — **JS puro (ES2022) + Vite**, sem
framework, sem TypeScript. Roda no navegador.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ estático
npm test         # invariantes dos dados + paridade de pontuação
```

[pb]: https://github.com/Lucas-Belucci-Bellini/Projeto-Baluarte

A Era 0 é a **semente** de mecânica (separar/processar sucata pela hierarquia
D-04) que, em escala, vira a economia de toda a colônia. Código em [`src/`](src/),
dados em [`data/`](data/).

## Estrutura do repositório

```
Projeto-Baluarte-World-Game/
├── README.md          ← você está aqui
├── BLUEPRINT.md       ← visão grande (1 página)
├── docs/              ← GDD completo (60+ documentos)
├── DESIGN.md          ← resumo de design (aponta pro GDD)
├── ROADMAP.md         ← marcos (Eras) — detalhe em docs/90
├── index.html         ← entrada da fatia web (Vite)
├── package.json       ← scripts: dev / build / preview / test
├── vite.config.js
├── src/               ← código da fatia web (JS puro, modular)
│   ├── main.js
│   ├── engine/        ← data · rules · state · validate (lógica, sem DOM)
│   └── ui/            ← game · shop · art (DOM + arte SVG)
├── tests/             ← rules.test.mjs (invariantes + paridade)
├── data/              ← tabelas em JSON (fonte única; também Unreal-ready)
├── prototype/         ← snapshot do protótipo original (referência)
├── unreal/            ← projeto Unreal entra aqui (Eras pesadas)
└── assets/            ← arte, áudio, UI (autorais/licenciados — ver regra de ouro)
```

## Regra de ouro

**Ideias, não arquivos.** Estudamos as mecânicas dos jogos de referência e
implementamos do zero, com arte/código/mundo nossos. Nada de assets, código ou
marcas de terceiros. Ver [`docs/04`](docs/04-regra-de-ouro-ideias-nao-arquivos.md).

## Versionamento (segurança)

Cada versão vira uma branch (`versao/X.Y.Z-...`) **e** o `main` é atualizado —
sempre dá para voltar. Ver [`docs/91`](docs/91-versionamento-e-branches.md).
