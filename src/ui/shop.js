/**
 * shop.js — Loja de upgrades PERMANENTES.
 *
 * Compra com créditos (♻️) acumulados entre partidas. Recebe o elemento do
 * palco e um callback para atualizar o HUD, evitando dependência circular com
 * game.js.
 */

import { UPGRADES } from '../engine/data.js';
import { state, upgLevel, persist } from '../engine/state.js';
import { upgradeCost, maxLives } from '../engine/rules.js';

export function openShop(stage, refreshHUD) {
  if (document.getElementById('shopModal')) return;
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'shopModal';
  modal.innerHTML = `
    <div class="card shop">
      <h2>🛒 Loja</h2>
      <div class="shop-credits" id="shopCredits">Você tem <b>${state.credits} ♻️</b></div>
      <div class="shop-list" id="shopList"></div>
      <button id="shopClose">FECHAR</button>
    </div>`;
  stage.appendChild(modal);
  renderShopList(refreshHUD);
  document.getElementById('shopClose').onclick = () => modal.remove();
}

function renderShopList(refreshHUD) {
  const list = document.getElementById('shopList');
  if (!list) return;
  list.innerHTML = UPGRADES.map((u) => {
    const lvl = upgLevel(u.id);
    const maxed = lvl >= u.max;
    const cost = upgradeCost(u, lvl);
    const can = !maxed && state.credits >= cost;
    const lvlText = u.max > 1 ? `Nível ${lvl}/${u.max}` : (lvl ? 'Adquirido' : '');
    const action = maxed
      ? `<span class="shop-maxed">${u.max > 1 ? 'MÁX' : '✓'}</span>`
      : `<button class="shop-buy" data-id="${u.id}" ${can ? '' : 'disabled'}>${cost} ♻️</button>`;
    return `<div class="shop-item">
      <div class="shop-ico">${u.icon}</div>
      <div class="shop-info">
        <div class="shop-name">${u.nome} <small>${lvlText}</small></div>
        <div class="shop-desc">${u.desc}</div>
      </div>
      ${action}
    </div>`;
  }).join('');
  list.querySelectorAll('.shop-buy').forEach((b) => {
    b.onclick = () => buyUpgrade(b.dataset.id, refreshHUD);
  });
}

function buyUpgrade(id, refreshHUD) {
  const u = UPGRADES.find((x) => x.id === id);
  const lvl = upgLevel(id);
  if (!u || lvl >= u.max) return;
  const cost = upgradeCost(u, lvl);
  if (state.credits < cost) return;
  state.credits -= cost;
  state.upgrades[id] = lvl + 1;
  if (id === 'vida') {
    state.maxLives = maxLives(state.upgrades.vida);
    state.lives = Math.min(state.maxLives, state.lives + 1);
  }
  persist();
  refreshHUD();
  const cd = document.getElementById('shopCredits');
  if (cd) cd.innerHTML = `Você tem <b>${state.credits} ♻️</b>`;
  renderShopList(refreshHUD);
}
