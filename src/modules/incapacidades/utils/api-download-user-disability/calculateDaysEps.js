

export function calculateDaysEps(fecha_final_incapacidad_anterior, fecha_final_incapacidad_liquidar) {
    try {
        const fechaAnterior = new Date(fecha_final_incapacidad_anterior);
        const fechaLiquidar = new Date(fecha_final_incapacidad_liquidar);

        if (isNaN(fechaAnterior) || isNaN(fechaLiquidar)) {
            throw new Error("Alguna de las fechas no es válida.");
        }

        const diferenciaEnMilisegundos = fechaLiquidar - fechaAnterior;
        const dias = Math.ceil(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24)); // Redondea hacia arriba

        return dias;
    } catch (error) {
        console.error("Error al calcular la diferencia de días entre fechas EPS:", error.message);
        return null; // O podrías lanzar error si prefieres forzar manejo arriba
    }
}
