/**
 * art.js — Arte vetorial (SVG inline) das lixeiras e itens.
 *
 * Portado fielmente do protótipo 2D (`recycle-game/Jogo da Reciclagem.html`),
 * que continua sendo a referência viva da identidade visual (cartoon limpo,
 * contornos pretos grossos, paleta CONAMA saturada — ver `assets/README.md`).
 *
 * As cores entram por parâmetro/CSS-var, então a mesma arte serve para os
 * dados de `data/bins.json` (hex) e para os temas do universo Baluarte.
 */

export function hoopSVG() {
  // Basketball backboard + rim + net (sized to match bin width ~ 160)
  return `
  <svg viewBox="0 0 160 86" preserveAspectRatio="xMidYMax meet">
    <!-- pole going down behind bin -->
    <rect x="76" y="40" width="8" height="46" fill="#9aa0a6" stroke="var(--ink)" stroke-width="2.5"/>
    <!-- backboard -->
    <rect x="30" y="4" width="100" height="50" rx="4" fill="#fff" stroke="var(--ink)" stroke-width="3.5"/>
    <rect x="30" y="4" width="100" height="10" fill="#e4eef9" stroke="var(--ink)" stroke-width="3.5"/>
    <!-- inner square -->
    <rect x="62" y="22" width="36" height="22" fill="none" stroke="#e84444" stroke-width="3"/>
    <!-- rim -->
    <ellipse cx="80" cy="52" rx="30" ry="5" fill="none" stroke="#e84444" stroke-width="4"/>
    <ellipse cx="80" cy="52" rx="30" ry="5" fill="#962222" opacity="0.25"/>
    <!-- net -->
    <g class="net" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round">
      <path d="M 52 53 L 56 80"/>
      <path d="M 60 53 L 63 80"/>
      <path d="M 68 53 L 69 80"/>
      <path d="M 76 53 L 76 80"/>
      <path d="M 84 53 L 84 80"/>
      <path d="M 92 53 L 91 80"/>
      <path d="M 100 53 L 97 80"/>
      <path d="M 108 53 L 104 80"/>
      <!-- horizontal weaves -->
      <path d="M 54 62 Q 80 70 106 62"/>
      <path d="M 56 72 Q 80 80 104 72"/>
    </g>
  </svg>`;
}

export function basketballSVG() {
  return `
  <svg viewBox="0 0 120 120" width="100%" height="100%">
    <defs>
      <radialGradient id="bbg" cx="35%" cy="30%">
        <stop offset="0%" stop-color="#ffb469"/>
        <stop offset="55%" stop-color="#e8842a"/>
        <stop offset="100%" stop-color="#a85510"/>
      </radialGradient>
    </defs>
    <circle cx="60" cy="60" r="50" fill="url(#bbg)" stroke="var(--ink)" stroke-width="4"/>
    <!-- seams -->
    <path d="M 10 60 L 110 60" stroke="var(--ink)" stroke-width="3" fill="none"/>
    <path d="M 60 10 L 60 110" stroke="var(--ink)" stroke-width="3" fill="none"/>
    <path d="M 24 26 Q 60 60 24 94" stroke="var(--ink)" stroke-width="3" fill="none"/>
    <path d="M 96 26 Q 60 60 96 94" stroke="var(--ink)" stroke-width="3" fill="none"/>
    <!-- highlight -->
    <ellipse cx="42" cy="34" rx="12" ry="7" fill="#fff" opacity="0.45"/>
  </svg>`;
}

