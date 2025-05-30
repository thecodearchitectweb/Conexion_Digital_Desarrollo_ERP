// Devuelve un array de strings 'YYYY-MM-DD' entre dos fechas inclusive
export function obtenerDiasEntreFechas(fechaInicio, fechaFinal) {
    const dias = [];
    const cursor = new Date(fechaInicio);
    const fin = new Date(fechaFinal);

    while (cursor <= fin) {
        dias.push(cursor.toISOString().slice(0, 10)); // 'YYYY-MM-DD'
        cursor.setDate(cursor.getDate() + 1);
    }

    return dias;
}


// Devuelve los días de la incapacidadB que NO están en la incapacidadA
export function obtenerDiasNoRepetidos(incapacidadA, incapacidadB) {
    const diasA = obtenerDiasEntreFechas(
        incapacidadA.fecha_inicio_incapacidad,
        incapacidadA.fecha_final_incapacidad
    );
    const diasB = obtenerDiasEntreFechas(
        incapacidadB.fecha_inicio_incapacidad,
        incapacidadB.fecha_final_incapacidad
    );

    // Filtra los días de B que no existen en A
    return diasB.filter(dia => !diasA.includes(dia));
}




//------------------------------------------------------------------------------


// Devuelve un array de strings 'YYYY-MM-DD' entre dos fechas inclusive
export function obtenerDiasEntreFechas2(fechaInicio, fechaFinal) {
  const dias = [];
  const cursor = new Date(fechaInicio);
  const fin    = new Date(fechaFinal);

  while (cursor <= fin) {
    dias.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dias;
}


export function obtenerDiasNoRepetidos2({ 
  fecha_inicio_incapacidad, 
  fecha_final_incapacidad 
}) {
  return obtenerDiasEntreFechas(
    fecha_inicio_incapacidad,
    fecha_final_incapacidad
  );
}
