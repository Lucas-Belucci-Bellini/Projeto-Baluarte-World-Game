# DESIGN — resumo

O design completo vive em [`docs/`](docs/README.md) (GDD, 60+ documentos) e o
resumo de uma página em [`BLUEPRINT.md`](BLUEPRINT.md). Este arquivo é o
atalho.

## O que é
Jogo **AAA** de sobrevivência + construção + consequência. Até 16 colonos numa
galáxia distante preparam o recomeço da humanidade. **Cada ação decide se a
segunda chance acontece.** Não é um jogo educativo (pode ser usado na educação,
mas a função é dramática).

## Pilares
1. **Consequência** é o coração (Índice da Segunda Chance — [`docs/60`](docs/60-consequencia-e-segunda-chance.md)).
2. **Sucata** é o recurso central; fechar o ciclo compensa, atalho cobra depois.
3. **Até 16** — co-op e solo com comando de NPCs ([`docs/61`](docs/61-cooperativo-e-comando-de-npcs.md)).
4. **Fatias jogáveis** (Eras): alvo AAA, caminho web-first → 3D.
5. **Ideias, não arquivos** ([`docs/04`](docs/04-regra-de-ouro-ideias-nao-arquivos.md)).
6. **Dados fora do código** (JSON).

## Os 9 pilares (ideias)
Satisfactory · Space Engineers · Cities Skylines · Subnautica · Call of Duty ·
Arma 3 · Arma Reforger · Ark · Fallout 4. Detalhe em [`docs/10–19`](docs/10-pilares-visao-geral.md).

## Eras
0 Triagem (✅ web) → 1 Sobrevivência → 2 Automação → 3 Engenharia & Cidade →
4 Defesa & Táticas → 5 Civilização & Órbita. Ver [`docs/20`](docs/20-eras-visao-geral.md).

## Engine
- **Web (JS+Vite)** para protótipos de cada Era — a fatia atual roda assim.
- **Unreal (D-03)** para as Eras pesadas, reaproveitando os dados (DataTables).
