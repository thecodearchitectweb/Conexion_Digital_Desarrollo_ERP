import { pool } from "../../../../models/db.js";

/* INSERTAR DATOS A LA TABLA PRORROGA */
export async function updateTablaProrrogaDB(
    up_T_prorroga_id_empleado,
    up_T_prorroga_id_incapacidad_prorroga,
    up_T_prorroga_tipo_incapacidad_prorroga,
    up_T_prorroga_fecha_inicio_incapacidad,
    up_T_prorroga_fecha_final_incapacidad,
    up_T_prorroga_dias_incapacidad_prorroga,
    up_T_prorroga_dias_liquidables_totales_prorroga,
    up_T_prorroga_id_incapacidad_liquidacion,
    up_T_prorroga_tipo_incapcidad,
    up_T_prorroga_fehca_inicio,
    up_T_prorroga_fecha_final,
    up_T_prorroga_dias_incapacidad,
    up_T_prorroga_dias_liquidados,
    up_T_prorroga_sumatoria_acomulada
) {
    try {
        const [result] = await pool.query(
            `
            INSERT INTO prorroga (
                id_empleado,
                id_incapacidad_prorroga,
                tipo_incapacidad_prorroga,
                fecha_inicio_prorroga,
                fecha_final_prorroga,
                dias_incapacidad_prorroga,
                dias_liquidados_prorroga,
                id_incapacidades_liquidacion,
                tipo_incapacidad,
                fecha_inicio,
                fecha_final,
                dias_incapacidad,
                dias_liquidados,
                sumatoria_incapacidades
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                up_T_prorroga_id_empleado,
                up_T_prorroga_id_incapacidad_prorroga,
                up_T_prorroga_tipo_incapacidad_prorroga,
                up_T_prorroga_fecha_inicio_incapacidad,
                up_T_prorroga_fecha_final_incapacidad,
                up_T_prorroga_dias_incapacidad_prorroga,
                up_T_prorroga_dias_liquidables_totales_prorroga,
                up_T_prorroga_id_incapacidad_liquidacion,
                up_T_prorroga_tipo_incapcidad,
                up_T_prorroga_fehca_inicio,
                up_T_prorroga_fecha_final,
                up_T_prorroga_dias_incapacidad,
                up_T_prorroga_dias_liquidados,
                up_T_prorroga_sumatoria_acomulada
            ]
        );

        console.log("✔ Inserción en tabla 'prorroga' realizada:", result);
        return result;
    } catch (error) {
        console.error("❌ Error al insertar en la tabla 'prorroga':", error);
        throw error;
    }
}
