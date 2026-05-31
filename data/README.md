# data/ — Tabelas do jogo (Unreal-ready)

Conteúdo do jogo **fora do código**, como decidido no
[doc 10 — Técnico][doc10]. Cada arquivo aqui é uma tabela; cada tabela é
diretamente importável como **DataTable** no Unreal.

[doc10]: https://github.com/Lucas-Belucci-Bellini/Recycle-game/blob/main/docs/10-tecnico-e-arquitetura.md

## Arquivos

| Arquivo | O que é | Linhas |
|---------|---------|--------|
| `bins.json` | As 7 lixeiras CONAMA (azul → laranja) | 7 |
| `destinos.json` | Hierarquia D-04 (reutilizar → aterro) + logística reversa | 6 |
| `items.json` | Itens jogáveis (com `dubio` e `inspect`) | 11 |
| `setores.json` | Fases / metas por setor | 5 |
| `upgrades.json` | Loja de upgrades permanentes | 4 |

## Como importar como DataTable na Unreal

Unreal aceita **CSV ou JSON** como source de DataTable, contanto que exista
uma `USTRUCT` C++ com os mesmos campos.

### 1. Defina o struct em C++

Exemplo para `bins.json`:

```cpp
USTRUCT(BlueprintType)
struct FBinRow : public FTableRowBase
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadOnly) FString Id;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) FString Name;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) FString PtColor;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) FLinearColor Color;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) FLinearColor DarkColor;
    UPROPERTY(EditAnywhere, BlueprintReadOnly) FString Symbol;
};
```

> Para JSON, Unreal usa o **nome da row** como a primeira chave do objeto.
> Como nossos JSONs hoje são **arrays** (não objetos), use **CSV** ou
> converta cada array para um objeto chaveado por `id` antes do import.

### 2. Converter array → objeto (uma linha de jq)

```bash
# bins.json (array → objeto chaveado por id)
jq 'INDEX(.id)' data/bins.json > data/bins-by-id.json
```

Repita para `items.json` e `setores.json`. `destinos.json` e `upgrades.json`
podem ficar como estão (`destinos.json` já é objeto; `upgrades.json` é array
mas pode virar objeto também).

### 3. No editor Unreal

1. `Content Browser → Right click → Miscellaneous → Data Table`.
2. Escolha o struct correspondente (ex.: `FBinRow`).
3. Reimport from JSON: aponte pro arquivo `*-by-id.json`.

## Invariantes que valem (importante para balanceamento)

Estas regras são **garantidas** no protótipo e devem se manter no port:

1. **Hierarquia monotônica**: `reutilizar.credits >= reciclar.credits >= incinerar.credits >= aterro.credits`.
2. **Incinerar e aterro têm `eco = 0`**: a regra de consequência D-04 depende disso.
3. **Destino ideal é a opção de maior rendimento**: para todo item, o
   `destino` (ideal) é o `option` com mais créditos E mais eco. Se você
   adicionar/editar itens, mantenha essa regra.
4. **Logística reversa só aparece em perigosos** (`correct: "laranja"`).
5. **Rejeito (cinza) nunca tem reciclar/reutilizar/compostar como opção**
   — só incinerar e aterro.

> No protótipo, essas regras são checadas por um script de teste
> (`/tmp/check.mjs`). Vale criar um equivalente nesse repositório quando o
> port começar.

## Atualizando os dados

A fonte canônica hoje é o **protótipo 2D** em
`recycle-game/Jogo da Reciclagem.html` (tabelas `BINS`, `ITEMS`, `DESTINOS`,
`SETORES`, `UPGRADES`). Se você alterar lá, **regenere os JSONs daqui** —
ou ao contrário (alterar JSONs aqui e regerar o JS).

Sugestão para evitar drift: quando o projeto Unreal estiver de pé, **estes
JSONs viram a fonte canônica** e o protótipo passa a importá-los em runtime.
