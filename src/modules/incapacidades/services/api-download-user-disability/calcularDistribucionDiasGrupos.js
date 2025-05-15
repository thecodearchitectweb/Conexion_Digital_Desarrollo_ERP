// src/services/api-download-user-disability/calcularDistribucionDias.js

/**
 * Reparte días nuevos entre el tramo <=90 y >90, considerando acumulado previo.
 *
 * @param {object|null} validacioTablaProrroga  — Objeto con sumatoria_incapacidades o null
 * @param {number} diasLiquidadosAnterior        — Días liquidados de la incapacidad anterior
 * @param {number} diasNuevos                    — Días nuevos a liquidar (no repetidos)
 * @returns {{ sumatoriaPrevia: number, diasNuevos: number, previosEnMenor90: number, agregadosEnMenor90: number, diasEnMayor90: number, sumatoriaTotal: number }}
 */
/* export function calcularDistribucionDias(
  validacioTablaProrroga,
  diasLiquidadosAnterior,
  diasNuevos
) {
  // 1) Acumulado previo total
  const sumatoriaPrevia = validacioTablaProrroga?.sumatoria_incapacidades != null
    /? Number(validacioTablaProrroga.sumatoria_incapacidades)
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
} */


/*   export function calcularDistribucionDias(
  validacioTablaProrroga,
  diasLiquidadosAnterior,
  diasNuevos
) {
  const sumatoriaPrevia = validacioTablaProrroga?.sumatoria_incapacidades != null
    ? Number(validacioTablaProrroga.sumatoria_incapacidades)
    : Number(diasLiquidadosAnterior);

  let diasRestantes = diasNuevos;
  let acumulado = sumatoriaPrevia;

  // Tramo A: 1–90
  const enA = Math.max(0, Math.min(90 - acumulado, diasRestantes));
  acumulado += enA;
  diasRestantes -= enA;

  // Tramo B: 91–180
  const enB = Math.max(0, Math.min(180 - Math.max(acumulado, 90), diasRestantes));
  acumulado += enB;
  diasRestantes -= enB;

  // Tramo C: 181–540
  const enC = Math.max(0, Math.min(540 - Math.max(acumulado, 180), diasRestantes));
  acumulado += enC;
  diasRestantes -= enC;

  // Tramo D: 541+
  const enD = Math.max(0, diasRestantes);
  acumulado += enD;

  const sumatoriaTotal = sumatoriaPrevia + diasNuevos;

  // Log para que no te pierdas en la tormenta de días
  console.log(`\n📊 Distribución de días tras prórroga:`);
  console.log(`- Días previos acumulados: ${sumatoriaPrevia}`);
  console.log(`- Días nuevos a procesar: ${diasNuevos}`);
  console.log(`  • Tramo 1–90     → ${enA} días`);
  console.log(`  • Tramo 91–180   → ${enB} días`);
  console.log(`  • Tramo 181–540  → ${enC} días`);
  console.log(`  • Tramo 541+     → ${enD} días`);
  console.log(`- Sumatoria final de días: ${sumatoriaTotal}\n`);

  return {
    sumatoriaPrevia,
    diasNuevos,
    diasTramo_1a90: enA,
    diasTramo_91a180: enB,
    diasTramo_181a540: enC,
    diasTramo_541plus: enD,
    sumatoriaTotal
  };
} */


  export function calcularDistribucionDias(
  validacioTablaProrroga,
  diasLiquidadosAnterior,
  diasNuevos
) {
  const sumatoriaPrevia = validacioTablaProrroga?.sumatoria_incapacidades != null
    ? Number(validacioTablaProrroga.sumatoria_incapacidades)
    : Number(diasLiquidadosAnterior);

  let diasRestantes = diasNuevos;
  let acumulado = sumatoriaPrevia;

  console.log(`\n=== 🧮 INICIO DE DISTRIBUCIÓN DE DÍAS ===`);
  console.log(`Días previos acumulados: ${sumatoriaPrevia}`);
  console.log(`Días nuevos a procesar: ${diasNuevos}`);
  console.log(`Días totales esperados: ${sumatoriaPrevia + diasNuevos}\n`);

  // Tramo A: 1–90
  const limiteA = 90;
  const espacioDisponibleA = Math.max(limiteA - acumulado, 0);
  const enA = Math.min(espacioDisponibleA, diasRestantes);
  console.log(`🔹 Tramo 1–90`);
  console.log(`  - Cupo disponible: ${espacioDisponibleA}`);
  console.log(`  - Asignados: ${enA}`);
  acumulado += enA;
  diasRestantes -= enA;

  // Tramo B: 91–180
  const limiteB = 180;
  const espacioDisponibleB = Math.max(limiteB - Math.max(acumulado, 90), 0);
  const enB = Math.min(espacioDisponibleB, diasRestantes);
  console.log(`🔹 Tramo 91–180`);
  console.log(`  - Cupo disponible: ${espacioDisponibleB}`);
  console.log(`  - Asignados: ${enB}`);
  acumulado += enB;
  diasRestantes -= enB;

  // Tramo C: 181–540
  const limiteC = 540;
  const espacioDisponibleC = Math.max(limiteC - Math.max(acumulado, 180), 0);
  const enC = Math.min(espacioDisponibleC, diasRestantes);
  console.log(`🔹 Tramo 181–540`);
  console.log(`  - Cupo disponible: ${espacioDisponibleC}`);
  console.log(`  - Asignados: ${enC}`);
  acumulado += enC;
  diasRestantes -= enC;

  // Tramo D: 541+
  const enD = Math.max(diasRestantes, 0);
  console.log(`🔹 Tramo 541+`);
  console.log(`  - Asignados: ${enD}`);
  acumulado += enD;

  const sumatoriaTotal = sumatoriaPrevia + diasNuevos;

  console.log(`\n📊 Resumen final de distribución:`);
  console.log(`  • Tramo 1–90     → ${enA} días`);
  console.log(`  • Tramo 91–180   → ${enB} días`);
  console.log(`  • Tramo 181–540  → ${enC} días`);
  console.log(`  • Tramo 541+     → ${enD} días`);
  console.log(`🎯 Sumatoria final de días: ${sumatoriaTotal}`);
  console.log(`=== 🧮 FIN DE DISTRIBUCIÓN ===\n`);

  return {
    sumatoriaPrevia,
    diasNuevos,
    diasTramo_1a90: enA,
    diasTramo_91a180: enB,
    diasTramo_181a540: enC,
    diasTramo_541plus: enD,
    sumatoriaTotal
  };
}
