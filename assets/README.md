# assets/ — Arte, áudio e UI (estrutura pronta)

Pasta para os **recursos finais** do jogo. Vazia ainda — preencher conforme
forem ficando prontos. A estrutura abaixo é a sugerida.

## Estrutura

```
assets/
├── art/        — modelos 3D, texturas, materiais
│   ├── bins/   — as 7 lixeiras (azul, vermelho, verde, amarelo, marrom, cinza, laranja)
│   ├── items/  — os 11 itens (garrafa PET, pilha, banana, ...)
│   ├── city/   — quando entrarmos em ambiente urbano (M3+)
│   ├── chars/  — personagem do jogador, NPCs (se houver)
│   └── vfx/    — partículas (confete, fumaça, etc.)
├── audio/      — música e efeitos sonoros
│   ├── music/  — trilha
│   ├── sfx/    — "cesta!", "errou!", combo, etc.
│   └── voice/  — narração / personagem (opcional)
└── ui/         — sprites, ícones, fontes
    ├── icons/  — ícones das 7 cores, dos destinos (♻️🌱🔥⛰️↩️🔄)
    ├── fonts/  — Nunito + Fredoka (usadas no protótipo)
    └── frames/ — molduras, balões, decorações
```

## Identidade visual

Referências (do protótipo 2D, que já tem identidade definida):

- **Estilo**: cartoon limpo, contornos pretos grossos, paleta saturada.
- **Fontes**: `Nunito` (HUD, números) e `Fredoka` (texto narrativo) — Google
  Fonts, gratuitas.
- **Cores das lixeiras**: padrão CONAMA (ver [`../data/bins.json`](../data/bins.json)).
- **Símbolos das lixeiras**: reciclagem (♻️) para reciclável; lixeira de
  rejeito (cinza) tem **lixo**; perigoso (laranja) tem **triângulo de
  risco**. Coerência visual entre 2D e 3D.

## Licenças

**Importante** — todo recurso adicionado aqui precisa ter licença compatível:

- ✅ Arte feita **por você ou pela equipe**: ok.
- ✅ Assets com licença **CC0 / Creative Commons** (atribuição quando exigido).
- ✅ Pacotes do **Unreal Marketplace** que você comprou/licenciou.
- ❌ Recursos extraídos de **jogos comerciais** (Satisfactory, etc.).
- ❌ Arte do Google Imagens sem checar licença.

Quando adicionar um asset, deixe um `LICENSE.txt` ou comentário com a fonte.
Se vier de pacote Marketplace, indique o pacote.

## Placeholders aceitos durante M1 e M2

Pra não bloquear o desenvolvimento esperando arte final, está liberado usar:

- **Primitivas Unreal** (cubo, cilindro, esfera) coloridas para representar
  itens e lixeiras.
- **Material temporário simples** (cor sólida + contorno).
- **Sons gratuitos** do freesound.org com licença compatível.

O foco do M1 é **mecânica funcionando**, não polimento visual.
