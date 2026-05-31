/**
 * validate.js — Invariantes pedagógicos (data/README.md → "Invariantes que valem").
 *
 * Função PURA: recebe os dados por parâmetro (não importa JSON), então roda
 * tanto no navegador (via data.js) quanto em Node puro (via tests/). Se um
 * invariante quebrar, o jogo ensinaria reciclagem errada — por isso é testado.
 */

const RECICLAVEIS = new Set(['reutilizar', 'reciclar', 'compostar']);

/**
 * Verifica as regras que o protótipo garante e que o port NÃO pode quebrar.
 * Retorna a lista de problemas (vazia = tudo certo). Não lança — quem chama
 * decide o que fazer (avisar no dev, falhar no teste).
 */
export function validateData({ bins, destinos, items }) {
  const problems = [];
  const d = destinos;

  // 1) Hierarquia monotônica de créditos.
  if (!(d.reutilizar.credits >= d.reciclar.credits &&
        d.reciclar.credits >= d.incinerar.credits &&
        d.incinerar.credits >= d.aterro.credits)) {
    problems.push('Hierarquia de créditos quebrada (reutilizar ≥ reciclar ≥ incinerar ≥ aterro).');
  }

  // 2) Incinerar e aterro têm eco = 0 (pedagogia D-04).
  if (d.incinerar.eco !== 0) problems.push('incinerar.eco deve ser 0.');
  if (d.aterro.eco !== 0) problems.push('aterro.eco deve ser 0.');

  const binIds = new Set(bins.map((b) => b.id));

  items.forEach((item) => {
    // Sanidade: a cor correta existe e o destino ideal está entre as opções.
    if (!binIds.has(item.correct)) {
      problems.push(`Item "${item.id}": cor "${item.correct}" não existe em bins.`);
    }
    if (!item.options.includes(item.destino)) {
      problems.push(`Item "${item.id}": destino ideal "${item.destino}" não está nas opções.`);
    }

    // 3) O destino ideal rende ≥ que toda outra opção (créditos E eco).
    const ideal = d[item.destino];
    item.options.forEach((opt) => {
      const o = d[opt];
      if (o.credits > ideal.credits || o.eco > ideal.eco) {
        problems.push(`Item "${item.id}": opção "${opt}" rende mais que o ideal "${item.destino}".`);
      }
    });

    // 4) Logística reversa só em perigosos (laranja).
    if (item.options.includes('logistica') && item.correct !== 'laranja') {
      problems.push(`Item "${item.id}": "logistica" só vale para perigosos (laranja).`);
    }

    // 5) Rejeito (cinza) nunca recicla/reutiliza/composta.
    if (item.correct === 'cinza' && item.options.some((o) => RECICLAVEIS.has(o))) {
      problems.push(`Item "${item.id}": rejeito (cinza) não pode ter reciclar/reutilizar/compostar.`);
    }
  });

  return problems;
}