export function binSVG(color, dark, symbol) {
  return `
  <svg viewBox="0 0 160 200" width="100%" height="auto" style="overflow: visible">
    <!-- shadow -->
    <ellipse cx="80" cy="195" rx="60" ry="6" fill="rgba(0,0,0,0.18)"/>
    <!-- body -->
    <path d="M 30 50 L 38 190 Q 38 195 44 195 L 116 195 Q 122 195 122 190 L 130 50 Z"
          fill="${color}" stroke="var(--ink)" stroke-width="4" stroke-linejoin="round"/>
    <!-- darker side shading -->
    <path d="M 105 50 L 122 50 L 116 195 Q 122 195 122 190 L 130 50 Z"
          fill="${dark}" opacity="0.55"/>
    <!-- vertical ridges -->
    <path d="M 55 60 L 60 188" stroke="${dark}" stroke-width="2.5" opacity="0.45" fill="none" stroke-linecap="round"/>
    <path d="M 80 60 L 80 188" stroke="${dark}" stroke-width="2.5" opacity="0.45" fill="none" stroke-linecap="round"/>
    <path d="M 105 60 L 100 188" stroke="${dark}" stroke-width="2.5" opacity="0.45" fill="none" stroke-linecap="round"/>
    <!-- center symbol: recycle (default), trash (rejeito) or hazard (perigoso) -->
    <circle cx="80" cy="115" r="22" fill="#fff" stroke="var(--ink)" stroke-width="3"/>
    ${symbol === 'rejeito' ? `
    <g transform="translate(80 115)" stroke="${dark}" stroke-width="2.5" fill="${color}" stroke-linejoin="round">
      <rect x="-13" y="-6" width="26" height="22" rx="3"/>
      <rect x="-16" y="-11" width="32" height="6" rx="2"/>
      <rect x="-5" y="-16" width="10" height="5" rx="2"/>
      <line x1="-6" y1="-1" x2="-6" y2="11" stroke-linecap="round"/>
      <line x1="0" y1="-1" x2="0" y2="11" stroke-linecap="round"/>
      <line x1="6" y1="-1" x2="6" y2="11" stroke-linecap="round"/>
    </g>` : symbol === 'perigoso' ? `
    <g transform="translate(80 115)" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round">
      <path d="M 0 -16 L 17 13 L -17 13 Z" fill="#f5d000"/>
      <rect x="-2.4" y="-7" width="4.8" height="12" rx="2" fill="var(--ink)" stroke="none"/>
      <circle cx="0" cy="9" r="2.6" fill="var(--ink)" stroke="none"/>
    </g>` : `
    <g transform="translate(80 115)" stroke="${dark}" stroke-width="2.5" fill="${color}" stroke-linejoin="round">
      <path d="M -10 -2 L -4 -11 L 2 -11 L -1 -16 L -12 -16 L -16 -8 Z"/>
      <path d="M 1 -10 L 11 -6 L 13 0 L 18 -3 L 16 -13 L 7 -16 Z"/>
      <path d="M 10 4 L 4 13 L -2 13 L 1 18 L 12 18 L 16 10 Z"/>
    </g>`}
    <!-- rim -->
    <rect x="22" y="42" width="116" height="16" rx="4" fill="${dark}" stroke="var(--ink)" stroke-width="4"/>
    <!-- lid -->
    <g class="lid">
      <rect x="18" y="28" width="124" height="18" rx="6" fill="${color}" stroke="var(--ink)" stroke-width="4"/>
      <rect x="68" y="20" width="24" height="10" rx="4" fill="${dark}" stroke="var(--ink)" stroke-width="3"/>
    </g>
  </svg>`;
}

