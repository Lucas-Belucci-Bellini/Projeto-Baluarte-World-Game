# unreal/ — Projeto Unreal (placeholder)

Esta pasta é onde o **projeto Unreal** do Projeto-Baluarte-World-Game vai
viver. Ainda não foi criado — esperando os recursos (arte, modelos, etc.).

## Quando estiver pronto, criar:

```
unreal/
└── ProjetoBaluarteWorldGame/   (nome do projeto Unreal)
    ├── ProjetoBaluarteWorldGame.uproject
    ├── Source/
    │   └── ProjetoBaluarteWorldGame/
    │       ├── ProjetoBaluarteWorldGame.Build.cs
    │       ├── Public/
    │       │   ├── BinRow.h           (FBinRow struct)
    │       │   ├── DestinoRow.h       (FDestinoRow struct)
    │       │   ├── ItemRow.h          (FItemRow struct)
    │       │   ├── SetorRow.h         (FSetorRow struct)
    │       │   ├── UpgradeRow.h       (FUpgradeRow struct)
    │       │   └── GameLogic.h        (regras de jogo: handleDrop, resolveRouting...)
    │       └── Private/
    │           └── GameLogic.cpp
    ├── Content/
    │   ├── Data/                      (DataTables importados dos JSONs)
    │   ├── Blueprints/
    │   ├── Maps/
    │   └── UI/                        (HUD, painel de destino, loja)
    └── Config/
```

## Stack confirmada (D-03)

- **Unreal Engine** (versão a confirmar — última estável).
- **C++** para a lógica nuclear (state machine, scoring, save).
- **Blueprints** para UI e prototipagem rápida.
- **DataTables + USTRUCTs** importando os JSONs de [`../data/`](../data/).

## Como começar (quando for o momento)

1. Instalar Unreal Engine (Epic Games Launcher).
2. `File → New Project → Games → Blank (C++)`.
3. Salvar em `unreal/ProjetoBaluarteWorldGame/`.
4. Definir as `USTRUCT`s em `Source/.../Public/*.h` (ver
   [`../data/README.md`](../data/README.md) para exemplos).
5. Importar os JSONs como DataTables.
6. Cena mínima: chão + 7 lixeiras + spawner de itens. Cubos coloridos
   bastam — arte vem depois.
7. Implementar a regra básica (drag → bin → destino → pontos).

> **Critério de aceite do M1** (ver [`../ROADMAP.md`](../ROADMAP.md)):
> jogar uma partida em 3D, com os mesmos números de pontuação que no
> protótipo 2D.

## .gitignore Unreal

O `.gitignore` na raiz deste projeto já tem entradas para `Binaries/`,
`DerivedDataCache/`, `Intermediate/`, `Saved/`, etc. — pra não vazar lixo
de build pro repositório.
