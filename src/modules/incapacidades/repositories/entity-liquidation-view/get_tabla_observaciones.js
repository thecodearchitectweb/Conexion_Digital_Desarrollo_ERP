import { pool } from "../../../../models/db.js";


export async function getTablaObservaciones (id_liquidacion) {

    try {
        
        const [rows] = await pool.query(
            `
                SELECT 
                    estado,
                    observaciones,
                    fecha_registro
                FROM
                    seguimiento_incapacidad_liquidada
                WHERE
                    id_incapacidades_liquidacion = ?
                ORDER BY fecha_registro DESC
            `, [id_liquidacion]
        )


        if(!rows.length){
            return [];        
        }

        return rows;

    } catch (error) {
        console.error("Error en getTablaObservaciones:", error);
        throw error;
    }

}