/**
 * render2.js — Desenho da fábrica da Era 2 em canvas 2D.
 * Grade, construções (com seta de direção), itens em trânsito e prévia (ghost).
 */

import { MAQ, ITEM } from '../engine/data2.js';
import { DIRS, get } from './sim.js';

export function layout(canvas, f) {
  const cs = Math.max(18, Math.floor(Math.min((canvas.width - 16) / f.cols, (canvas.height - 160) / f.rows)));
  const ox = Math.floor((canvas.width - cs * f.cols) / 2);
  const oy = 84;
  return { cs, ox, oy };
}

export function celulaEm(f, lay, px, py) {
  const cx = Math.floor((px - lay.ox) / lay.cs);
  const cy = Math.floor((py - lay.oy) / lay.cs);
  if (cx < 0 || cy < 0 || cx >= f.cols || cy >= f.rows) return null;
  return { cx, cy };
}

function seta(ctx, x, y, dir, cs) {
  const [dx, dy] = DIRS[dir];
  const cx = x + cs / 2, cy = y + cs / 2, r = cs * 0.3;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.moveTo(cx + dx * r, cy + dy * r);
  ctx.lineTo(cx - dx * r * 0.5 - dy * r * 0.5, cy - dy * r * 0.5 + dx * r * 0.5);
  ctx.lineTo(cx - dx * r * 0.5 + dy * r * 0.5, cy - dy * r * 0.5 - dx * r * 0.5);
  ctx.closePath();
  ctx.fill();
}

function desenhaConstr(ctx, b, x, y, cs) {
  const def = MAQ[b.build];
  if (!def) return;
  ctx.fillStyle = def.cor;
  ctx.fillRect(x + 2, y + 2, cs - 4, cs - 4);
  ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 2, y + 2, cs - 4, cs - 4);

  if (def.tipo === 'esteira') {
    seta(ctx, x, y, b.dir, cs);
  } else {
    ctx.fillStyle = '#fff'; ctx.font = `${Math.floor(cs * 0.5)}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(def.icon, x + cs / 2, y + cs / 2 + 1);
    if (def.tipo !== 'sink') {
      // mini-seta de saída no canto
      const [dx, dy] = DIRS[b.dir];
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(x + cs / 2 + dx * cs * 0.34, y + cs / 2 + dy * cs * 0.34, cs * 0.07, 0, Math.PI * 2);
      ctx.fill();
    }
    // progresso da máquina
    if (def.tipo === 'maquina' && b.t > 0) {
      const p = 1 - b.t / def.tempo;
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(x + 3, y + cs - 6, (cs - 6) * p, 3);
    }
  }
}

function desenhaItem(ctx, itemId, x, y, cs) {
  const it = ITEM[itemId]; if (!it) return;
  ctx.fillStyle = it.cor;
  ctx.beginPath(); ctx.arc(x + cs / 2, y + cs / 2, cs * 0.16, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1.5; ctx.stroke();
}

export function render(ctx, f, state) {
  const cv = ctx.canvas;
  ctx.fillStyle = '#0a0e16'; ctx.fillRect(0, 0, cv.width, cv.height);
  const lay = layout(cv, f);
  const { cs, ox, oy } = lay;

  // grade
  ctx.fillStyle = '#0e141f'; ctx.fillRect(ox, oy, cs * f.cols, cs * f.rows);
  ctx.strokeStyle = '#1a2433'; ctx.lineWidth = 1;
  for (let x = 0; x <= f.cols; x++) { ctx.beginPath(); ctx.moveTo(ox + x * cs, oy); ctx.lineTo(ox + x * cs, oy + cs * f.rows); ctx.stroke(); }
  for (let y = 0; y <= f.rows; y++) { ctx.beginPath(); ctx.moveTo(ox, oy + y * cs); ctx.lineTo(ox + cs * f.cols, oy + y * cs); ctx.stroke(); }

  // construções
  for (const b of f.cells.values()) {
    desenhaConstr(ctx, b, ox + b.x * cs, oy + b.y * cs, cs);
  }
  // itens (esteira.item ou out de fonte/máquina)
  for (const b of f.cells.values()) {
    const def = MAQ[b.build]; if (!def) continue;
    const item = def.tipo === 'esteira' ? b.item : b.out;
    if (item) desenhaItem(ctx, item, ox + b.x * cs, oy + b.y * cs, cs);
  }

  // prévia (ghost) na célula sob o cursor
  if (state.hover) {
    const { cx, cy } = state.hover;
    const x = ox + cx * cs, y = oy + cy * cs;
    const ocupada = !!get(f, cx, cy);
    if (state.tool === 'remover') {
      ctx.strokeStyle = ocupada ? '#d23636' : '#5a6b7a'; ctx.lineWidth = 2;
      ctx.strokeRect(x + 2, y + 2, cs - 4, cs - 4);
    } else {
      ctx.globalAlpha = 0.5;
      desenhaConstr(ctx, { build: state.tool, dir: state.dir, x: cx, y: cy, t: 0 }, x, y, cs);
      ctx.globalAlpha = 1;
    }
  }
}
