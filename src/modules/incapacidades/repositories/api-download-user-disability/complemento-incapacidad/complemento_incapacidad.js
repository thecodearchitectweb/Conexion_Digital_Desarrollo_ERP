import { pool } from '../../../../../models/db.js'


/* INSERT COMPLEMENTO INCAPACIDAD EPS 66.67% */
export async function complementoIncapacidad(deuda, id_liquidacion){

    try {

        const [result] = await pool.query(
            `
                UPDATE
                    incapacidades_liquidacion
                SET
                    complementoIncapacidadEPS = ?
                WHERE
                    id_incapacidades_liquidacion = ?
                
            `,
            [deuda, id_liquidacion]
        ) 

         return result.affectedRows > 0;

    } catch (error) {
        console.error("❌ Error al insertar en la tabla 'LIQUIDACION':", error);
        throw error;
    }

}



/* INSERT COMPLEMENTO INCAPACIDAD EPS 50.00% */
export async function complementoIncapacidadEPS_50(deuda, id_liquidacion){

    try {

        const [result] = await pool.query(
            `
                UPDATE
                    incapacidades_liquidacion
                SET
                    complementoIncapacidadEPS_50 = ?
                WHERE
                    id_incapacidades_liquidacion = ?
                
            `,
            [deuda, id_liquidacion]
        ) 

         return result.affectedRows > 0;

    } catch (error) {
        console.error("❌ Error al insertar en la tabla 'LIQUIDACION':", error);
        throw error;
    }

}

