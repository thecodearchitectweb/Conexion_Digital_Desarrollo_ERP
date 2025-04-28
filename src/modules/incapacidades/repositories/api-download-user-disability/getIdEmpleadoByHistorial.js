import { pool } from "../../../../models/db.js";

export async function getIdEmpleadoByHistorial(id_historial) {
    try {
        const [rows] = await pool.query(
            `
            SELECT id_empleado
            FROM incapacidades_historial
            WHERE id_incapacidades_historial = ?
            `,
            [id_historial]
        );

        if (rows.length === 0) {
            console.warn("No se encontró ningún empleado con el historial: ", id_historial);
            return null;
        }

        return rows[0].id_empleado;
        
    } catch (error) {
        console.error("Error al obtener el id_empleado:", error);
        throw error;
    }
}
