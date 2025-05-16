import { pool } from "../../../../models/db.js";



export async function updateSettlementTable(
    dias_liquidacion_empleador,
    dias_liquidacion_eps,
    dias_liquidacion_arl,
    dias_liquidacion_fondo_pensiones,
    dias_liquidacion_eps_fondo_pensiones,
    porcentaje_liquidacion_empleador,
    porcentaje_liquidacion_eps,
    porcentaje_liquidacion_arl,
    porcentaje_liquidacion_fondo_pensiones,
    porcentaje_liquidacion_eps_fondo_pensiones,
    liquidacion_empleador,
    liquidacion_eps,
    liquidacion_arl,
    liquidacion_fondo_pensiones,
    liquidacion_eps_fondo_pensiones,
    dias_laborados,
    id_incapacidades_liquidacion,
    dias_liquidables_totales
) {
    try {
        const [updateValues] = await pool.query(
            `
            UPDATE incapacidades_liquidacion
            SET
                dias_liquidacion_empleador = ?,
                dias_liquidacion_eps = ?,
                dias_liquidacion_arl = ?,
                dias_liquidacion_fondo_pensiones = ?,
                dias_liquidacion_eps_fondo_pensiones = ?,
                porcentaje_liquidacion_empleador = ?,
                porcentaje_liquidacion_eps = ?, 
                porcentaje_liquidacion_arl = ?, 
                porcentaje_liquidacion_fondo_pensiones = ?,
                porcentaje_liquidacion_eps_fondo_pensiones = ?,
                liquidacion_empleador = ?,
                liquidacion_eps = ?,
                liquidacion_arl = ?,
                liquidacion_fondo_pensiones = ?,
                liquidacion_eps_fondo_pensiones = ?,
                dias_laborados = ?,
                dias_liquidables_totales = ?
            WHERE id_incapacidades_liquidacion = ?
            `,
            [
                dias_liquidacion_empleador,
                dias_liquidacion_eps,
                dias_liquidacion_arl,
                dias_liquidacion_fondo_pensiones,
                dias_liquidacion_eps_fondo_pensiones,
                porcentaje_liquidacion_empleador,
                porcentaje_liquidacion_eps,
                porcentaje_liquidacion_arl,
                porcentaje_liquidacion_fondo_pensiones,
                porcentaje_liquidacion_eps_fondo_pensiones,
                liquidacion_empleador,
                liquidacion_eps,
                liquidacion_arl,
                liquidacion_fondo_pensiones,
                liquidacion_eps_fondo_pensiones,
                dias_laborados,
                dias_liquidables_totales,
                id_incapacidades_liquidacion
            ]
        );

        return updateValues.affectedRows > 0;
    } catch (error) {
        console.error("❌ Error al actualizar incapacidades_liquidacion:", error);
        throw error;
    }
}





