/**
 * validate1.js — Invariantes da Era 1 (função pura, sem imports de JSON).
 *
 * Roda no navegador (via data1.js) e em Node puro (via tests/). Garante que os
 * dados não levem o jogo a um estado impossível (ex.: receita que pede recurso
 * inexistente, ou ausência do abrigo necessário para vencer).
 */

const COMPORTAMENTOS = new Set(['passiva', 'neutra', 'hostil']);

export function validateEra1({ biomes, resources, recipes, creatures }) {
  const problems = [];
  const resIds = new Set(resources.map((r) => r.id));
  const biomeIds = new Set(biomes.map((b) => b.id));

  // Recursos referenciam biomas válidos.
  resources.forEach((r) => {
    (r.biomas || []).forEach((b) => {
      if (!biomeIds.has(b)) problems.push(`Recurso "${r.id}": bioma "${b}" inexistente.`);
    });
  });

  // Biomas referenciam recursos válidos (água pode ser vazia/intransponível).
  biomes.forEach((b) => {
    (b.recursos || []).forEach((rid) => {
      if (!resIds.has(rid)) problems.push(`Bioma "${b.id}": recurso "${rid}" inexistente.`);
    });
  });

  // Receitas: entradas válidas e quantidades positivas inteiras.
  recipes.forEach((rec) => {
    const inputs = rec.entradas || {};
    if (Object.keys(inputs).length === 0) problems.push(`Receita "${rec.id}": sem entradas.`);
    Object.entries(inputs).forEach(([rid, qty]) => {
      if (!resIds.has(rid)) problems.push(`Receita "${rec.id}": entrada "${rid}" inexistente.`);
      if (!Number.isInteger(qty) || qty <= 0) problems.push(`Receita "${rec.id}": quantidade inválida de "${rid}".`);
    });
  });

  // Precisa existir pelo menos um abrigo (condição de vitória da Era 1).
  if (!recipes.some((r) => r.efeito && r.efeito.abrigo)) {
    problems.push('Nenhuma receita concede "abrigo" — impossível sobreviver à noite.');
  }

  // Criaturas com comportamento válido.
  creatures.forEach((c) => {
    if (!COMPORTAMENTOS.has(c.comportamento)) {
      problems.push(`Criatura "${c.id}": comportamento "${c.comportamento}" inválido.`);
    }
  });

  return problems;
}
