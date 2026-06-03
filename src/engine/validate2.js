/**
 * validate2.js — Invariantes da Era 2 (função pura, sem imports de JSON).
 * Roda no navegador (data2.js) e em Node (tests/). Garante que as máquinas
 * referenciem itens válidos e que exista a cadeia mínima (fonte→…→estoque).
 */

export function validateEra2({ maquinas, itens, tech = [] }) {
  const problems = [];
  const itemIds = new Set(itens.map((i) => i.id));
  let fonte = 0, esteira = 0, sink = 0, maquina = 0;

  maquinas.forEach((m) => {
    if (m.tipo === 'fonte') {
      fonte++;
      if (!itemIds.has(m.saida)) problems.push(`Fonte "${m.id}": saída "${m.saida}" inexistente.`);
      if (!(m.intervalo > 0)) problems.push(`Fonte "${m.id}": intervalo inválido.`);
    } else if (m.tipo === 'esteira') {
      esteira++;
    } else if (m.tipo === 'divisor') {
      // transporte; sem campos obrigatórios
    } else if (m.tipo === 'sink') {
      sink++;
    } else if (m.tipo === 'maquina') {
      maquina++;
      if (!itemIds.has(m.saida)) problems.push(`Máquina "${m.id}": saída "${m.saida}" inexistente.`);
      if (!(m.tempo > 0)) problems.push(`Máquina "${m.id}": tempo inválido.`);
      const ent = m.entrada || {};
      if (Object.keys(ent).length === 0) problems.push(`Máquina "${m.id}": sem entradas.`);
      Object.entries(ent).forEach(([it, q]) => {
        if (!itemIds.has(it)) problems.push(`Máquina "${m.id}": entrada "${it}" inexistente.`);
        if (!(Number.isInteger(q) && q > 0)) problems.push(`Máquina "${m.id}": quantidade inválida de "${it}".`);
      });
      if (m.consumo != null && !(m.consumo >= 0)) problems.push(`Máquina "${m.id}": consumo inválido.`);
    } else if (m.tipo === 'gerador') {
      if (!(m.geracao > 0)) problems.push(`Gerador "${m.id}": geração inválida.`);
      if (m.sujo && !(m.intervalo > 0)) problems.push(`Queimador "${m.id}": intervalo de queima inválido.`);
    } else {
      problems.push(`Construção "${m.id}": tipo "${m.tipo}" inválido.`);
    }
  });

  if (fonte < 1) problems.push('Falta uma fonte.');
  if (esteira < 1) problems.push('Falta uma esteira.');
  if (sink < 1) problems.push('Falta um estoque (sink).');
  if (maquina < 1) problems.push('Falta ao menos uma máquina.');

  // Tech: cada desbloqueio referencia máquina e itens válidos.
  const maqIds = new Set(maquinas.map((m) => m.id));
  tech.forEach((t) => {
    if (!maqIds.has(t.maquina)) problems.push(`Tech: máquina "${t.maquina}" inexistente.`);
    Object.keys(t.req || {}).forEach((it) => {
      if (!itemIds.has(it)) problems.push(`Tech "${t.maquina}": requisito "${it}" inexistente.`);
    });
  });

  return problems;
}
