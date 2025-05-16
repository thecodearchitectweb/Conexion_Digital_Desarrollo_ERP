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

        
        return rows.length > 0 ? rows[0] : null;


    } catch (error) {
        console.error("Error al obtener el historial de incapacidad:", error);
        throw error;
    }
} 




/* BUSQUEDA TABLA PRORROGA PARA ARL */
export async function buscarProrrogaConsecutivaARL(id_incapacidad_prorroga){
    try {

        const tipo_incapcidad = 'ARL'

        const [rows] = await pool.query(
            `
                SELECT * FROM 
                    prorroga
                WHERE
                    id_incapacidades_liquidacion = ?
                AND
                    tipo_incapacidad = ?
            `, [id_incapacidad_prorroga, tipo_incapcidad]
        )

        
        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error("Error al obtener el historial de incapacidad:", error);
        throw error;
    }
} 