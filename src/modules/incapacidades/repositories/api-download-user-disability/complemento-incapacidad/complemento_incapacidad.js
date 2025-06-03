import { pool } from '../../../../../models/db.js'


/* INSERT COMPLEMENTO INCAPACIDAD EPS 66.67% */
export async function complementoIncapacidad(deuda){

    try {

        const [result] = await pool.query(
            `
                INSERT INTO incapacidades_liquidacion(
                  
                        complementoIncapacidadEPS
                   
                ) VALUES (?)
                
            `,
            [deuda]
        ) 

         return result.affectedRows > 0;

    } catch (error) {
        console.error("❌ Error al insertar en la tabla 'LIQUIDACION':", error);
        throw error;
    }

}

