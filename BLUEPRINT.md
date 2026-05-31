# 🌌 BLUEPRINT — Segunda Chance (a visão grande)

> **Documento-norte** do Projeto-Baluarte-World-Game. Um jogo **AAA** de
> sobrevivência, construção e consequência, ambientado num sistema de **outra
> galáxia**. Junta as **ideias** (nunca os arquivos) de vários grandes títulos
> para criar algo novo.
>
> **A função do jogo:** *cada ação sua decide se a humanidade terá — ou não — uma
> segunda chance.*

---

## 1. Premissa

A Terra ruiu sob a própria poluição e o descarte de lixo. Como último lance, uma
expedição de **até 16 pessoas** é enviada a um sistema em **outra galáxia** com
uma missão: **preparar o local para a humanidade recomeçar**.

Vocês chegam quase sem nada, num mundo selvagem. O que sobra é o que a
humanidade sempre soube produzir — **sucata**. A partir dela: sobreviver,
construir, e provar que dá para recomeçar **sem repetir o erro**.

---

## 2. A função: peso e consequência

Este **não é um jogo educativo**. É um jogo de **consequência**. Existe um
**Índice da Segunda Chance** que cada ação empurra:

- Fechar o ciclo, manter os colonos vivos, energia limpa → o recomeço fica viável.
- Atalho sujo, bioma esgotado, gente perdida → o futuro encolhe — e o mundo
  **cobra depois** (consequência tardia).

O desfecho reflete isso (ver [docs/54](docs/54-missoes-modos-e-finais.md) e
[docs/60](docs/60-consequencia-e-segunda-chance.md)). Pode ser **usado** na
educação, mas a função é dramática, não didática.

---

## 3. Até 16 pessoas — co-op e solo

- **Co-op**: até **16 jogadores** dividem a colônia, cada um com funções.
- **Solo**: você joga um personagem e **comanda os outros 15 como NPCs** —
  atribuindo funções, posições e tarefas (camada de ordens estilo mil-sim).

Ver [docs/61](docs/61-cooperativo-e-comando-de-npcs.md).

---

## 4. ⚖️ Regra de ouro: **ideias, não arquivos**

Inegociável: estudamos **como** os jogos de referência fazem algo bem e
implementamos **do zero**, com código, arte, nomes e mundo **nossos**. Nada de
assets, modelos, sons, código, mapas ou marcas dos jogos originais. Arte/áudio
**autorais** ou com licença compatível. Ver [docs/04](docs/04-regra-de-ouro-ideias-nao-arquivos.md).

---

## 5. A síntese — o que há de novo

Juntar nove jogos não é empilhá-los. O fio condutor — e nosso — é:

> **Sucata é o recurso central, e cada escolha pesa no futuro da espécie.**
> Você sobrevive, automatiza, urbaniza e defende — e o jogo nunca esquece se você
> fez isso **certo**.

Survival, automação e citybuilder existem. Amarrar tudo a um **Índice da Segunda
Chance**, com consequência tardia e um elenco de 16 colonos comandáveis, é a
nossa marca.

---

## 6. Os 9 pilares (ideias que pegamos)

| # | Referência | A **ideia** | Vira nosso |
|---|-----------|-------------|------------|
| 1 | **Satisfactory** | Automação/logística | Cadeias que processam sucata |
| 2 | **Space Engineers** | Engenharia modular | Construir de material reciclado |
| 3 | **Cities Skylines** | Simulação urbana | Colônia → cidade viável |
| 4 | **Subnautica** | Exploração/sobrevivência | Mundo alienígena por biomas |
| 5 | **Call of Duty** | Ação/FPS | Combate para defender a colônia |
| 6 | **Arma 3** | Mil-sim/comando | Comandar os 16 / esquadrões Baluarte |
| 7 | **Arma Reforger** | Tática acessível + editor | Co-op e cenários compartilhados |
| 8 | **Ark** | Criaturas/sobrevivência | Fauna alienígena aliável |
| 9 | **Fallout 4** | RPG + assentamento + consequência | Construir de sucata + escolhas que pesam |

Detalhe em [docs/10–19](docs/10-pilares-visao-geral.md).

---

## 7. Conexão com o Baluarte

Os **16 especialistas** mapeiam nas equipes de elite ALFA→ZULU do
`Projeto-Baluarte` (ver [docs/51](docs/51-faccoes-e-equipes-baluarte.md)). Mesma
stack web (JS puro + Vite) nos protótipos → integra à plataforma. Ver
[docs/07](docs/07-conexao-com-projeto-baluarte.md).

---

## 8. As Eras (fatias jogáveis, do atual ao norte)

| Era | Nome | Estado |
|-----|------|--------|
| 0 | Triagem (a semente: processar sucata) | ✅ jogável (web) |
| 1 | Pouso e sobrevivência | ⏳ próxima |
| 2 | Automação | 🔭 |
| 3 | Engenharia e cidade | 🔭 |
| 4 | Defesa e táticas | 🔭 |
| 5 | Civilização e órbita | 🔭 |

Detalhe em [docs/20–26](docs/20-eras-visao-geral.md).

---

## 9. Como a gente constrói (alvo AAA, caminho realista)

O **alvo é AAA**. Mas, com equipe pequena, chegamos lá por **fatias jogáveis**:

1. **Protótipo web-first** para validar cada sistema rápido (a stack atual).
2. Quando a mecânica fecha e o valor justifica, sobe para **3D (Unreal, D-03)**.
3. **Dados fora do código** (JSON) → migram de graça para o 3D.
4. **Versionamento de segurança**: cada versão vira branch + `main` atualizado
   (ver [docs/91](docs/91-versionamento-e-branches.md)).

> O protótipo não é o teto — é o andaime. O teto é o jogo AAA.

---

## 10. Próximo passo

A **Era 1 (Pouso e Sobrevivência)** é a próxima fatia: pousar, explorar, catar
sucata, craftar abrigo e sobreviver — com 1–3 colonos NPC comandáveis como
semente do sistema de 16. Backlog em [docs/92](docs/92-backlog-inicial.md).
