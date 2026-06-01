/**
 * game.js — Orquestrador da Era 1 (Pouso e Sobrevivência).
 *
 * Junta mundo + render + HUD + regras puras (engine/survival) num loop jogável:
 * andar, coletar sucata, craftar/erguer abrigo e sobreviver à primeira noite —
 * comandando 1–2 colonos NPC (semente do sistema de 16).
 *
 * `startEra1(root)` monta tudo dentro de `root` e devolve um teardown().
 */

import { RECIPE, RESOURCE, CREATURE, CREATURES, LORE } from '../engine/data1.js';
import {
  DIA_SEGUNDOS, faseDoDia, ehNoite, fomeApos, energiaApos, estaFaminto,
  vidaApos, podeRegenerar, podeCraftar, craftar, aplicarConsequencia, INDICE_INICIAL,
} from '../engine/survival.js';
import { gerarMundo } from './world.js';
import { render } from './render.js';
import { createHUD } from './hud.js';
import { initAudio, sfx } from './audio.js';

const VEL_JOGADOR = 96;   // px/s
const VEL_NPC = 82;
const VEL_HOSTIL_BASE = 34;
const RAIO_COLETA = 38;   // px
const RAIO_FOGUEIRA = 28 * 3.6;
const RAIO_ABRIGO = 28 * 2.2;
const CONTATO_HOSTIL = 20; // px para acertar um alvo
const DANO_CD = 1.0;       // s entre golpes de um hostil

const META_KEY = 'pbwg-era1-meta-v1';
function loadMeta() { try { return JSON.parse(localStorage.getItem(META_KEY)) || {}; } catch (e) { return {}; } }
function saveMeta(m) { try { localStorage.setItem(META_KEY, JSON.stringify(m)); } catch (e) { /* indisponível */ } }

