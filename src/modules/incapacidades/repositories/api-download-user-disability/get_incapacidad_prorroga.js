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

        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error('Error en getDatosIncapacidadProrroga:', error);
        return [];    
    }
}





/* CONSULTA INCAPACIDAD PRORROGA ARL */
export async function getDatosIncapacidadProrrogaARL(id_incapacidad_prorroga){

    try {

        const tipo_incapacidad = 'ARL'
        const [rows] = await pool.query(
            `
                SELECT 
                    id_incapacidades_liquidacion,
                    tipo_incapacidad,
                    id_empleado,
                    fecha_inicio_incapacidad,
                    fecha_final_incapacidad,
                    cantidad_dias,
                    dias_liquidables_totales
                FROM
                    incapacidades_liquidacion
                WHERE
                    id_incapacidades_liquidacion = ?
                AND
                    tipo_incapacidad = ?
            `, [id_incapacidad_prorroga, tipo_incapacidad]
        )

        return rows.length > 0 ? rows[0] : null;


    } catch (error) {
        console.error('Error en getDatosIncapacidadProrroga:', error);
        return [];    
    }
}