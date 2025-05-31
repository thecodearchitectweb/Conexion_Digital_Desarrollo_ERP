export function calcularDistribucionDias(diasNoRepetidosALiquidar) {
  // Como ahora sólo recibimos los días nuevos, asumimos que no hay sumatoria previa
  const sumatoriaPrevia = 0;
  const diasNuevos = Number(diasNoRepetidosALiquidar);

  let diasRestantes = diasNuevos;
  let acumulado = sumatoriaPrevia;

  console.log(`\n=== 🧮 INICIO DE DISTRIBUCIÓN DE DÍAS ===`);
  console.log(`Días previos acumulados: ${sumatoriaPrevia}`);
  console.log(`Días nuevos a procesar: ${diasNuevos}`);
  console.log(`Días totales esperados: ${sumatoriaPrevia + diasNuevos}\n`);

  // ── Grupo A: 1–2 (Empleador) ──
  const limiteA = 2;
  const espacioDisponibleA = Math.max(limiteA - acumulado, 0);
  const enA = Math.min(espacioDisponibleA, diasRestantes);
  console.log(`🔹 Grupo A (1–2):`);
  console.log(`  - Entidad: Empleador`);
  console.log(`  - Cupo disponible: ${espacioDisponibleA}`);
  console.log(`  - Asignados a Empleador: ${enA}`);
  acumulado += enA;
  diasRestantes -= enA;

  // ── Grupo B: 2–90 (EPS) ──
  const limiteB = 90;
  const espacioDisponibleB = Math.max(limiteB - acumulado, 0);
  const enB = Math.min(espacioDisponibleB, diasRestantes);
  console.log(`\n🔹 Grupo B (2–90):`);
  console.log(`  - Entidad: EPS`);
  console.log(`  - Cupo disponible: ${espacioDisponibleB}`);
  console.log(`  - Asignados a EPS (tramo 2–90): ${enB}`);
  acumulado += enB;
  diasRestantes -= enB;

  // ── Grupo C: 91–180 (EPS) ──
  const limiteC = 180;
  const espacioDisponibleC = Math.max(limiteC - acumulado, 0);
  const enC = Math.min(espacioDisponibleC, diasRestantes);
  console.log(`\n🔹 Grupo C (91–180):`);
  console.log(`  - Entidad: EPS`);
  console.log(`  - Cupo disponible: ${espacioDisponibleC}`);
  console.log(`  - Asignados a EPS (tramo 91–180): ${enC}`);
  acumulado += enC;
  diasRestantes -= enC;

  // ── Grupo D: 181–540 (Fondo de pensiones) ──
  const limiteD = 540;
  const espacioDisponibleD = Math.max(limiteD - acumulado, 0);
  const enD = Math.min(espacioDisponibleD, diasRestantes);
  console.log(`\n🔹 Grupo D (181–540):`);
  console.log(`  - Entidad: Fondo de pensiones`);
  console.log(`  - Cupo disponible: ${espacioDisponibleD}`);
  console.log(`  - Asignados a Fondo de pensiones: ${enD}`);
  acumulado += enD;
  diasRestantes -= enD;

  // ── Grupo E: 541+ (EPS/Fondo) ──
  const enE = Math.max(diasRestantes, 0);
  console.log(`\n🔹 Grupo E (541+):`);
  console.log(`  - Entidad: EPS/Fondo de pensiones`);
  console.log(`  - Asignados EPS/Fondo: ${enE}`);
  acumulado += enE;

  const sumatoriaTotal = sumatoriaPrevia + diasNuevos;

  console.log(`\n📊 Resumen final de distribución:`);
  console.log(`  • Empleador (1–2)                 → ${enA} días`);
  console.log(`  • EPS (2–90)                      → ${enB} días`);
  console.log(`  • EPS (91–180)                    → ${enC} días`);
  console.log(`  • Fondo de pensiones (181–540)    → ${enD} días`);
  console.log(`  • EPS/Fondo (541+)                → ${enE} días`);
  console.log(`🎯 Sumatoria final de días: ${sumatoriaTotal}`);
  console.log(`=== 🧮 FIN DE DISTRIBUCIÓN ===\n`);

  return {
    sumatoriaPrevia,          // Siempre 0 en esta versión simplificada
    diasNuevos,
    diasGrupo_1a2:    enA,
    diasGrupo_2a90:   enB,
    diasGrupo_91a180: enC,
    diasGrupo_181a540: enD,
    diasGrupo_541plus: enE,
    sumatoriaTotal
  };
}







