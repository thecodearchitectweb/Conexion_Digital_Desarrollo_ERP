import { pool } from "../../../../models/db.js";


export async function getDatosIncapacidadProrroga(id_incapacidad_prorroga){

    try {

        const [rows] = await pool.query(
            `
                SELECT 
                    id_incapacidades_liquidacion,
                    id_empleado,
                    fecha_inicio_incapacidad,
                    fecha_final_incapacidad,
                    cantidad_dias,
                    dias_liquidables_totales
                FROM
                    incapacidades_liquidacion
                WHERE
                    id_incapacidades_liquidacion = ?
            `, [id_incapacidad_prorroga]
        )

        if(!rows.length){
            return []
        }

        return rows[0]

    } catch (error) {
        console.error('Error en getDatosIncapacidadProrroga:', error);
        return [];    
    }
}