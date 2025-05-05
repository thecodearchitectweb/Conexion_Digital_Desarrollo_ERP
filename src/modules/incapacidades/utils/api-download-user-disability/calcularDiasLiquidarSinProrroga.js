function normalizarFecha(fecha) {
    const f = new Date(fecha);
    return new Date(f.getFullYear(), f.getMonth(), f.getDate());
}


export function calcularDiasLiquidar(fechaInicioAnterior, fechaFinalAnterior, fechaInicialNueva, fechaFinalNueva) {
    const fInicioNueva = normalizarFecha(fechaInicialNueva);
    const fFinalNueva = normalizarFecha(fechaFinalNueva);

    // Si no hay fechas anteriores, se trata de una nueva incapacidad completa
    if (!fechaInicioAnterior || !fechaFinalAnterior) {
        const dias = Math.floor((fFinalNueva - fInicioNueva) / (1000 * 60 * 60 * 24)) + 1;
        console.log("No hay fechas anteriores: ", dias)
        return dias > 0 ? dias : 0;
    }

    // Normalizar fechas anteriores (si existen)
    const fInicioAnt = normalizarFecha(fechaInicioAnterior);
    const fFinalAnt = normalizarFecha(fechaFinalAnterior);

    // Caso 1: Fecha inicial nueva dentro del rango anterior
    if (fInicioNueva >= fInicioAnt && fInicioNueva <= fFinalAnt) {
        const diaSiguiente = new Date(fFinalAnt);
        diaSiguiente.setDate(diaSiguiente.getDate() + 1);

        const dias = Math.floor((fFinalNueva - diaSiguiente) / (1000 * 60 * 60 * 24)) + 1;
        console.log("Fecha inicial nueva dentro del rango anterior", dias)
        return dias > 0 ? dias : 0;
    }

    // Caso 2: Fecha nueva después de la anterior
    if (fInicioNueva > fFinalAnt) {
        const dias = Math.floor((fFinalNueva - fInicioNueva) / (1000 * 60 * 60 * 24)) + 1;
        console.log("Fecha nueva después de la anterior", dias)
        return dias > 0 ? dias : 0;
    }

    // Si no aplica ningún caso
    return 0;
}