/* CALCULA DIAS CON 4 PARAMETROS - ESPECIFICO PARA PRORROGA SI */
export function calcularDistribucionDias2(
  validacioTablaProrroga,
  diasLiquidadosAnterior,
  diasNuevos
) 
{
    const sumatoriaPrevia = validacioTablaProrroga?.sumatoria_incapacidades != null
        ? Number(validacioTablaProrroga.sumatoria_incapacidades)
        : Number(diasLiquidadosAnterior);

    let diasRestantes = diasNuevos;
    let acumulado = sumatoriaPrevia;

    console.log(`\n=== 🧮 INICIO DE DISTRIBUCIÓN DE DÍAS ===`);
    console.log(`Días previos acumulados: ${sumatoriaPrevia}`);
    console.log(`Días nuevos a procesar: ${diasNuevos}`);
    console.log(`Días totales esperados: ${sumatoriaPrevia + diasNuevos}\n`);


    // ── Grupo A: 1–2 (Empleador) ──
    const limiteA = 2;
    const espacioDisponibleA = Math.max(limiteA - acumulado, 0);
    const enA = Math.min(espacioDisponibleA, diasRestantes);
    console.log(`🔹 Grupo A (1–2):`);
    console.log(`  - Entidad: Empleador`);
    console.log(`  - Cupo disponible: ${espacioDisponibleA}`);
    console.log(`  - Asignados a Empleador: ${enA}`);
    acumulado += enA;
    diasRestantes -= enA;


    // ── Grupo B: 2–90 (EPS) ──
    const limiteB = 90;
    const espacioDisponibleB = Math.max(limiteB - Math.max(acumulado, limiteA), 0);
    const enB = Math.min(espacioDisponibleB, diasRestantes);
    console.log(`\n🔹 Grupo B (2–90):`);
    console.log(`  - Entidad: EPS`);
    console.log(`  - Cupo disponible: ${espacioDisponibleB}`);
    console.log(`  - Asignados a EPS (tramo 2–90): ${enB}`);
    acumulado += enB;
    diasRestantes -= enB;


    // ── Grupo C: 91–180 (EPS) ──
    const limiteC = 180;
    const espacioDisponibleC = Math.max(limiteC - Math.max(acumulado, limiteB), 0);
    const enC = Math.min(espacioDisponibleC, diasRestantes);
    console.log(`\n🔹 Grupo C (91–180):`);
    console.log(`  - Entidad: EPS`);
    console.log(`  - Cupo disponible: ${espacioDisponibleC}`);
    console.log(`  - Asignados a EPS (tramo 91–180): ${enC}`);
    acumulado += enC;
    diasRestantes -= enC;


    // ── Grupo D: 181–540 (Fondo de pensiones) ──
    const limiteD = 540;
    const espacioDisponibleD = Math.max(limiteD - Math.max(acumulado, limiteC), 0);
    const enD = Math.min(espacioDisponibleD, diasRestantes);
    console.log(`\n🔹 Grupo D (181–540):`);
    console.log(`  - Entidad: Fondo de pensiones`);
    console.log(`  - Cupo disponible: ${espacioDisponibleD}`);
    console.log(`  - Asignados a Fondo de pensiones: ${enD}`);
    acumulado += enD;
    diasRestantes -= enD;


    // ── Grupo E: 541+ (EPS/Fondo) ──
    const enE = Math.max(diasRestantes, 0);
    console.log(`\n🔹 Grupo E (541+):`);
    console.log(`  - Entidad: EPS/Fondo de pensiones`);
    console.log(`  - Asignados EPS/Fondo: ${enE}`);
    acumulado += enE;

    const sumatoriaTotal = sumatoriaPrevia + diasNuevos;

    console.log(`\n📊 Resumen final de distribución:`);
    console.log(`  • Empleador (1–2)     → ${enA} días`);
    console.log(`  • EPS (2–90)          → ${enB} días`);
    console.log(`  • EPS (91–180)        → ${enC} días`);
    console.log(`  • Fondo de pensiones (181–540) → ${enD} días`);
    console.log(`  • EPS/Fondo (541+)    → ${enE} días`);
    console.log(`🎯 Sumatoria final de días: ${sumatoriaTotal}`);
    console.log(`=== 🧮 FIN DE DISTRIBUCIÓN ===\n`);

    return {
        sumatoriaPrevia,
        diasNuevos,
        diasGrupo_1a2:    enA,
        diasGrupo_2a90:   enB,
        diasGrupo_91a180: enC,
        diasGrupo_181a540: enD,
        diasGrupo_541plus: enE,
        sumatoriaTotal
    };
}
