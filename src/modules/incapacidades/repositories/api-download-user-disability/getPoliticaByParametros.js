
import { pool } from "../../../../models/db.js";


export async function getPoliticaByParametros
(
    prorroga, diasLaborados, salario, tipoIncapacidad, diasIncapacidad
) 
{
    try {
        const [politicas] = await pool.query(
            `
            SELECT * FROM 
                politicas_incapacidades
            WHERE 
                TRIM(LOWER(prorroga)) = TRIM(LOWER(?))
                AND TRIM(LOWER(dias_laborados)) = TRIM(LOWER(?))
                AND TRIM(LOWER(salario)) = TRIM(LOWER(?))
                AND TRIM(LOWER(tipo_incapacidad)) = TRIM(LOWER(?))
                AND TRIM(LOWER(dias_incapacidad)) = TRIM(LOWER(?))
            `,
            [prorroga, diasLaborados, salario, tipoIncapacidad, diasIncapacidad]
        );

        if (politicas.length === 0) {
            return null;
        }

        return politicas[0]; // Retornamos solo la política encontrada
        
    } catch (error) {
        console.error("Error al obtener la política de incapacidad:", error);
        throw error;
    }
}