/* EMPLEADOR */
export async function updateSettlementTableEmpleador(
    dias_liquidacion_empleador,
    dias_liquidacion_eps,
    dias_liquidacion_arl,
    dias_liquidacion_fondo_pensiones,
    dias_liquidacion_eps_fondo_pensiones,
    porcentaje_liquidacion_empleador,
    porcentaje_liquidacion_eps,
    porcentaje_liquidacion_arl,
    porcentaje_liquidacion_fondo_pensiones,
    porcentaje_liquidacion_eps_fondo_pensiones,
    liquidacion_empleador,
    liquidacion_eps,
    liquidacion_arl,
    liquidacion_fondo_pensiones,
    liquidacion_eps_fondo_pensiones,
    dias_laborados,
    id_incapacidades_liquidacion
) {
    try {
        const [updateValues] = await pool.query(
            `
            UPDATE incapacidades_liquidacion
            SET
                dias_liquidacion_empleador = ?,
                dias_liquidacion_eps = ?,
                dias_liquidacion_arl = ?,
                dias_liquidacion_fondo_pensiones = ?,
                dias_liquidacion_eps_fondo_pensiones = ?,
                porcentaje_liquidacion_empleador = ?,
                porcentaje_liquidacion_eps = ?, 
                porcentaje_liquidacion_arl = ?, 
                porcentaje_liquidacion_fondo_pensiones = ?,
                porcentaje_liquidacion_eps_fondo_pensiones = ?,
                liquidacion_empleador = ?,
                liquidacion_eps = ?,
                liquidacion_arl = ?,
                liquidacion_fondo_pensiones = ?,
                liquidacion_eps_fondo_pensiones = ?,
                dias_laborados = ?
            WHERE id_incapacidades_liquidacion = ?
            `,
            [
                dias_liquidacion_empleador,
                dias_liquidacion_eps,
                dias_liquidacion_arl,
                dias_liquidacion_fondo_pensiones,
                dias_liquidacion_eps_fondo_pensiones,
                porcentaje_liquidacion_empleador,
                porcentaje_liquidacion_eps,
                porcentaje_liquidacion_arl,
                porcentaje_liquidacion_fondo_pensiones,
                porcentaje_liquidacion_eps_fondo_pensiones,
                liquidacion_empleador,
                liquidacion_eps,
                liquidacion_arl,
                liquidacion_fondo_pensiones,
                liquidacion_eps_fondo_pensiones,
                dias_laborados,
                id_incapacidades_liquidacion
            ]
        );

        return updateValues.affectedRows > 0;
    } catch (error) {
        console.error("❌ Error al actualizar incapacidades_liquidacion:", error);
        throw error;
    }
}




/* ARL */
export async function updateSettlementTableARL(
    liq_dias_empleador,
    liq_dias_eps,
    liq_dias_arl,
    liq_dias_fondo,
    liq_dias_eps_fondo,
    Liq_porcentaje_liquidacion_empleador,
    Liq_porcentaje_liquidacion_eps,
    Liq_porcentaje_liquidacion_arl,
    Liq_porcentaje_liquidacion_fondo_pensiones,
    Liq_porcentaje_liquidacion_eps_fondo_pensiones,
    liq_valor_empleador,
    liq_valor_eps,
    liq_valor_arl,
    liq_valor_fondo_pensiones,
    liq_valor_eps_fondo_pensiones,
    dias_laborados,
    id_liquidacion
) {
    try {
        const [updateValues] = await pool.query(
            `
            UPDATE incapacidades_liquidacion
            SET
                dias_liquidacion_empleador = ?,
                dias_liquidacion_eps = ?,
                dias_liquidacion_arl = ?,
                dias_liquidacion_fondo_pensiones = ?,
                dias_liquidacion_eps_fondo_pensiones = ?,
                porcentaje_liquidacion_empleador = ?,
                porcentaje_liquidacion_eps = ?, 
                porcentaje_liquidacion_arl = ?, 
                porcentaje_liquidacion_fondo_pensiones = ?,
                porcentaje_liquidacion_eps_fondo_pensiones = ?,
                liquidacion_empleador = ?,
                liquidacion_eps = ?,
                liquidacion_arl = ?,
                liquidacion_fondo_pensiones = ?,
                liquidacion_eps_fondo_pensiones = ?,
                dias_laborados = ?,
                dias_liquidables_totales = ?
            WHERE id_incapacidades_liquidacion = ?
            `,
            [
                liq_dias_empleador,
                liq_dias_eps,
                liq_dias_arl,
                liq_dias_fondo,
                liq_dias_eps_fondo,
                Liq_porcentaje_liquidacion_empleador,
                Liq_porcentaje_liquidacion_eps,
                Liq_porcentaje_liquidacion_arl,
                Liq_porcentaje_liquidacion_fondo_pensiones,
                Liq_porcentaje_liquidacion_eps_fondo_pensiones,
                liq_valor_empleador,
                liq_valor_eps,
                liq_valor_arl,
                liq_valor_fondo_pensiones,
                liq_valor_eps_fondo_pensiones,
                dias_laborados,
                liq_dias_arl,
                id_liquidacion
            ]
        );

        return updateValues.affectedRows > 0;
    } catch (error) {
        console.error("❌ Error al actualizar incapacidades_liquidacion:", error);
        throw error;
    }
}