export function paperBallSVG() {
  // Crumpled paper ball
  return `
  <svg viewBox="0 0 120 120" width="100%" height="100%">
    <defs>
      <radialGradient id="pg" cx="40%" cy="35%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="60%" stop-color="#f4ecd6"/>
        <stop offset="100%" stop-color="#d9c99a"/>
      </radialGradient>
    </defs>
    <path d="M 60 8
             C 80 6, 100 20, 108 38
             C 116 56, 112 80, 96 96
             C 80 112, 52 116, 32 104
             C 12 92, 6 70, 12 50
             C 18 30, 38 10, 60 8 Z"
          fill="url(#pg)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
    <!-- crumple folds -->
    <path d="M 30 40 L 50 32 L 64 48 L 56 62 L 38 60 Z" fill="none" stroke="var(--ink-soft)" stroke-width="2" stroke-linejoin="round" opacity="0.6"/>
    <path d="M 70 28 L 90 36 L 96 56 L 80 64 L 68 50 Z" fill="none" stroke="var(--ink-soft)" stroke-width="2" stroke-linejoin="round" opacity="0.6"/>
    <path d="M 42 70 L 62 64 L 78 74 L 70 92 L 48 92 Z" fill="none" stroke="var(--ink-soft)" stroke-width="2" stroke-linejoin="round" opacity="0.6"/>
    <path d="M 18 58 L 32 70 L 28 88" fill="none" stroke="var(--ink-soft)" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
    <path d="M 100 60 L 88 76 L 92 92" fill="none" stroke="var(--ink-soft)" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
    <!-- highlight -->
    <ellipse cx="42" cy="32" rx="10" ry="6" fill="#fff" opacity="0.7"/>
  </svg>`;
}

export function bottleSVG() {
  return `
  <svg viewBox="0 0 120 120" width="100%" height="100%">
    <!-- cap -->
    <rect x="48" y="6" width="24" height="14" rx="3" fill="#3b8de0" stroke="var(--ink)" stroke-width="3"/>
    <line x1="52" y1="9" x2="52" y2="17" stroke="#1f5a99" stroke-width="2"/>
    <line x1="60" y1="9" x2="60" y2="17" stroke="#1f5a99" stroke-width="2"/>
    <line x1="68" y1="9" x2="68" y2="17" stroke="#1f5a99" stroke-width="2"/>
    <!-- neck -->
    <path d="M 52 20 L 52 32 Q 42 38 42 52 L 42 100 Q 42 112 54 112 L 66 112 Q 78 112 78 100 L 78 52 Q 78 38 68 32 L 68 20 Z"
          fill="#c7e7ff" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
    <!-- ring -->
    <rect x="48" y="26" width="24" height="4" fill="#a3d4f5" stroke="var(--ink)" stroke-width="2"/>
    <!-- label -->
    <rect x="44" y="62" width="32" height="24" fill="#ffffff" stroke="var(--ink)" stroke-width="2.5"/>
    <line x1="48" y1="70" x2="72" y2="70" stroke="var(--ink-soft)" stroke-width="2"/>
    <line x1="48" y1="76" x2="68" y2="76" stroke="var(--ink-soft)" stroke-width="2"/>
    <!-- highlight -->
    <path d="M 48 40 Q 46 70, 50 100" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.8"/>
  </svg>`;
}

export function jarSVG() {
  return `
  <svg viewBox="0 0 120 120" width="100%" height="100%">
    <!-- lid -->
    <rect x="34" y="14" width="52" height="14" rx="3" fill="#9c6b3c" stroke="var(--ink)" stroke-width="3"/>
    <rect x="34" y="18" width="52" height="3" fill="#6b4523"/>
    <!-- body -->
    <path d="M 32 28 L 32 36 Q 28 40 28 50 L 28 102 Q 28 112 38 112 L 82 112 Q 92 112 92 102 L 92 50 Q 92 40 88 36 L 88 28 Z"
          fill="#bfe9c8" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round" opacity="0.92"/>
    <!-- shine -->
    <path d="M 38 44 Q 34 70, 40 100" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.7"/>
    <path d="M 80 50 Q 84 72, 78 96" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.5"/>
    <!-- label -->
    <rect x="40" y="62" width="40" height="20" fill="#fff8e7" stroke="var(--ink)" stroke-width="2"/>
    <text x="60" y="76" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="10" fill="var(--ink)">JAM</text>
  </svg>`;
}

