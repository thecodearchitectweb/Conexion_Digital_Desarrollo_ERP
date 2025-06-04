
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









/*  */
export function calcularDistribucionDiasPorProrroga__(
  diasNoRepetidos,
  diasLiquidadosAnterior,
  validacionProrroga
) {
  const diasNuevos = diasNoRepetidos.length;

  const sumatoriaPrevia = validacionProrroga?.sumatoria_incapacidades != null
    ? Number(validacionProrroga.sumatoria_incapacidades)
    : Number(diasLiquidadosAnterior);

  let diasRestantes = diasNuevos;
  let acumulado = sumatoriaPrevia;

  console.log(`\n=== 🧮 INICIO DE DISTRIBUCIÓN DE PRÓRROGA ===`);
  console.log(`🧾 Días liquidados anteriormente: ${sumatoriaPrevia}`);
  console.log(`➕ Días nuevos recibidos (no repetidos): ${diasNuevos}`);
  console.log(`🔢 Total acumulado esperado: ${sumatoriaPrevia + diasNuevos}`);
  console.log(`📦 Días por distribuir: ${diasRestantes}\n`);

  // Tramo 1–90
  const limiteA = 90;
  const disponibleA = Math.max(limiteA - acumulado, 0);
  const diasTramo_1a90 = Math.min(disponibleA, diasRestantes);
  console.log(`▶ Tramo 1–90 días`);
  console.log(`   • Disponible en tramo: ${disponibleA}`);
  console.log(`   • Días a asignar: ${diasTramo_1a90}`);
  acumulado += diasTramo_1a90;
  diasRestantes -= diasTramo_1a90;
  console.log(`   • Acumulado actual: ${acumulado}`);
  console.log(`   • Días restantes: ${diasRestantes}\n`);

  // Tramo 91–180
  const limiteB = 180;
  const disponibleB = Math.max(limiteB - Math.max(acumulado, 90), 0);
  const diasTramo_91a180 = Math.min(disponibleB, diasRestantes);
  console.log(`▶ Tramo 91–180 días`);
  console.log(`   • Disponible en tramo: ${disponibleB}`);
  console.log(`   • Días a asignar: ${diasTramo_91a180}`);
  acumulado += diasTramo_91a180;
  diasRestantes -= diasTramo_91a180;
  console.log(`   • Acumulado actual: ${acumulado}`);
  console.log(`   • Días restantes: ${diasRestantes}\n`);

  // Tramo 181–540
  const limiteC = 540;
  const disponibleC = Math.max(limiteC - Math.max(acumulado, 180), 0);
  const diasTramo_181a540 = Math.min(disponibleC, diasRestantes);
  console.log(`▶ Tramo 181–540 días`);
  console.log(`   • Disponible en tramo: ${disponibleC}`);
  console.log(`   • Días a asignar: ${diasTramo_181a540}`);
  acumulado += diasTramo_181a540;
  diasRestantes -= diasTramo_181a540;
  console.log(`   • Acumulado actual: ${acumulado}`);
  console.log(`   • Días restantes: ${diasRestantes}\n`);

  // Tramo 541+
  const diasTramo_541plus = Math.max(diasRestantes, 0);
  console.log(`▶ Tramo 541+ días`);
  console.log(`   • Días a asignar: ${diasTramo_541plus}`);
  acumulado += diasTramo_541plus;
  diasRestantes = 0;
  console.log(`   • Acumulado final: ${acumulado}\n`);

  const sumatoriaTotal = sumatoriaPrevia + diasNuevos;

  console.log(`📊 Distribución final:`);
  console.log(`  ✅ Tramo 1–90     → ${diasTramo_1a90} días`);
  console.log(`  ✅ Tramo 91–180   → ${diasTramo_91a180} días`);
  console.log(`  ✅ Tramo 181–540  → ${diasTramo_181a540} días`);
  console.log(`  ✅ Tramo 541+     → ${diasTramo_541plus} días`);
  console.log(`🎯 Total acumulado al cierre: ${sumatoriaTotal}`);
  console.log(`=== ✅ FIN DE DISTRIBUCIÓN ===\n`);

  return {
    diasNuevos,
    sumatoriaPrevia,
    diasTramo_1a90,
    diasTramo_91a180,
    diasTramo_181a540,
    diasTramo_541plus,
    sumatoriaTotal
  };
}





