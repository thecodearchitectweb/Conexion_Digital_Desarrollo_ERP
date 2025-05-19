import { pool } from "../../../../models/db.js";


export async function DataIncapacidadesEmpleado(fecha_inicio, fecha_final, id_empleado) {

    try {

        const [rows] = await pool.query(
            `
                SELECT * FROM
                    incapacidades_liquidacion
                WHERE
                    id_empleado = ?
                AND
                    fecha_inicio_incapacidad BETWEEN ? AND ?
                ORDER BY
                    fecha_inicio_incapacidad DESC
    `,
            [id_empleado, fecha_inicio, fecha_final]
        );


        return rows.length > 0 ? rows : null;

    } catch (error) {
        console.error("Error al obtener datos del empleado:", error);
        throw error;
    }
}