export function canSVG() {
  return `
  <svg viewBox="0 0 120 120" width="100%" height="100%">
    <!-- top rim -->
    <ellipse cx="60" cy="20" rx="22" ry="6" fill="#d9d9d9" stroke="var(--ink)" stroke-width="3"/>
    <ellipse cx="60" cy="19" rx="18" ry="4" fill="#8e8e8e" stroke="var(--ink)" stroke-width="2"/>
    <!-- pull tab -->
    <ellipse cx="60" cy="18" rx="7" ry="3" fill="none" stroke="var(--ink)" stroke-width="2"/>
    <!-- body -->
    <path d="M 38 22 L 38 100 Q 38 108 60 108 Q 82 108 82 100 L 82 22"
          fill="#e84444" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
    <!-- side curve fill -->
    <ellipse cx="60" cy="22" rx="22" ry="5" fill="#e84444" stroke="var(--ink)" stroke-width="3"/>
    <!-- highlight -->
    <rect x="42" y="32" width="4" height="60" rx="2" fill="#fff" opacity="0.6"/>
    <!-- label -->
    <rect x="38" y="48" width="44" height="32" fill="#fff" stroke="var(--ink)" stroke-width="2.5"/>
    <text x="60" y="70" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="14" fill="#e84444">COLA</text>
    <!-- bottom rim -->
    <ellipse cx="60" cy="100" rx="22" ry="5" fill="#b83333" stroke="var(--ink)" stroke-width="2.5"/>
  </svg>`;
}

export function bananaSVG() {
  return `
  <svg viewBox="0 0 120 120" width="100%" height="100%">
    <!-- peel pieces -->
    <path d="M 60 14
             C 86 22, 102 50, 96 84
             C 92 100, 78 108, 66 102
             C 76 94, 80 78, 74 64
             C 68 50, 64 38, 60 14 Z"
          fill="#f0c419" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
    <path d="M 60 14
             C 34 22, 18 50, 24 84
             C 28 100, 42 108, 54 102
             C 44 94, 40 78, 46 64
             C 52 50, 56 38, 60 14 Z"
          fill="#f5d04a" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
    <!-- middle peel -->
    <path d="M 54 102 Q 60 96, 66 102 L 64 110 Q 60 113, 56 110 Z"
          fill="#8a6a1b" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- stem -->
    <rect x="55" y="6" width="10" height="14" rx="3" fill="#6b4d12" stroke="var(--ink)" stroke-width="2.5"/>
    <!-- darken lines -->
    <path d="M 60 22 Q 64 50, 68 80" fill="none" stroke="#c69314" stroke-width="2" opacity="0.7"/>
    <path d="M 60 22 Q 56 50, 52 80" fill="none" stroke="#c69314" stroke-width="2" opacity="0.7"/>
    <!-- spots -->
    <circle cx="44" cy="60" r="2.5" fill="#8a6a1b" opacity="0.6"/>
    <circle cx="78" cy="70" r="2" fill="#8a6a1b" opacity="0.6"/>
    <circle cx="36" cy="80" r="2" fill="#8a6a1b" opacity="0.6"/>
  </svg>`;
}

export function newspaperSVG() {
  return `
  <svg viewBox="0 0 120 120" width="100%" height="100%">
    <!-- back paper -->
    <rect x="22" y="20" width="76" height="84" rx="3" fill="#e8e2cc" stroke="var(--ink)" stroke-width="3" transform="rotate(-4 60 62)"/>
    <!-- front paper -->
    <rect x="20" y="24" width="76" height="84" rx="3" fill="#fffaea" stroke="var(--ink)" stroke-width="3" transform="rotate(3 60 66)"/>
    <g transform="rotate(3 60 66)">
      <rect x="26" y="32" width="64" height="10" fill="var(--ink)"/>
      <text x="58" y="40" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="8" fill="#fffaea">JORNAL DE HOJE</text>
      <line x1="26" y1="50" x2="90" y2="50" stroke="var(--ink-soft)" stroke-width="2"/>
      <rect x="26" y="56" width="28" height="22" fill="#cfd9e0" stroke="var(--ink-soft)" stroke-width="1.5"/>
      <line x1="58" y1="58" x2="90" y2="58" stroke="var(--ink-soft)" stroke-width="1.5"/>
      <line x1="58" y1="64" x2="90" y2="64" stroke="var(--ink-soft)" stroke-width="1.5"/>
      <line x1="58" y1="70" x2="86" y2="70" stroke="var(--ink-soft)" stroke-width="1.5"/>
      <line x1="58" y1="76" x2="90" y2="76" stroke="var(--ink-soft)" stroke-width="1.5"/>
      <line x1="26" y1="86" x2="90" y2="86" stroke="var(--ink-soft)" stroke-width="1.5"/>
      <line x1="26" y1="92" x2="84" y2="92" stroke="var(--ink-soft)" stroke-width="1.5"/>
      <line x1="26" y1="98" x2="90" y2="98" stroke="var(--ink-soft)" stroke-width="1.5"/>
    </g>
  </svg>`;
}