export function calcularDistribucionDiasPorProrroga(
  diasNoRepetidos,
  diasLiquidadosAnterior,
  validacionProrroga
) {
  console.log("\n========== 🧮 INICIO DE DISTRIBUCIÓN DE PRÓRROGA ==========\n");

  // 1) Cantidad de días “nuevos” que llegan (arreglo de días no repetidos)
  const diasNuevos = Array.isArray(diasNoRepetidos) ? diasNoRepetidos.length : 0;
  console.log(`1️⃣  Días nuevos sin solaparse (length de diasNoRepetidos): ${diasNuevos}`);

  // 2) Determinar la sumatoria previa:
  //    - Si validacionProrroga.sumatoria_incapacidades existe: lo tomamos como número.
  //    - Si no, usamos el parámetro diasLiquidadosAnterior.
  let sumatoriaPrevia;
  if (validacionProrroga && validacionProrroga.sumatoria_incapacidades != null) {
    sumatoriaPrevia = Number(validacionProrroga.sumatoria_incapacidades);
    console.log(
      `2️⃣  validacionProrroga.sumatoria_incapacidades encontrado: ${validacionProrroga.sumatoria_incapacidades} → convertido a número: ${sumatoriaPrevia}`
    );
  } else {
    sumatoriaPrevia = Number(diasLiquidadosAnterior);
    console.log(
      `2️⃣  No existía validacionProrroga.sumatoria_incapacidades → tomo diasLiquidadosAnterior: ${diasLiquidadosAnterior}`
    );
  }

  // 3) Variables de trabajo:
  let diasRestantes = diasNuevos;
  let acumulado = sumatoriaPrevia;

  console.log(`\n📋 Estado inicial:`);
  console.log(`   • sumatoriaPrevia (días liquidados antes): ${sumatoriaPrevia}`);
  console.log(`   • Total esperado (sumatoriaPrevia + diasNuevos): ${sumatoriaPrevia + diasNuevos}`);
  console.log(`   • diasRestantes para distribuir: ${diasRestantes}\n`);

  // ========== TRAMO 1–90 DÍAS ==========
  console.log("▶▶────────── TRAMO 1–90 DÍAS ──────────◀◀");

  const limiteA = 90;
  // ¿Cuántos días todavía podemos “llenar” hasta llegar a 90?
  const disponibleA = Math.max(limiteA - acumulado, 0);
  console.log(`   • Límite superior tramo A: ${limiteA}`);
  console.log(`   • Acumulado previo: ${acumulado}`);
  console.log(`   • Disponible en tramo A (90 - acumulado): ${disponibleA}`);

  // Cuántos de los diasRestantes (nuevos) caben en este tramo A
  const diasTramo_1a90 = Math.min(disponibleA, diasRestantes);
  console.log(`   • Días a asignar en tramo 1–90: ${diasTramo_1a90}`);

  // Actualizamos acumulado y diasRestantes
  acumulado += diasTramo_1a90;
  diasRestantes -= diasTramo_1a90;

  console.log(`   • Acumulado tras asignar tramo A: ${acumulado}`);
  console.log(`   • diasRestantes tras tramo A: ${diasRestantes}\n`);

  // ========== TRAMO 91–180 DÍAS ==========
  console.log("▶▶──────── TRAMO 91–180 DÍAS ────────◀◀");

  const limiteB = 180;
  // Para saber cuánto queda para llenar 180, primero nos aseguramos de que no bajemos de 90:
  const acumuladoParaB = Math.max(acumulado, limiteA);
  console.log(`   • Acumulado mínimo considerado para tramo B (máx(acumulado, 90)): ${acumuladoParaB}`);
  const disponibleB = Math.max(limiteB - acumuladoParaB, 0);
  console.log(`   • Disponible en tramo B (180 - acumuladoParaB): ${disponibleB}`);

  const diasTramo_91a180 = Math.min(disponibleB, diasRestantes);
  console.log(`   • Días a asignar en tramo 91–180: ${diasTramo_91a180}`);

  // Actualizamos acumulado y diasRestantes
  acumulado += diasTramo_91a180;
  diasRestantes -= diasTramo_91a180;

  console.log(`   • Acumulado tras asignar tramo B: ${acumulado}`);
  console.log(`   • diasRestantes tras tramo B: ${diasRestantes}\n`);

  // ========== TRAMO 181–540 DÍAS ==========
  console.log("▶▶─────── TRAMO 181–540 DÍAS ───────◀◀");

  const limiteC = 540;
  // Para llenar hasta 540, pero nunca menos de 180:
  const acumuladoParaC = Math.max(acumulado, limiteB);
  console.log(`   • Acumulado mínimo considerado para tramo C (máx(acumulado, 180)): ${acumuladoParaC}`);
  const disponibleC = Math.max(limiteC - acumuladoParaC, 0);
  console.log(`   • Disponible en tramo C (540 - acumuladoParaC): ${disponibleC}`);

  const diasTramo_181a540 = Math.min(disponibleC, diasRestantes);
  console.log(`   • Días a asignar en tramo 181–540: ${diasTramo_181a540}`);

  // Actualizamos acumulado y diasRestantes
  acumulado += diasTramo_181a540;
  diasRestantes -= diasTramo_181a540;

  console.log(`   • Acumulado tras asignar tramo C: ${acumulado}`);
  console.log(`   • diasRestantes tras tramo C: ${diasRestantes}\n`);

  // ========== TRAMO 541+ DÍAS ==========
  console.log("▶▶────────── TRAMO 541+ DÍAS ─────────◀◀");

  // Todos los días que queden se van a este tramo
  const diasTramo_541plus = Math.max(diasRestantes, 0);
  console.log(`   • Días restantes que caen en tramo 541+: ${diasTramo_541plus}`);

  // Actualizamos acumulado final
  acumulado += diasTramo_541plus;
  diasRestantes = 0; // ya no quedan días por asignar

  console.log(`   • Acumulado final tras tramo 541+: ${acumulado}\n`);

  // ========== RESUMEN FINAL ==========
  const sumatoriaTotal = sumatoriaPrevia + diasNuevos;

  console.log("📊 Distribución final:");
  console.log(`  ✅ Tramo 1–90     → ${diasTramo_1a90} días`);
  console.log(`  ✅ Tramo 91–180   → ${diasTramo_91a180} días`);
  console.log(`  ✅ Tramo 181–540  → ${diasTramo_181a540} días`);
  console.log(`  ✅ Tramo 541+     → ${diasTramo_541plus} días`);
  console.log(`🎯 Total acumulado al cierre (sumatoriaPrevia + diasNuevos): ${sumatoriaTotal}`);
  console.log("\n========== ✅ FIN DE DISTRIBUCIÓN ==========\n");

  return {
    diasNuevos,
    sumatoriaPrevia,
    diasTramo_1a90,
    diasTramo_91a180,
    diasTramo_181a540,
    diasTramo_541plus,
    sumatoriaTotal
  };
}
