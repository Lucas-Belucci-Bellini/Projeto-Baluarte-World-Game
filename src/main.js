/**
 * main.js — Ponto de entrada do Baluarte World Game (versão web).
 *
 * Stack idêntica à do Projeto-Baluarte (JS puro ES2022 + Vite), para que este
 * jogo possa ser embutido na plataforma depois. Sem framework, sem build extra.
 */

import './styles/game.css';
import { validate } from './engine/data.js';
import { initGame } from './ui/game.js';

// Em desenvolvimento, falha barulhento se os dados quebrarem um invariante
// pedagógico (ver data/README.md). Em produção só registra no console.
const problems = validate();
if (problems.length) {
  const msg = 'Invariantes de dados violados:\n - ' + problems.join('\n - ');
  if (import.meta.env && import.meta.env.DEV) throw new Error(msg);
  else console.error(msg);
}

initGame();