export function cupSVG() {
  return `
  <svg viewBox="0 0 120 120" width="100%" height="100%">
    <!-- cup body trapezoid -->
    <path d="M 30 24 L 90 24 L 82 108 Q 82 112 78 112 L 42 112 Q 38 112 38 108 Z"
          fill="#ffffff" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round" opacity="0.96"/>
    <!-- rim -->
    <ellipse cx="60" cy="24" rx="30" ry="6" fill="#fdfdfd" stroke="var(--ink)" stroke-width="3"/>
    <ellipse cx="60" cy="23" rx="26" ry="4" fill="#e0e0e0"/>
    <!-- ridges -->
    <line x1="44" y1="34" x2="42" y2="108" stroke="#cccccc" stroke-width="2"/>
    <line x1="60" y1="34" x2="60" y2="108" stroke="#cccccc" stroke-width="2"/>
    <line x1="76" y1="34" x2="78" y2="108" stroke="#cccccc" stroke-width="2"/>
    <!-- recycle triangle hint -->
    <g transform="translate(60 72)" stroke="var(--ink-soft)" stroke-width="1.5" fill="none">
      <path d="M -8 4 L 0 -8 L 8 4 Z"/>
    </g>
  </svg>`;
}

export function greasyPaperSVG() {
  return `
  <svg viewBox="0 0 120 120" width="100%" height="100%">
    <!-- napkin sheet -->
    <path d="M 24 30 L 92 22 L 100 92 L 32 102 Z"
          fill="#fbf3df" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
    <!-- crease folds -->
    <path d="M 40 26 L 48 98" fill="none" stroke="var(--ink-soft)" stroke-width="1.5" opacity="0.5"/>
    <path d="M 64 24 L 70 96" fill="none" stroke="var(--ink-soft)" stroke-width="1.5" opacity="0.5"/>
    <path d="M 28 56 L 97 49" fill="none" stroke="var(--ink-soft)" stroke-width="1.5" opacity="0.5"/>
    <!-- grease stains (translucent) -->
    <ellipse cx="54" cy="52" rx="18" ry="14" fill="#b5872e" opacity="0.32"/>
    <ellipse cx="74" cy="74" rx="12" ry="10" fill="#9c6b1f" opacity="0.30"/>
    <ellipse cx="40" cy="80" rx="9" ry="7" fill="#b5872e" opacity="0.28"/>
    <!-- crumbs -->
    <circle cx="60" cy="48" r="2" fill="#6b4d12" opacity="0.6"/>
    <circle cx="70" cy="70" r="1.8" fill="#6b4d12" opacity="0.6"/>
  </svg>`;
}

