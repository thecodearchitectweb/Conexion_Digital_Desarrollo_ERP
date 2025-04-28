// Normalizar fecha a solo año, mes, día (sin horas molestas)
function normalizarFecha(fecha) {
    const f = new Date(fecha);
    return new Date(f.getFullYear(), f.getMonth(), f.getDate()); // yyyy, mm, dd
}

// Verifica si las fechas están seguidas (exactamente 1 día de diferencia)
function validarFechasSeguidas(fechaFinalAnterior, fechaInicialLiquidar) {
    const finalAnterior = normalizarFecha(fechaFinalAnterior);
    const inicialLiquidar = normalizarFecha(fechaInicialLiquidar);

    const diferenciaDias = (inicialLiquidar - finalAnterior) / (1000 * 60 * 60 * 24);
    console.log("diferenciaDias: ", diferenciaDias)

    return diferenciaDias === 1;
}


// Verifica si la fecha inicial de liquidar cae dentro del rango anterior
function validarFechaDentroDeRango(fechaInicioAnterior, fechaFinalAnterior, fechaInicialLiquidar) {
    const inicioAnterior = normalizarFecha(fechaInicioAnterior);
    const finalAnterior = normalizarFecha(fechaFinalAnterior);
    const inicialLiquidar = normalizarFecha(fechaInicialLiquidar);

    console.log("inicioAnterior: ",inicioAnterior)
    console.log("finalAnterior: ",finalAnterior)
    console.log("inicialLiquidar: ",inicialLiquidar)

    return inicialLiquidar >= inicioAnterior && inicialLiquidar <= finalAnterior;
}


// Función principal que decide cuál regla aplica
export function validarProrroga(fechaInicioAnterior, fechaFinalAnterior, fechaInicialLiquidar, fechaFinalLiquidar) {
    try {
        if (validarFechasSeguidas(fechaFinalAnterior, fechaInicialLiquidar)) {
            console.log("✅ Aplica prórroga: Fechas seguidas.");
            return true;
        }
        
        if (validarFechaDentroDeRango(fechaInicioAnterior, fechaFinalAnterior, fechaInicialLiquidar)) {
            console.log("✅ Aplica prórroga: Fecha inicial dentro del rango anterior.");
            return true;
        }

        console.log("🚫 No aplica prórroga: No cumple ninguna condición.");
        return false;
    } catch (error) {
        console.error("💥 Error al validar la prórroga:", error);
        return false;
    }
}
