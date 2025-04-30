// Normalizar fecha a solo año, mes, día (sin horas molestas)
function normalizarFecha(fecha) {
    const f = new Date(fecha);
    return new Date(f.getFullYear(), f.getMonth(), f.getDate()); // yyyy, mm, dd
}

export function calcularDiasLiquidar(fechaInicioAnterior, fechaFinalAnterior, fechaInicialNueva, fechaFinalNueva) {
    const fInicioAnt = normalizarFecha(fechaInicioAnterior);
    const fFinalAnt = normalizarFecha(fechaFinalAnterior);
    const fInicioNueva = normalizarFecha(fechaInicialNueva);
    const fFinalNueva = normalizarFecha(fechaFinalNueva);

    // Caso 1: Fecha inicial nueva dentro del rango anterior
    if (fInicioNueva >= fInicioAnt && fInicioNueva <= fFinalAnt) {
        // La liquidación empieza al día siguiente del fin anterior
        const diaSiguiente = new Date(fFinalAnt);
        diaSiguiente.setDate(diaSiguiente.getDate() + 1);

        const dias = Math.floor((fFinalNueva - diaSiguiente) / (1000 * 60 * 60 * 24)) + 1;
        return dias > 0 ? dias : 0;
    }

    // Caso 2: Fecha nueva después de la anterior
    if (fInicioNueva > fFinalAnt) {
        const dias = Math.floor((fFinalNueva - fInicioNueva) / (1000 * 60 * 60 * 24)) + 1;
        return dias > 0 ? dias : 0;
    }

    // Si no aplica nada (por seguridad)
    return 0;
}
