/**
 * render.js — Desenho do mundo da Era 1 em canvas 2D.
 *
 * Câmera centrada no jogador, névoa de guerra (não-visto = preto; explorado mas
 * fora de vista = escurecido) e camada de escuridão noturna com "buracos" de luz
 * ao redor do jogador e das fogueiras.
 */

import { BIOME, RESOURCE, CREATURE } from '../engine/data1.js';
import { escuridao } from '../engine/survival.js';

let lightLayer = null;
function ensureLight(w, h) {
  if (!lightLayer || lightLayer.width !== w || lightLayer.height !== h) {
    lightLayer = document.createElement('canvas');
    lightLayer.width = w; lightLayer.height = h;
  }
  return lightLayer;
}

function disco(ctx, x, y, r, cor) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = cor; ctx.fill();
}

export function render(ctx, world, state) {
  const cv = ctx.canvas;
  const VW = cv.width, VH = cv.height;
  const T = world.TILE;
  const px = state.player.x, py = state.player.y;
  const camX = px - VW / 2, camY = py - VH / 2;
  const ptx = Math.floor(px / T), pty = Math.floor(py / T);
  const visR = state.visRaio || 6;

  ctx.fillStyle = '#080a0f';
  ctx.fillRect(0, 0, VW, VH);

  // --- Tiles ---
  const x0 = Math.floor(camX / T) - 1, y0 = Math.floor(camY / T) - 1;
  const x1 = Math.ceil((camX + VW) / T) + 1, y1 = Math.ceil((camY + VH) / T) + 1;
  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      if (!world.dentro(tx, ty)) continue;
      const sx = Math.round(tx * T - camX), sy = Math.round(ty * T - camY);
      if (!world.seen[world.idx(tx, ty)]) { ctx.fillStyle = '#05070b'; ctx.fillRect(sx, sy, T, T); continue; }
      ctx.fillStyle = BIOME[world.biomaEm(tx, ty)].cor;
      ctx.fillRect(sx, sy, T, T);
      // textura sutil (xadrez leve)
      if (((tx + ty) & 1) === 0) { ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fillRect(sx, sy, T, T); }
      // explorado mas fora de vista → escurece
      if ((tx - ptx) ** 2 + (ty - pty) ** 2 > visR * visR) {
        ctx.fillStyle = 'rgba(3,6,12,0.5)'; ctx.fillRect(sx, sy, T, T);
      }
    }
  }

  // --- Nós de recurso ---
  for (const n of world.nodes) {
    if (!world.seen[world.idx(n.x, n.y)]) continue;
    const sx = n.x * T - camX + T / 2, sy = n.y * T - camY + T / 2;
    ctx.save();
    ctx.translate(sx, sy); ctx.rotate(Math.PI / 4);
    ctx.fillStyle = RESOURCE[n.res].cor;
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 2;
    ctx.fillRect(-6, -6, 12, 12); ctx.strokeRect(-6, -6, 12, 12);
    ctx.restore();
  }

  // --- Destroços (POIs de exploração) ---
  for (const w of world.wrecks) {
    if (w.aberto || !world.seen[world.idx(w.x, w.y)]) continue;
    const sx = w.x * T - camX + T / 2, sy = w.y * T - camY + T / 2;
    ctx.fillStyle = '#6b7280'; ctx.strokeStyle = '#11161c'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx - 9, sy + 5); ctx.lineTo(sx + 9, sy + 5); ctx.lineTo(sx + 5, sy - 6); ctx.lineTo(sx - 6, sy - 4);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffd166'; ctx.font = 'bold 12px Nunito, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('?', sx, sy + 3);
  }

  // --- Estruturas ---
  for (const s of state.structures) {
    const sx = s.x - camX, sy = s.y - camY;
    if (s.tipo === 'fogueira') {
      disco(ctx, sx, sy, 7, '#e8842a');
      disco(ctx, sx, sy - 3, 4, '#ffd166');
    } else if (s.tipo === 'abrigo') {
      ctx.fillStyle = '#8a5a33'; ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sx, sy - 12); ctx.lineTo(sx + 12, sy + 8); ctx.lineTo(sx - 12, sy + 8); ctx.closePath();
      ctx.fill(); ctx.stroke();
    } else if (s.tipo === 'horta') {
      ctx.fillStyle = '#5a3e22'; ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
      ctx.fillRect(sx - 10, sy - 1, 20, 9); ctx.strokeRect(sx - 10, sy - 1, 20, 9);
      ctx.strokeStyle = '#7fd06a'; ctx.lineWidth = 2;
      for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(sx + i * 6, sy + 3); ctx.lineTo(sx + i * 6, sy - 7); ctx.stroke(); }
    } else if (s.tipo === 'baliza') {
      ctx.strokeStyle = '#46c7e8'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(sx - 9, sy + 11); ctx.lineTo(sx, sy - 15); ctx.lineTo(sx + 9, sy + 11); ctx.stroke();
      disco(ctx, sx, sy - 15, 3.5, '#9fe8ff');
    }
  }

  // --- Criaturas ---
  for (const c of state.creatures) {
    const sx = c.x - camX, sy = c.y - camY;
    const hostil = c.comp === 'hostil';
    const aliado = c.comp === 'aliado';
    disco(ctx, sx, sy, hostil ? 8 : 7, aliado ? '#5fd08a' : CREATURE[c.tipo].cor);
    ctx.strokeStyle = hostil ? '#3a0a06' : aliado ? '#0c3a22' : 'rgba(0,0,0,0.5)';
    ctx.lineWidth = (hostil || aliado) ? 2.5 : 2; ctx.stroke();
    if (hostil) {
      disco(ctx, sx - 2.5, sy - 1, 1.4, '#ffd2cc'); disco(ctx, sx + 2.5, sy - 1, 1.4, '#ffd2cc');
    }
    if (aliado) {
      ctx.fillStyle = '#dffaf0'; ctx.font = '9px Nunito, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('aliado', sx, sy - 11);
    }
  }

  // --- Colonos (NPCs) ---
  for (const n of state.npcs) {
    if (!n.viva) continue;
    const sx = n.x - camX, sy = n.y - camY;
    disco(ctx, sx, sy, 8, '#2f9d8f');
    ctx.lineWidth = 2; ctx.strokeStyle = '#0c2b27'; ctx.stroke();
    ctx.fillStyle = '#dffaf4'; ctx.font = '10px Nunito, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(n.nome, sx, sy - 12);
  }

  // --- Jogador ---
  const pcx = px - camX, pcy = py - camY;
  disco(ctx, pcx, pcy, 9, '#f0b315');
  ctx.lineWidth = 2.5; ctx.strokeStyle = '#3a2a05'; ctx.stroke();
  // indicador de direção
  disco(ctx, pcx + state.player.dx * 9, pcy + state.player.dy * 9, 3, '#3a2a05');

  // --- Prévia de construção (modo posicionamento) ---
  if (state.ghost) {
    const gx = state.ghost.x - camX, gy = state.ghost.y - camY;
    const cor = state.ghost.valido ? '#5fd08a' : '#d23636';
    ctx.globalAlpha = 0.5; disco(ctx, gx, gy, 11, cor); ctx.globalAlpha = 1;
    ctx.strokeStyle = cor; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(gx, gy, 13, 0, Math.PI * 2); ctx.stroke();
  }

  // --- Noite: escuridão com luzes ---
  const dark = escuridao(state.clock);
  if (dark > 0.02) {
    const ll = ensureLight(VW, VH);
    const lc = ll.getContext('2d');
    lc.clearRect(0, 0, VW, VH);
    lc.fillStyle = `rgba(4,7,18,${dark})`;
    lc.fillRect(0, 0, VW, VH);
    lc.globalCompositeOperation = 'destination-out';
    const luz = (x, y, r) => {
      const g = lc.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(0.6, 'rgba(0,0,0,0.7)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      lc.fillStyle = g; lc.beginPath(); lc.arc(x, y, r, 0, Math.PI * 2); lc.fill();
    };
    luz(pcx, pcy, T * (state.tools && state.tools.tocha ? 4.6 : 3));
    for (const s of state.structures) {
      if (s.tipo === 'fogueira') luz(s.x - camX, s.y - camY, T * 3.6);
      if (s.tipo === 'abrigo') luz(s.x - camX, s.y - camY, T * 2.2);
    }
    lc.globalCompositeOperation = 'source-over';
    ctx.drawImage(ll, 0, 0);
  }
}
