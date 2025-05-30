import { pool } from '../../../../../models/db.js'


export async function updateSettlementTable(
    id_user_session,
    upd_liq_dias_eps,
    upd_Liq_porcentaje_liquidacion_eps,
    upd_liq_valor_eps,
    upd_dias_Laborados,
    upd_id_liquidacion,
    upd_dias_liquidables_totales
) {
    try {


        console.log("actualizacion eps por licncia")

        const [updateValues] = await pool.query(
            `
            UPDATE incapacidades_liquidacion
            SET
                id_user_session = ?,
                dias_liquidacion_eps = ?,
                porcentaje_liquidacion_eps = ?, 
                liquidacion_eps = ?,
                dias_laborados = ?,
                dias_liquidables_totales = ?
            WHERE id_incapacidades_liquidacion = ?
            `,
            [
                id_user_session,
                upd_liq_dias_eps,
                upd_Liq_porcentaje_liquidacion_eps,
                upd_liq_valor_eps,
                upd_dias_Laborados,
                upd_dias_liquidables_totales,
                upd_id_liquidacion
                
            ]
        );

        return updateValues.affectedRows > 0;

    } catch (error) {
        console.error("❌ Error al actualizar incapacidades_liquidacion:", error);
        throw error;
    }
}
