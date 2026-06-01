/**
 * audio.js — SFX procedurais (WebAudio), 100% autorais (sem arquivos).
 *
 * Sintetiza os efeitos em código com osciladores. Precisa ser iniciado por um
 * gesto do usuário (o botão "Pousar") por causa da política de autoplay.
 */

let ctx = null;

export function initAudio() {
  if (ctx) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  } catch (e) { ctx = null; }
}

function tone(freq, dur, type = 'square', gain = 0.05, when = 0) {
  if (!ctx) return;
  const t0 = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur);
}

export const sfx = {
  coleta() { tone(660, 0.08, 'square', 0.045); },
  craft() { tone(440, 0.07, 'triangle', 0.06); tone(660, 0.09, 'triangle', 0.05, 0.06); },
  build() { tone(330, 0.08, 'square', 0.06); tone(495, 0.1, 'square', 0.05, 0.07); },
  hit() { tone(180, 0.07, 'sawtooth', 0.06); },
  hurt() { tone(110, 0.18, 'sawtooth', 0.08); },
  aliado() { tone(523, 0.1, 'triangle', 0.06); tone(784, 0.12, 'triangle', 0.05, 0.1); },
  noite() { tone(150, 0.5, 'sine', 0.05); tone(110, 0.6, 'sine', 0.04, 0.05); },
  loot() { tone(880, 0.1, 'square', 0.06); tone(1175, 0.12, 'square', 0.05, 0.1); },
  vitoria() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, 'triangle', 0.06, i * 0.13)); },
  derrota() { [330, 247, 165].forEach((f, i) => tone(f, 0.25, 'sawtooth', 0.07, i * 0.16)); },
};
