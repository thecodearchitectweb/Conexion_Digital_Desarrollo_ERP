import { pool } from "../../../../models/db.js";


export async function DataIncapacidades(fecha_inicio, fecha_final) {

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
}

