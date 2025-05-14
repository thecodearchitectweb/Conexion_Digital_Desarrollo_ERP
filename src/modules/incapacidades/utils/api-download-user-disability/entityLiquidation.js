
/* LIQUIDACION POR EPS */

export function entityLiquidation(salario, porcentaje_liquidacion_eps, cant_dias_liq) {
    try {
        console.log("LIQUIDACION PARA EPS: ", salario, porcentaje_liquidacion_eps, cant_dias_liq)
        if (!salario || !porcentaje_liquidacion_eps || !cant_dias_liq) {
            throw new Error("Faltan parámetros para calcular la liquidación.");
        }

        // Salario diario con base en 30 días
        const salarioDiario = salario / 30;

        // Porcentaje aplicado al salario diario
        const valorPorDia = salarioDiario * (parseFloat(porcentaje_liquidacion_eps) / 100);

        // Total liquidación para la entidad (EPS)
        const total = valorPorDia * cant_dias_liq;

        console.log("LIQUIDACION PARA EPS: ", "SALARIO: ",salario, "% LIQUIDACION: ", porcentaje_liquidacion_eps, "CANTIDAD DE DÍAS: ", cant_dias_liq)

        return parseFloat(total.toFixed(2));
    } catch (error) {
       
        console.error("Error al calcular la liquidación de la entidad EPS:", error);
        return 0;
    }
}





/* LIQUIDACION POR EMPLEADOR */

export function entityLiquidationEmpleador(salario, porcentaje_liquidacion_empleador, cant_dias_liq) {
    try {

        console.log("LIQUIDACION PARA EMPLEADOR", salario, porcentaje_liquidacion_empleador, cant_dias_liq )

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
        console.log("LIQUIDACION PARA EMPLEADOR", salario, porcentaje_liquidacion_empleador, cant_dias_liq )
        console.error("Error al calcular la liquidación de la entidad EMPLEADOR:", error);
        return 0;
    }
}
