/**
 * main.js — Ponto de entrada + gerenciador de cenas do Baluarte World Game.
 *
 * Menu inicial → escolhe a Era. Mesma stack (JS puro + Vite) que o
 * Projeto-Baluarte, para integrar depois.
 *   - Era 0: Triagem (semente; ui/game.js).
 *   - Era 1: Pouso e Sobrevivência (era1/game.js).
 */

import './styles/game.css';
import './styles/world.css';
import { validate as validate0 } from './engine/data.js';
import { validate as validate1 } from './engine/data1.js';
import { initGame } from './ui/game.js';
import { startEra1 } from './era1/game.js';

// Em dev, falha barulhento se algum dado quebrar um invariante.
[['Era 0', validate0], ['Era 1', validate1]].forEach(([nome, fn]) => {
  const problems = fn();
  if (problems.length) {
    const msg = `Invariantes ${nome} violados:\n - ` + problems.join('\n - ');
    if (import.meta.env && import.meta.env.DEV) throw new Error(msg);
    else console.error(msg);
  }
});

const scenes = {
  menu: document.getElementById('menu'),
  era0: document.getElementById('era0'),
  era1: document.getElementById('era1'),
};
function show(name) {
  for (const [k, el] of Object.entries(scenes)) el.classList.toggle('hidden', k !== name);
}

let era0Iniciado = false;
let era1 = null;

function abrirEra0() {
  show('era0');
  if (!era0Iniciado) { initGame(); era0Iniciado = true; } // init uma vez; estado persiste
}

function abrirEra1() {
  show('era1');
  era1 = startEra1(scenes.era1);
  era1.onMenu(() => { era1.destroy(); era1 = null; show('menu'); });
  era1.onRestart(() => { era1.destroy(); abrirEra1(); });
}

document.querySelectorAll('#menu .menu-era').forEach((b) => {
  b.onclick = () => (b.dataset.era === '1' ? abrirEra1() : abrirEra0());
});
document.getElementById('era0-menu').onclick = () => show('menu');

show('menu');
