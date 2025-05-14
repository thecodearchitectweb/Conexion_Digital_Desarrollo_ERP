import { pool } from "../../../../models/db.js";

export async function buscarProrrogaConsecutiva(id_incapacidad_prorroga){
    try {

        const [rows] = await pool.query(
            `
                SELECT * FROM 
                    prorroga
                WHERE
                    id_incapacidades_liquidacion = ?
            `, [id_incapacidad_prorroga]
        )

        
        if (rows.length === 0) {
            return []
        }

        return rows[0]

    } catch (error) {
        console.error("Error al obtener el historial de incapacidad:", error);
        throw error;
    }
} 