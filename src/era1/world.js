/**
 * world.js — Mundo da Era 1: mapa por biomas, névoa de guerra e nós de recurso.
 *
 * Geração procedural simples (Voronoi de alguns centros de bioma + borda de
 * água), determinística por execução. Sem dependência de canvas — só dados de
 * mundo que o render e o jogo consomem.
 */

import { BIOMES, BIOME, RESOURCE } from '../engine/data1.js';

export const TILE = 28;
const LAND_BIOMES = BIOMES.filter((b) => !b.intransponivel);

function rnd(n) { return Math.floor(Math.random() * n); }

export function gerarMundo(W = 64, H = 64) {
  // 1) Centros de bioma (Voronoi) só com biomas de terra.
  const centros = LAND_BIOMES.map((b) => ({ b: b.id, x: 6 + rnd(W - 12), y: 6 + rnd(H - 12) }));

  const tiles = new Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // Borda do mapa = água (sensação de ilha).
      const borda = x < 3 || y < 3 || x >= W - 3 || y >= H - 3;
      let bioma = 'agua';
      if (!borda) {
        let melhor = Infinity;
        for (const c of centros) {
          const d = (c.x - x) ** 2 + (c.y - y) ** 2;
          if (d < melhor) { melhor = d; bioma = c.b; }
        }
        // Faixa costeira: terra colada na água vira costa.
        if (x < 5 || y < 5 || x >= W - 5 || y >= H - 5) bioma = 'costa';
      }
      tiles[y * W + x] = bioma;
    }
  }

  const seen = new Uint8Array(W * H); // 0 nunca visto, 1 já visto

  const idx = (x, y) => y * W + x;
  const dentro = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
  const biomaEm = (x, y) => (dentro(x, y) ? tiles[idx(x, y)] : 'agua');
  const passavel = (x, y) => dentro(x, y) && !BIOME[biomaEm(x, y)].intransponivel;

  // 2) Nós de recurso espalhados conforme o bioma do tile.
  const nodes = [];
  let tentativas = 0;
  while (nodes.length < 80 && tentativas < 4000) {
    tentativas++;
    const x = 3 + rnd(W - 6), y = 3 + rnd(H - 6);
    const bid = biomaEm(x, y);
    const recs = BIOME[bid].recursos;
    if (!recs || recs.length === 0) continue;
    // Sorteia recurso do bioma, favorecendo os menos raros.
    const pesos = recs.map((r) => 1 / (RESOURCE[r].raridade || 1));
    const total = pesos.reduce((a, b) => a + b, 0);
    let r = Math.random() * total, escolhido = recs[0];
    for (let i = 0; i < recs.length; i++) { r -= pesos[i]; if (r <= 0) { escolhido = recs[i]; break; } }
    nodes.push({ x, y, res: escolhido, qtd: 2 + rnd(4) });
  }

  // Spawn do jogador: centro, garantidamente em terra.
  let spawn = { x: (W / 2) | 0, y: (H / 2) | 0 };
  if (!passavel(spawn.x, spawn.y)) {
    for (let y = 3; y < H - 3 && !passavel(spawn.x, spawn.y); y++)
      for (let x = 3; x < W - 3; x++) if (passavel(x, y)) { spawn = { x, y }; break; }
  }

  // Cache inicial: destroços da própria nave perto do pouso. Garante sucata +
  // fibra suficientes para erguer o abrigo sem precisar achar floresta de cara.
  const cache = ['sucata', 'sucata', 'sucata', 'fibra', 'fibra', 'organico'];
  let c = 0, tCache = 0;
  while (c < 14 && tCache < 600) {
    tCache++;
    const ang = Math.random() * Math.PI * 2, r = 2 + Math.random() * 5;
    const x = Math.round(spawn.x + Math.cos(ang) * r), y = Math.round(spawn.y + Math.sin(ang) * r);
    if (!passavel(x, y)) continue;
    nodes.push({ x, y, res: cache[c % cache.length], qtd: 2 + rnd(3) });
    c++;
  }

  return {
    W, H, TILE, tiles, nodes, seen, spawn,
    idx, dentro, biomaEm, passavel,
    /** Marca como visto tudo num raio (em tiles) ao redor de (tx,ty). */
    revelar(tx, ty, raio) {
      for (let y = ty - raio; y <= ty + raio; y++)
        for (let x = tx - raio; x <= tx + raio; x++)
          if (dentro(x, y) && (x - tx) ** 2 + (y - ty) ** 2 <= raio * raio) seen[idx(x, y)] = 1;
    },
    /** Remove o nó coletado da lista. */
    removerNode(node) {
      const i = nodes.indexOf(node);
      if (i >= 0) nodes.splice(i, 1);
    },
  };
}
