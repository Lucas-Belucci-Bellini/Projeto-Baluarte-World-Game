# 🌌 BLUEPRINT — Segunda Chance (a visão grande)

> **Documento-norte** do Projeto-Baluarte-World-Game. Aqui mora a **visão de
> longo prazo**: um jogo que junta as **ideias** de vários grandes títulos para
> criar **algo novo** — partindo do lixo da Terra até uma civilização que não
> repete o erro de se afogar no próprio desperdício.
>
> Isto é o **norte**, não o sprint. O que está jogável hoje (o jogo de
> reciclagem em `src/`) é a **semente**. A gente cresce em direção a esta visão
> em **fatias jogáveis**, uma de cada vez — sem prometer um AAA pra semana que
> vem, e sem nunca quebrar o que já funciona.

---

## 1. Premissa

A Terra está soterrada em lixo. Tarde demais para limpar tudo, cedo o bastante
para não desistir: você é enviado a um **sistema estelar distante** com uma
missão — **construir a segunda chance da humanidade**.

Você chega quase sem nada. O recurso que sobra é o que a humanidade sempre
soube produzir: **sucata**. A virada é moral e mecânica ao mesmo tempo —
**fechar o ciclo** (reutilizar → reciclar → fabricar) é o que faz a colônia
crescer. Quem queima e aterra, estagna. Quem fecha o ciclo, prospera e, no
fim, alcança as estrelas.

> A lição é a mesma do jogo de triagem que já existe — só que agora ela move um
> mundo inteiro.

---

## 2. ⚖️ Regra de ouro: **ideias, não arquivos**

Esta é inegociável e vem direto da sua orientação:

- ✅ **Estudamos as ideias** dos jogos de referência (o que cada um faz bem) e
  implementamos **do zero**, com código, arte, nomes e mundo **nossos**.
- ❌ **Não copiamos** arquivos, assets, modelos, texturas, código, mapas, sons
  ou nomes próprios desses jogos. Nada de `.pak`, ripagem, pacote extraído.
- ✅ Arte e áudio são **autorais** ou com **licença compatível** (CC0/CC com
  atribuição, ou Marketplace licenciado) — ver [`assets/README.md`](assets/README.md).

> É assim que se faz um jogo "inspirado em" sem virar cópia: pega-se a
> **mecânica/sensação** como referência e constrói-se uma identidade própria.
> (O repo `Recycle-game` já tem um doc sobre isso: "referência limpa e limites".)

---

## 3. A síntese — o que há de **novo**

Juntar nove jogos não é empilhar nove jogos. O que amarra tudo e é **nosso** é
um único fio condutor:

> **A sucata é o recurso central e o coração moral do jogo.**
> Você não só sobrevive e constrói — você constrói **certo**, fechando o ciclo,
> para que a segunda chance não afunde no lixo como a Terra afundou.

A economia circular (que o jogo de reciclagem já ensina) vira o **DNA** que
atravessa todas as camadas: sobreviver, automatizar, urbanizar, defender e
decidir. Esse é o "algo novo" — nenhum dos nove faz disso o eixo.

E o **universo Baluarte** entra como a camada de facção/personagens: as 26
equipes de elite (ALFA→ZULU) são quem você comanda nas operações; a lore das
Crônicas dá o pano de fundo. (É a ponte com o `Projeto-Baluarte`.)

---

## 4. Os 9 pilares (cada jogo → a ideia → como vira nosso)

| # | Referência | A **ideia** que pegamos | Como vira **nosso** |
|---|-----------|--------------------------|----------------------|
| 1 | **Satisfactory** | Automação e logística: esteiras, fábricas, cadeias de produção | **Cadeias de reciclagem**: sucata → matéria-prima → componentes → estruturas. Extensão direta da triagem. |
| 2 | **Space Engineers** | Engenharia modular com física: estruturas, veículos, energia | **Construir com material reciclado**: bases, veículos e estações funcionais (energia, estrutura). |
| 3 | **Cities Skylines** | Simulação urbana: zoneamento, população, serviços, fluxos | A colônia vira **cidade sustentável** — a anti-Terra: meta de lixo zero, energia limpa, ciclos fechados. |
| 4 | **Subnautica** | Sobrevivência + exploração de mundo alienígena + deslumbramento | **Explorar os biomas** do sistema novo (terra e mar), coletar, craftar, sobreviver, descobrir. |
| 5 | **Call of Duty** | Ação/FPS acessível: tiroteio gostoso, momentos marcantes | **Combate acessível** para defender a colônia — ritmo rápido, fácil de pegar. |
| 6 | **Arma 3** | Mil-sim: tática realista, operações grandes, comando de esquadrão | **Operações táticas** e comando das equipes de elite (Baluarte) em missões de defesa/expedição. |
| 7 | **Arma Reforger** | Mil-sim moderno + acessibilidade + editor/comunidade | Camada tática **mais acessível**, co-op e **editor de cenários**. |
| 8 | **Ark** | Sobrevivência + domar criaturas + tribos + progressão | **Fauna alienígena**: domar/aliar-se a criaturas, progressão de sobrevivência, defesa de base. |
| 9 | **Fallout 4** | RPG pós-apocalíptico + construir assentamento de sucata + escolhas | A **camada de RPG/narrativa** + construir de sucata + **escolhas** sobre que civilização criar. |