export function spongeSVG() {
  return `
  <svg viewBox="0 0 120 120" width="100%" height="100%">
    <!-- yellow foam body -->
    <rect x="18" y="48" width="84" height="44" rx="12" fill="#ffe14d" stroke="var(--ink)" stroke-width="3"/>
    <!-- green scrub top -->
    <path d="M 18 56 Q 18 40 30 38 L 90 32 Q 102 32 102 46 L 102 56 Z"
          fill="#3fae5a" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
    <!-- scrub speckles -->
    <circle cx="34" cy="46" r="2" fill="#2b7d40"/>
    <circle cx="50" cy="42" r="2" fill="#2b7d40"/>
    <circle cx="66" cy="45" r="2" fill="#2b7d40"/>
    <circle cx="82" cy="42" r="2" fill="#2b7d40"/>
    <!-- foam pores -->
    <circle cx="34" cy="70" r="3" fill="#e8c63c"/>
    <circle cx="52" cy="78" r="3" fill="#e8c63c"/>
    <circle cx="70" cy="68" r="3" fill="#e8c63c"/>
    <circle cx="86" cy="78" r="3" fill="#e8c63c"/>
    <circle cx="44" cy="62" r="2.4" fill="#e8c63c"/>
    <circle cx="78" cy="60" r="2.4" fill="#e8c63c"/>
  </svg>`;
}

export function batterySVG() {
  return `
  <svg viewBox="0 0 120 120" width="100%" height="100%">
    <!-- positive terminal -->
    <rect x="50" y="12" width="20" height="10" rx="2" fill="#cfcfcf" stroke="var(--ink)" stroke-width="3"/>
    <!-- body -->
    <rect x="38" y="20" width="44" height="86" rx="6" fill="#2e7d32" stroke="var(--ink)" stroke-width="3"/>
    <!-- top band -->
    <path d="M 38 26 Q 38 20 44 20 L 76 20 Q 82 20 82 26 L 82 40 L 38 40 Z" fill="#f0b315" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
    <text x="60" y="35" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="13" fill="var(--ink)">+</text>
    <!-- lightning bolt -->
    <path d="M 64 50 L 50 74 L 59 74 L 53 94 L 73 66 L 62 66 Z" fill="#ffe14d" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- minus at bottom -->
    <rect x="52" y="98" width="16" height="4" rx="2" fill="#fff"/>
  </svg>`;
}

export function sprayCanSVG() {
  return `
  <svg viewBox="0 0 120 120" width="100%" height="100%">
    <!-- nozzle -->
    <rect x="52" y="10" width="16" height="8" rx="2" fill="#444" stroke="var(--ink)" stroke-width="2.5"/>
    <!-- collar -->
    <rect x="46" y="16" width="28" height="10" rx="3" fill="#bdbdbd" stroke="var(--ink)" stroke-width="2.5"/>
    <!-- body -->
    <rect x="42" y="24" width="36" height="84" rx="8" fill="#e8761b" stroke="var(--ink)" stroke-width="3"/>
    <!-- hazard label -->
    <rect x="48" y="50" width="24" height="30" rx="3" fill="#fff" stroke="var(--ink)" stroke-width="2"/>
    <path d="M 60 56 L 68 72 L 52 72 Z" fill="none" stroke="#d23636" stroke-width="2.5" stroke-linejoin="round"/>
    <rect x="58.8" y="62" width="2.4" height="6" rx="1" fill="#d23636"/>
    <circle cx="60" cy="70" r="1.4" fill="#d23636"/>
    <!-- shine -->
    <rect x="46" y="30" width="4" height="70" rx="2" fill="#fff" opacity="0.4"/>
  </svg>`;
}

/* ===== Dispatchers (mapeiam dados → arte, sem acoplar engine à arte) ===== */

/** Arte de cada item, indexada pelo `id` de data/items.json. */
const ITEM_ART = {
  'paper-ball': paperBallSVG,
  'bottle':     bottleSVG,
  'jar':        jarSVG,
  'can':        canSVG,
  'banana':     bananaSVG,
  'newspaper':  newspaperSVG,
  'cup':        cupSVG,
  'greasy':     greasyPaperSVG,
  'sponge':     spongeSVG,
  'battery':    batterySVG,
  'spray':      sprayCanSVG,
};

/** SVG do item pelo id (fallback: bola de papel). */
export function itemArt(id) {
  return (ITEM_ART[id] || paperBallSVG)();
}

/** SVG da lixeira a partir de uma linha de data/bins.json. */
export function binArt(bin) {
  return binSVG(bin.color, bin.darkColor || bin.dark, bin.symbol);
}
