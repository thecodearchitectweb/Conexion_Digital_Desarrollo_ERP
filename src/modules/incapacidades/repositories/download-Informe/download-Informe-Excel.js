import { pool } from "../../../../models/db.js";


/* export async function DataIncapacidades(fecha_inicio, fecha_final) {

    try {

        console.log("INGRESO EN LA CONSULTA: ")

        const [rows] = await pool.query(
            `
                SELECT * FROM
                    incapacidades_liquidacion
                WHERE
                    fecha_inicio_incapacidad BETWEEN ? AND ?
                ORDER BY
                    fecha_inicio_incapacidad DESC
    `,
            [fecha_inicio, fecha_final]
        );


        return rows.length > 0 ? rows : null;

    } catch (error) {
        console.error("Error al obtener datos del empleado:", error);
        throw error;
    }
} */


export async function DataIncapacidades(fecha_inicio, fecha_final) {
    try {
        console.log("INGRESO EN LA CONSULTA:");

        const [rows] = await pool.query(
            `
                SELECT
                    liq.*,

                    /* Estado más reciente para esta liquidación */
                    (
                    SELECT s.estado
                    FROM seguimiento_incapacidad_liquidada AS s
                    WHERE s.id_incapacidades_liquidacion = liq.id_incapacidades_liquidacion
                    ORDER BY s.fecha_actualizacion DESC
                    LIMIT 1
                    ) AS estado,

                    /* Observaciones asociadas a ese estado */
                    (
                    SELECT s.observaciones
                    FROM seguimiento_incapacidad_liquidada AS s
                    WHERE s.id_incapacidades_liquidacion = liq.id_incapacidades_liquidacion
                    ORDER BY s.fecha_actualizacion DESC
                    LIMIT 1
                    ) AS observaciones

                FROM incapacidades_liquidacion AS liq
                WHERE liq.fecha_inicio_incapacidad BETWEEN ? AND ?
                ORDER BY liq.fecha_inicio_incapacidad DESC
            `,
            [fecha_inicio, fecha_final]
        );

        return rows.length > 0 ? rows : null;
    } catch (error) {
        console.error("Error al obtener datos del empleado:", error);
        throw error;
    }
}