export function startEra1(root) {
  root.innerHTML = `<canvas class="e1-canvas"></canvas><div class="e1-hud"></div>`;
  const canvas = root.querySelector('.e1-canvas');
  const ctx = canvas.getContext('2d');
  const hudEl = root.querySelector('.e1-hud');

  const world = gerarMundo();
  const T = world.TILE;
  const spawnPx = { x: world.spawn.x * T + T / 2, y: world.spawn.y * T + T / 2 };

  const state = {
    player: { x: spawnPx.x, y: spawnPx.y, dx: 0, dy: 1 },
    npcs: [
      { nome: 'Vega', x: spawnPx.x - 30, y: spawnPx.y, order: 'seguir', alvo: null, cd: 0, vida: 60, viva: true },
      { nome: 'Rook', x: spawnPx.x + 30, y: spawnPx.y, order: 'seguir', alvo: null, cd: 0, vida: 60, viva: true },
    ],
    creatures: [],
    structures: [],
    inventory: {},
    tools: { coletor: 0, tocha: 0, arma: null },
    vida: 100,
    fome: 10,
    energia: 100,
    indice: INDICE_INICIAL,
    clock: 0.30,
    dia: 1,
    visRaio: 6,
    dpad: { x: 0, y: 0 },
    frio: false,
    noiteAtiva: false,
    sobreviveuNoite: false,
    lore: [],      // fragmentos de lore coletados
    coletado: 0,   // total de recursos catados (relatório)
    placing: null, // receita de estrutura aguardando posicionamento
    ghost: null,   // { x, y, valido } prévia da construção
    pausado: true, // espera o tutorial inicial
    acabou: false,
    venceu: false,
    world,
  };

  // Criaturas iniciais perto do pouso, em terra.
  for (let i = 0; i < 5; i++) {
    const c = CREATURES[i % CREATURES.length];
    const ang = Math.random() * Math.PI * 2, r = 120 + Math.random() * 220;
    const x = spawnPx.x + Math.cos(ang) * r, y = spawnPx.y + Math.sin(ang) * r;
    if (world.passavel(Math.floor(x / T), Math.floor(y / T))) {
      state.creatures.push({ tipo: c.id, x, y, vel: c.vel, comp: c.comportamento, ax: 0, ay: 0, cd: 0 });
    }
  }

  /* ===== Input ===== */
  const keys = new Set();
  const onKeyDown = (e) => {
    const k = e.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
    keys.add(k);
    if (k === 'e') interagir();
    if (k === ' ') atacar();
    if (k === 'f') alimentar();
    if (k === 'c') { hud.fecharPainel(); abrirCraft(); }
    if (k === 't') { hud.fecharPainel(); abrirComando(); }
    if (k === 'escape') { if (!cancelarPlacing()) hud.fecharPainel(); }
  };
  const onKeyUp = (e) => keys.delete(e.key.toLowerCase());
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  function vetorMovimento() {
    let x = 0, y = 0;
    if (keys.has('a') || keys.has('arrowleft')) x -= 1;
    if (keys.has('d') || keys.has('arrowright')) x += 1;
    if (keys.has('w') || keys.has('arrowup')) y -= 1;
    if (keys.has('s') || keys.has('arrowdown')) y += 1;
    x += state.dpad.x; y += state.dpad.y;
    const m = Math.hypot(x, y);
    return m > 1 ? { x: x / m, y: y / m } : { x, y };
  }

  /* ===== HUD ===== */
  let craftAberto = null;
  const hud = createHUD(hudEl, {
    menu: () => { if (handlers.onMenu) handlers.onMenu(); },
    interact: interagir,
    attack: atacar,
    ally: alimentar,
    cancel: cancelarPlacing,
    craft: (id) => { craftar_(id); },
    command: (ordem) => state.npcs.forEach((n) => { if (n.viva) { n.order = ordem; n.alvo = null; } }),
    dpad: (x, y) => { state.dpad.x = x; state.dpad.y = y; },
    restart: () => { if (handlers.onRestart) handlers.onRestart(); },
  });
  function abrirCraft() { hudEl.querySelector('[data-act="craft"]').click(); }
  function abrirComando() { hudEl.querySelector('[data-act="command"]').click(); }

  function consequencia(evento) {
    const antes = state.indice;
    state.indice = aplicarConsequencia(state.indice, evento);
    hud.flashIndice(state.indice - antes);
  }

  // Tutorial inicial: o mundo renderiza ao fundo, mas o tempo só corre ao "Pousar".
  // O clique também inicia o áudio (gesto do usuário exigido pelo navegador).
  hud.showIntro(() => { state.pausado = false; initAudio(); });

  /* ===== Ações ===== */
  function nodeMaisProximo(x, y, raio, res = null) {
    let melhor = null, md = raio * raio;
    for (const n of world.nodes) {
      if (res && n.res !== res) continue;
      const d = (n.x * T + T / 2 - x) ** 2 + (n.y * T + T / 2 - y) ** 2;
      if (d < md) { md = d; melhor = n; }
    }
    return melhor;
  }

  function interagir() {
    if (state.acabou || state.pausado) return;
    if (state.placing) { confirmarConstrucao(); return; }
    if (abrirDestroco()) return;
    const n = nodeMaisProximo(state.player.x, state.player.y, RAIO_COLETA);
    if (!n) { hud.toast('Nada para coletar por perto.'); return; }
    const qtd = Math.min(n.qtd, 1 + state.tools.coletor);
    state.inventory[n.res] = (state.inventory[n.res] || 0) + qtd;
    state.coletado += qtd;
    n.qtd -= qtd;
    if (n.qtd <= 0) world.removerNode(n);
    sfx.coleta();
    hud.toast(`+${qtd} ${RESOURCE[n.res].nome}`);
  }

  function abrirDestroco() {
    const r2 = RAIO_COLETA * RAIO_COLETA;
    for (const w of world.wrecks) {
      if (w.aberto) continue;
      const cx = w.x * T + T / 2, cy = w.y * T + T / 2;
      if ((cx - state.player.x) ** 2 + (cy - state.player.y) ** 2 > r2) continue;
      w.aberto = true;
      state.inventory.cristal = (state.inventory.cristal || 0) + 3;
      state.coletado += 3;
      sfx.loot();
      const frag = LORE.find((f) => !state.lore.some((x) => x.id === f.id));
      if (frag) { state.lore.push(frag); hud.toast(`📜 ${frag.titulo} (+3 Cristal) — veja o Diário.`); }
      else hud.toast('Destroço vasculhado: +3 Cristal.');
      consequencia('reaproveitou');
      return true;
    }
    return false;
  }

  function craftar_(id) {
    if (state.acabou) return;
    const r = RECIPE[id];
    if (!r || !podeCraftar(r, state.inventory)) { hud.toast('Faltam recursos.'); return; }
    if (r.tipo === 'estrutura') {
      state.placing = r; // entra no modo posicionar (consome só ao confirmar)
      hud.fecharPainel();
      hud.toast(`Posicione ${r.nome}: ande para mirar · ✋/E confirma · Esc cancela.`);
      return;
    }
    state.inventory = craftar(r, state.inventory);
    sfx.craft();
    if (r.tipo === 'ferramenta') {
      if (r.efeito.luz) { state.tools.tocha = 1; hud.toast(`${r.nome} pronta! Mais luz à noite.`); }
      else { state.tools.coletor += r.efeito.coleta || 1; hud.toast(`${r.nome} pronto! Coleta melhorada.`); }
      consequencia('reaproveitou');
    } else if (r.tipo === 'consumivel') {
      state.fome = Math.max(0, Math.min(100, state.fome + (r.efeito.fome || 0)));
      hud.toast(`${r.nome}: fome saciada.`);
    } else if (r.tipo === 'arma') {
      state.tools.arma = { dano: r.efeito.dano, alcance: r.efeito.alcance };
      consequencia('reaproveitou');
      hud.toast(`${r.nome} pronto! Ataque com Espaço / ⚔️.`);
    }
  }

  /* ===== Posicionamento de estruturas ===== */
  function ghostPos() {
    const dx = state.player.dx || 0, dy = state.player.dy || 1;
    return { x: state.player.x + dx * T * 1.6, y: state.player.y + dy * T * 1.6 };
  }
  function confirmarConstrucao() {
    const r = state.placing; if (!r) return;
    const g = ghostPos();
    if (!world.passavel(Math.floor(g.x / T), Math.floor(g.y / T))) { hud.toast('Lugar inválido (água/borda).'); return; }
    if (!podeCraftar(r, state.inventory)) { hud.toast('Faltam recursos.'); state.placing = null; return; }
    state.inventory = craftar(r, state.inventory);
    state.structures.push({ tipo: r.id, x: g.x, y: g.y });
    state.placing = null; state.ghost = null;
    sfx.build();
    if (r.efeito.baliza) { consequencia('recomeco_preparado'); vencer('baliza'); return; }
    consequencia('reaproveitou');
    hud.toast(`${r.nome} erguido.`);
  }
  function cancelarPlacing() {
    if (!state.placing) return false;
    state.placing = null; state.ghost = null;
    hud.toast('Construção cancelada.');
    return true;
  }

  /* ===== Domesticar (pilar Ark): alimenta neutra → aliada que luta ===== */
  const TAME_RAIO = 48;
  function alimentar() {
    if (state.acabou || state.pausado) return;
    if ((state.inventory.organico || 0) <= 0) { hud.toast('Precisa de Orgânico para aliar.'); return; }
    let alvo = null, md = TAME_RAIO * TAME_RAIO;
    for (const c of state.creatures) {
      if (c.comp !== 'neutra') continue;
      const d = (c.x - state.player.x) ** 2 + (c.y - state.player.y) ** 2;
      if (d < md) { md = d; alvo = c; }
    }
    if (!alvo) { hud.toast('Nenhuma criatura neutra por perto.'); return; }
    state.inventory.organico -= 1;
    alvo.tame = (alvo.tame || 0) + 1;
    if (alvo.tame >= 3) {
      alvo.comp = 'aliado'; alvo.hp = 45; alvo.golpe = 0;
      sfx.aliado();
      hud.toast(`${CREATURE[alvo.tipo].nome} virou seu aliado! 🤝 Vai lutar com você.`);
    } else {
      hud.toast(`Alimentou (${alvo.tame}/3) — continue para aliar.`);
    }
  }

  /* ===== Aquece (fogueira/abrigo) ===== */
  function aquecido(x, y) {
    for (const s of state.structures) {
      const raio = s.tipo === 'fogueira' ? RAIO_FOGUEIRA : RAIO_ABRIGO;
      if ((s.x - x) ** 2 + (s.y - y) ** 2 <= raio * raio) return true;
    }
    return false;
  }

  /* ===== Combate ===== */
  function atacar() {
    if (state.acabou || state.pausado) return;
    const arma = state.tools.arma;
    if (!arma) { hud.toast('Sem arma. Crafte um Bastão (C).'); return; }
    let alvo = null, md = arma.alcance * arma.alcance;
    for (const c of state.creatures) {
      if (c.comp !== 'hostil') continue;
      const d = (c.x - state.player.x) ** 2 + (c.y - state.player.y) ** 2;
      if (d < md) { md = d; alvo = c; }
    }
    if (!alvo) return;
    alvo.hp -= arma.dano;
    sfx.hit();
    if (alvo.hp <= 0) {
      state.creatures.splice(state.creatures.indexOf(alvo), 1);
      hud.toast(`${CREATURE[alvo.tipo].nome} abatido.`);
    }
  }

  function alvosVivos() {
    const arr = [{ tipo: 'player', x: state.player.x, y: state.player.y }];
    for (const n of state.npcs) if (n.viva) arr.push({ tipo: 'npc', ref: n, x: n.x, y: n.y });
    for (const c of state.creatures) if (c.comp === 'aliado') arr.push({ tipo: 'aliado', ref: c, x: c.x, y: c.y });
    return arr;
  }

  function aplicarDano(alvo, dano) {
    if (alvo.tipo === 'player') {
      state.vida = Math.max(0, state.vida - dano);
      sfx.hurt();
    } else if (alvo.tipo === 'npc') {
      alvo.ref.vida -= dano;
      if (alvo.ref.vida <= 0) {
        alvo.ref.viva = false;
        consequencia('colono_perdido');
        hud.toast(`💀 ${alvo.ref.nome} caiu! A segunda chance recuou.`);
      }
    } else if (alvo.tipo === 'aliado') {
      alvo.ref.hp -= dano;
      if (alvo.ref.hp <= 0) {
        const i = state.creatures.indexOf(alvo.ref);
        if (i >= 0) state.creatures.splice(i, 1);
        hud.toast('Seu aliado caiu.');
      }
    }
  }

  function spawnHostis() {
    state.noiteAtiva = true;
    const hostil = CREATURES.find((c) => c.comportamento === 'hostil');
    if (!hostil) return;
    const qtd = 2 + Math.min(state.dia, 5); // cap para não virar impossível
    for (let i = 0; i < qtd; i++) {
      const ang = Math.random() * Math.PI * 2, r = 260 + Math.random() * 160;
      const x = state.player.x + Math.cos(ang) * r, y = state.player.y + Math.sin(ang) * r;
      if (!world.passavel(Math.floor(x / T), Math.floor(y / T))) continue;
      state.creatures.push({ tipo: hostil.id, x, y, vel: hostil.vel || VEL_HOSTIL_BASE, comp: 'hostil', hp: hostil.hp, dano: hostil.dano, ax: 0, ay: 0, cd: 0, golpe: 0 });
    }
    sfx.noite();
    hud.toast('🌙 A noite caiu — espreitadores se aproximam!');
  }

  function aoMudarFase(de, para) {
    if (para === 'noite') spawnHostis();
    if (de === 'noite' && para !== 'noite') {
      state.creatures = state.creatures.filter((c) => c.comp !== 'hostil');
      state.noiteAtiva = false;
      if (!state.sobreviveuNoite) {
        state.sobreviveuNoite = true;
        consequencia('sobreviveu_noite');
        hud.toast('🌅 Sobreviveu à 1ª noite! Agora junte Cristal e erga a Baliza de Resgate.');
      }
    }
  }

  /* ===== Movimento com colisão (água é intransponível) ===== */
  function mover(ent, vx, vy, dt) {
    const nx = ent.x + vx * dt;
    if (world.passavel(Math.floor(nx / T), Math.floor(ent.y / T))) ent.x = nx;
    const ny = ent.y + vy * dt;
    if (world.passavel(Math.floor(ent.x / T), Math.floor(ny / T))) ent.y = ny;
  }

  /* ===== IA dos colonos ===== */
  // Colonos se defendem: atacam hostil adjacente; com ordem "guardar", caçam perto.
  function npcAtacaHostil(n, dt) {
    n.golpe = (n.golpe || 0) - dt;
    let h = null, md = (T * 4) ** 2;
    for (const o of state.creatures) {
      if (o.comp !== 'hostil') continue;
      const d = (o.x - n.x) ** 2 + (o.y - n.y) ** 2;
      if (d < md) { md = d; h = o; }
    }
    if (!h) return false;
    const dx = h.x - n.x, dy = h.y - n.y, d = Math.hypot(dx, dy) || 1;
    if (d <= CONTATO_HOSTIL + 6) {
      if (n.golpe <= 0) {
        n.golpe = DANO_CD; h.hp -= 12; sfx.hit();
        if (h.hp <= 0) { const i = state.creatures.indexOf(h); if (i >= 0) state.creatures.splice(i, 1); }
      }
      return true;
    }
    if (n.order === 'guardar' || d < T * 2.2) { // guarda persegue; senão, autodefesa de perto
      mover(n, (dx / d) * VEL_NPC, (dy / d) * VEL_NPC, dt);
      return true;
    }
    return false;
  }

  function atualizarNPC(n, dt) {
    if (npcAtacaHostil(n, dt)) return; // combate tem prioridade
    let tx = null, ty = null;
    if (n.order === 'seguir') { tx = state.player.x; ty = state.player.y; }
    else if (n.order && n.order.startsWith('coletar:')) {
      const res = n.order.split(':')[1];
      if (!n.alvo || n.alvo.qtd <= 0 || world.nodes.indexOf(n.alvo) < 0) n.alvo = nodeMaisProximo(n.x, n.y, 1e6, res);
      if (n.alvo) {
        tx = n.alvo.x * T + T / 2; ty = n.alvo.y * T + T / 2;
        if ((tx - n.x) ** 2 + (ty - n.y) ** 2 < RAIO_COLETA * RAIO_COLETA) {
          n.cd -= dt;
          if (n.cd <= 0) {
            n.cd = 0.8;
            state.inventory[res] = (state.inventory[res] || 0) + 1;
            n.alvo.qtd -= 1;
            if (n.alvo.qtd <= 0) { world.removerNode(n.alvo); n.alvo = null; }
          }
          return; // colhendo: não anda
        }
      }
    }
    if (tx == null) return; // 'ficar'
    const dx = tx - n.x, dy = ty - n.y, d = Math.hypot(dx, dy);
    if (n.order === 'seguir' && d < 44) return; // mantém distância
    if (d > 1) mover(n, (dx / d) * VEL_NPC, (dy / d) * VEL_NPC, dt);
  }

  /* ===== IA das criaturas ===== */
  function atualizarCriatura(c, dt) {
    if (c.comp === 'hostil') { atualizarHostil(c, dt); return; }
    if (c.comp === 'aliado') { atualizarAliado(c, dt); return; }
    c.cd -= dt;
    const dxp = state.player.x - c.x, dyp = state.player.y - c.y, dp = Math.hypot(dxp, dyp);
    if (c.comp === 'passiva' && dp < 80) {
      c.ax = -dxp / (dp || 1); c.ay = -dyp / (dp || 1); c.cd = 0.6; // foge
    } else if (c.cd <= 0) {
      const a = Math.random() * Math.PI * 2; c.ax = Math.cos(a); c.ay = Math.sin(a); c.cd = 1 + Math.random() * 2;
    }
    mover(c, c.ax * c.vel, c.ay * c.vel, dt);
  }

  function atualizarHostil(c, dt) {
    c.golpe = (c.golpe || 0) - dt;
    const alvos = alvosVivos();
    let alvo = null, md = Infinity;
    for (const a of alvos) { const d = (a.x - c.x) ** 2 + (a.y - c.y) ** 2; if (d < md) { md = d; alvo = a; } }
    if (!alvo) return;
    const dx = alvo.x - c.x, dy = alvo.y - c.y, d = Math.hypot(dx, dy) || 1;
    if (d <= CONTATO_HOSTIL) { if (c.golpe <= 0) { c.golpe = DANO_CD; aplicarDano(alvo, c.dano); } }
    else mover(c, (dx / d) * c.vel, (dy / d) * c.vel, dt);
  }

  function atualizarAliado(c, dt) {
    c.golpe = (c.golpe || 0) - dt;
    let h = null, md = (T * 6) ** 2;
    for (const o of state.creatures) {
      if (o.comp !== 'hostil') continue;
      const d = (o.x - c.x) ** 2 + (o.y - c.y) ** 2;
      if (d < md) { md = d; h = o; }
    }
    if (h) {
      const dx = h.x - c.x, dy = h.y - c.y, d = Math.hypot(dx, dy) || 1;
      if (d <= CONTATO_HOSTIL) {
        if (c.golpe <= 0) { c.golpe = DANO_CD; h.hp -= 18; if (h.hp <= 0) { const i = state.creatures.indexOf(h); if (i >= 0) state.creatures.splice(i, 1); } }
      } else mover(c, (dx / d) * c.vel * 1.4, (dy / d) * c.vel * 1.4, dt);
      return;
    }
    const dx = state.player.x - c.x, dy = state.player.y - c.y, d = Math.hypot(dx, dy);
    if (d > 52) mover(c, (dx / d) * c.vel * 1.2, (dy / d) * c.vel * 1.2, dt);
  }

  /* ===== Loop ===== */
  function resize() {
    canvas.width = root.clientWidth || 800;
    canvas.height = root.clientHeight || 600;
  }
  window.addEventListener('resize', resize);
  resize();

  let faseAnterior = faseDoDia(state.clock);
  let raf = 0, last = performance.now();
  function frame(now) {
    let dt = (now - last) / 1000; last = now;
    if (dt > 0.05) dt = 0.05; // evita saltos ao voltar de aba inativa

    if (!state.acabou && !state.pausado) {
      // Movimento do jogador
      const mv = vetorMovimento();
      if (mv.x || mv.y) { state.player.dx = mv.x; state.player.dy = mv.y; }
      mover(state.player, mv.x * VEL_JOGADOR, mv.y * VEL_JOGADOR, dt);
      world.revelar(Math.floor(state.player.x / T), Math.floor(state.player.y / T), state.visRaio);

      state.npcs.forEach((n) => { if (n.viva) atualizarNPC(n, dt); });
      state.creatures.forEach((c) => atualizarCriatura(c, dt));

      // Medidores
      state.fome = fomeApos(state.fome, dt);
      state.frio = ehNoite(state.clock) && !aquecido(state.player.x, state.player.y);
      const faminto = estaFaminto(state.fome);
      state.energia = energiaApos(state.energia, dt, { faminto, frio: state.frio });
      state.vida = vidaApos(state.vida, dt, podeRegenerar({ faminto, frio: state.frio, energia: state.energia }));

      // Hortas produzem orgânico com o tempo (comida renovável)
      for (const s of state.structures) {
        if (s.tipo !== 'horta') continue;
        s.cd = (s.cd == null ? 8 : s.cd) - dt;
        if (s.cd <= 0) {
          s.cd = 12;
          const perto = world.nodes.filter((n) => n.res === 'organico' && (n.x * T - s.x) ** 2 + (n.y * T - s.y) ** 2 < (T * 4) ** 2).length;
          if (perto < 3) {
            const ang = Math.random() * Math.PI * 2, r = 1 + Math.random() * 2.5;
            const x = Math.round(s.x / T + Math.cos(ang) * r), y = Math.round(s.y / T + Math.sin(ang) * r);
            if (world.passavel(x, y)) world.nodes.push({ x, y, res: 'organico', qtd: 2 + Math.floor(Math.random() * 3) });
          }
        }
      }

      // Prévia da construção (modo posicionamento)
      if (state.placing) {
        const g = ghostPos();
        state.ghost = { x: g.x, y: g.y, valido: world.passavel(Math.floor(g.x / T), Math.floor(g.y / T)) };
      } else state.ghost = null;

      // Tempo + transições de fase (dia/noite)
      state.clock += dt / DIA_SEGUNDOS;
      if (state.clock >= 1) { state.clock -= 1; state.dia += 1; }
      const fase = faseDoDia(state.clock);
      if (fase !== faseAnterior) { aoMudarFase(faseAnterior, fase); faseAnterior = fase; }

      // Derrota
      if (state.energia <= 0) perder('energia');
      else if (state.vida <= 0) perder('vida');
    }

    render(ctx, world, state);
    hud.update(state);
    raf = requestAnimationFrame(frame);
  }

  function registrarMeta(win) {
    const m = loadMeta();
    m.partidas = (m.partidas || 0) + 1;
    m.vitorias = (m.vitorias || 0) + (win ? 1 : 0);
    m.melhorIndice = Math.max(m.melhorIndice || 0, Math.round(state.indice));
    m.melhorDia = Math.max(m.melhorDia || 0, state.dia);
    saveMeta(m);
    return m;
  }
  function vencer(motivo) {
    if (state.acabou) return;
    state.acabou = true; state.venceu = true;
    sfx.vitoria();
    hud.showEnd(true, state, motivo, registrarMeta(true));
  }
  function perder(motivo) {
    if (state.acabou) return;
    state.acabou = true; state.venceu = false;
    consequencia('colapso');
    sfx.derrota();
    hud.showEnd(false, state, motivo, registrarMeta(false));
  }

  raf = requestAnimationFrame(frame);

  const handlers = { onMenu: null, onRestart: null };
  return {
    onMenu(fn) { handlers.onMenu = fn; },
    onRestart(fn) { handlers.onRestart = fn; },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', resize);
      root.innerHTML = '';
    },
  };
}