---

## 5. Da semente ao norte — as **Eras**

Cada Era é uma **fatia jogável e demonstrável**. Começamos no que já existe e
crescemos. Nenhuma Era depende de "ter tudo pronto"; cada uma fecha sozinha.

| Era | Nome | Pilares | Estado |
|-----|------|---------|--------|
| **0** | **Triagem** — economia circular na mão | (semente) | ✅ jogável (web, `src/`) |
| **1** | **Pouso & Sobrevivência** — chegar, catar sucata, craftar, sobreviver | Subnautica · Ark · Fallout | ⏳ próxima fatia |
| **2** | **Automação** — esteiras e fábricas processam o lixo em recursos | Satisfactory | 🔭 |
| **3** | **Engenharia & Cidade** — estruturas, energia, a colônia vira cidade | Space Engineers · Cities Skylines | 🔭 |
| **4** | **Defesa & Táticas** — combate e comando de esquadrão contra ameaças | CoD · Arma 3/Reforger · Ark | 🔭 |
| **5** | **Civilização & Órbita** — escolhas, expansão, a segunda chance feita | Fallout · interplanetário | 🔭 |

> A Era 0 é o jogo de reciclagem que já está aqui. A Era 1 é o próximo corte
> realista. As demais são o caminho — desenhado, mas não prometido para amanhã.

---

## 6. Como a gente constrói de verdade (realismo)

Para isto não virar fantasia de gaveta:

1. **Fatias jogáveis web-first.** Cada Era começa como um protótipo pequeno na
   stack atual (JS puro + Vite) — rápido de fazer, roda no navegador, todo
   mundo testa. Quando a mecânica estiver certa, aí sim se pensa em 3D pesado.
2. **O educacional continua shippável.** O jogo de triagem (Era 0) é a versão
   que "abre na escola sem instalar" e não pode quebrar enquanto o resto cresce.
3. **3D só quando fizer sentido.** A decisão D-03 (Unreal) vale para as Eras
   mais pesadas (3, 4, 5) **se** recursos/arte aparecerem. Até lá, protótipo.
4. **Dados fora do código.** Tudo dirigido por JSON (como o jogo já é), para
   ajustar conteúdo sem reprogramar — e para um dia virar DataTables no 3D.
5. **Ritmo solo + IA.** Uma fatia de cada vez, cada uma fechando um ciclo
   "frustração → ação → alívio → ambição".

---

## 7. Riscos e mitigação

| Risco | Mitigação |
|-------|-----------|
| Escopo explode ("e se eu add...") | Este blueprint é o **filtro**. Cada ideia entra como Era/fatia, não tudo de uma vez. |
| Virar cópia (legal) | **Regra de ouro** (§2): ideias, não arquivos. Arte/código nossos. |
| Equipe de 1 pessoa | Cada Era é **independente e pequena**; nada exige "o jogo inteiro". |
| Peso 3D / performance | Web-first; 3D só nas Eras pesadas e com teste cedo em hardware modesto. |
| Perder o que funciona | Versionamento por branch + `main` atualizado (ver `README`/`ROADMAP`). |

---

## 8. Próximo passo concreto

A Era 0 está feita. A **Era 1 (Pouso & Sobrevivência)** é o próximo corte
realista: um protótipo top-down web onde você **pousa, anda, cata sucata,
craft­a algo simples e sobrevive** — reaproveitando a economia da triagem
(a sucata coletada vira recurso). Pequeno, jogável, na stack atual.

> Quando quiser, a gente abre a Era 1 e eu monto o primeiro protótipo dela.
