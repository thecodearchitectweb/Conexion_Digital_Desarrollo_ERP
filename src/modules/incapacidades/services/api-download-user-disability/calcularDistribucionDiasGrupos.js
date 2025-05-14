// src/services/api-download-user-disability/calcularDistribucionDias.js

/**
 * Reparte días nuevos entre el tramo <=90 y >90, considerando acumulado previo.
 *
 * @param {object|null} validacioTablaProrroga  — Objeto con sumatoria_incapacidades o null
 * @param {number} diasLiquidadosAnterior        — Días liquidados de la incapacidad anterior
 * @param {number} diasNuevos                    — Días nuevos a liquidar (no repetidos)
 * @returns {{ sumatoriaPrevia: number, diasNuevos: number, previosEnMenor90: number, agregadosEnMenor90: number, diasEnMayor90: number, sumatoriaTotal: number }}
 */
export function calcularDistribucionDias(
  validacioTablaProrroga,
  diasLiquidadosAnterior,
  diasNuevos
) {
  // 1) Acumulado previo total
  const sumatoriaPrevia = validacioTablaProrroga?.sumatoria_incapacidades != null
    ? Number(validacioTablaProrroga.sumatoria_incapacidades)
    : Number(diasLiquidadosAnterior);

  // 2) Cuántos días previos ya estaban en el tramo <=90
  const previosEnMenor90 = Math.min(sumatoriaPrevia, 90);

  // 3) Cupo restante para alcanzar 90 días
  const cupoMenor90 = Math.max(90 - sumatoriaPrevia, 0);

  // 4) Días nuevos que efectivamente se agregan al tramo <=90
  const agregadosEnMenor90 = Math.min(cupoMenor90, diasNuevos);

  // 5) Días que pasan al tramo >90
  const diasEnMayor90 = diasNuevos - agregadosEnMenor90;

  // 6) Sumatoria final de días tras prórroga
  const sumatoriaTotal = sumatoriaPrevia + diasNuevos;

  // 7) Log detallado con descripciones claras
  console.log(`\n📊 Distribución de días tras prórroga:`);
  console.log(`- Días previos acumulados: ${sumatoriaPrevia}`);
  console.log(`  • Previos en tramo ≤90: ${previosEnMenor90}`);
  console.log(`- Días nuevos a procesar: ${diasNuevos}`);
  console.log(`  • Agregados en tramo ≤90: ${agregadosEnMenor90}`);
  console.log(`  • Días en tramo >90: ${diasEnMayor90}`);
  console.log(`- Total en tramo ≤90 tras ajuste: ${previosEnMenor90 + agregadosEnMenor90}`);
  console.log(`- Total en tramo >90 tras ajuste: ${sumatoriaTotal - 90}`);
  console.log(`- Sumatoria final de días: ${sumatoriaTotal}\n`);

  return { sumatoriaPrevia, diasNuevos, previosEnMenor90, agregadosEnMenor90, diasEnMayor90, sumatoriaTotal };
}
