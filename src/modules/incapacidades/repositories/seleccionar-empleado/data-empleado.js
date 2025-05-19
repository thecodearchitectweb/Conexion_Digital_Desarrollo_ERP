import { pool } from "../../../../models/db.js";


export async function dataEmpleadoIncapacidad(id_empleado) {

    try {

        const [rows] = await pool.query(
            `
                SELECT 
                    nombres, 
                    apellidos,
                    documento
                FROM
                    empleado
                WHERE
                    id_empleado = ?
            `,
            [id_empleado]
        );


        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error("Error al obtener datos del empleado:", error);
        throw error;
    }
}

