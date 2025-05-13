/**
 * Devuelve un array de strings 'YYYY-MM-DD' entre dos fechas inclusive.
 * Acepta formatos 'YYYY/MM/DD' o 'YYYY-MM-DD'.
 */
export function obtenerDiasEntreFechas(fechaInicio, fechaFinal) {
    const dias = [];
    // Normalizamos a 'YYYY-MM-DD' para evitar problemas de parsing
    const inicio = new Date(fechaInicio.replace(/\//g, '-'));
    const fin    = new Date(fechaFinal.replace(/\//g, '-'));
    const cursor = new Date(inicio);
  
    while (cursor <= fin) {
      dias.push(cursor.toISOString().slice(0, 10));
      cursor.setDate(cursor.getDate() + 1);
    }
  
    return dias;
  }
  
  /**
   * Devuelve los días de la incapacidadB que NO están en la incapacidadA.
   *
   * incapacidadA y incapacidadB son objetos con:
   *   { fecha_inicio_incapacidad: string, fecha_final_incapacidad: string }
   */
  export function obtenerDiasNoRepetidosProrroga(incapacidadA, incapacidadB) {
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
  