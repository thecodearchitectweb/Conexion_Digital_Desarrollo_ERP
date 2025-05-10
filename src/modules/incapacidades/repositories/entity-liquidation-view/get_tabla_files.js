import { pool } from "../../../../models/db.js";


export async function getTablaFiles (id_liquidacion) {
    try {
        
        const [rows] = await pool.query(
            `
                SELECT
                    nombre,
                    ruta, 
                    fecha_registro
                FROM
                  files_upload
                WHERE
                    id_incapacidades_liquidacion = ?                
            `,
            [id_liquidacion]
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