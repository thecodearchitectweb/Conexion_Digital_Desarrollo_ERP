
/* LIQUIDACION POR EPS */

export function entityLiquidation(salario, porcentaje_liquidacion_eps, cant_dias_liq) {
    try {
        if (!salario || !porcentaje_liquidacion_eps || !cant_dias_liq) {
            throw new Error("Faltan parámetros para calcular la liquidación.");
        }

        // Salario diario con base en 30 días
        const salarioDiario = salario / 30;

        // Porcentaje aplicado al salario diario
        const valorPorDia = salarioDiario * (parseFloat(porcentaje_liquidacion_eps) / 100);

        // Total liquidación para la entidad (EPS)
        const total = valorPorDia * cant_dias_liq;

        return parseFloat(total.toFixed(2));
    } catch (error) {
        console.error("Error al calcular la liquidación de la entidad:", error);
        return 0;
    }
}




/* LIQUIDACION POR EMPLEADOR */

export function entityLiquidationEmpleador(salario, porcentaje_liquidacion_empleador, cant_dias_liq) {
    try {
        if (!salario || !porcentaje_liquidacion_empleador || !cant_dias_liq) {
            throw new Error("Faltan parámetros para calcular la liquidación.");
        }

        console.log(salario, porcentaje_liquidacion_empleador, cant_dias_liq)

        // Salario diario con base en 30 días
        const salarioDiario = salario / 30;

        // Porcentaje aplicado al salario diario
        const valorPorDia = salarioDiario * (parseFloat(porcentaje_liquidacion_empleador) / 100);

        // Total liquidación para la entidad (EPS)
        const total = valorPorDia * cant_dias_liq;

        return parseFloat(total.toFixed(2));
    } catch (error) {
        console.error("Error al calcular la liquidación de la entidad:", error);
        return 0;
    }
}
