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






/* ACTUALIZACION TABLA LIQUIDACION EMPLEADOR */
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
