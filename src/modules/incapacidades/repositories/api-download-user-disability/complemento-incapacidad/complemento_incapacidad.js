import { pool } from '../../../../../models/db.js'


/* INSERT COMPLEMENTO INCAPACIDAD EMPLEADOR 100%$$  GRUPO A*/
export async function complementoIncapacidadEmpleador(deuda, id_liquidacion){

    console.log("DATOS A ACTUALIZAR EN COMPLEMENTO GRUPO B: ", deuda, id_liquidacion)

    try {

        const [result] = await pool.query(
            `
                UPDATE
                    incapacidades_liquidacion
                SET
                    complementoIncapacidadEmpleador = ?
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




/* INSERT COMPLEMENTO INCAPACIDAD EPS 66.67%  GRUPO B*/
export async function complementoIncapacidad(deuda, id_liquidacion){

    console.log("DATOS A ACTUALIZAR EN COMPLEMENTO GRUPO B: ", deuda, id_liquidacion)

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



/* INSERT COMPLEMENTO INCAPACIDAD EPS 50.00%  GRUPO C*/
export async function complementoIncapacidadEPS_50(deuda, id_liquidacion){

    console.log("DATOS A ACTUALIZAR EN COMPLEMENTO GRUPO C: ", deuda, id_liquidacion)



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




/* INSERT COMPLEMENTO INCAPACIDAD FONDO PENSIONES GRUPO D */
export async function complementoIncapacidadFondoPensiones(deuda, id_liquidacion){

    console.log("DATOS A ACTUALIZAR EN COMPLEMENTO GRUPO D: ", deuda, id_liquidacion)


    try {

        const [result] = await pool.query(
            `
                UPDATE
                    incapacidades_liquidacion
                SET
                    complementoIncapacidadFondoPensiones = ?
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




/* INSERT COMPLEMENTO INCAPACIDAD EPS - FONDO PENSIONES GRUPO E */
export async function complementoIncapacidadEPSFondoPensiones(deuda, id_liquidacion){

    console.log("DATOS A ACTUALIZAR EN COMPLEMENTO GRUPO E: ", deuda, id_liquidacion)


    try {

        const [result] = await pool.query(
            `
                UPDATE
                    incapacidades_liquidacion
                SET
                    complementoIncapacidadEPS_FONDO = ?
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



/* INSERT COMPLEMENTO INCAPACIDAD EPS - FONDO PENSIONES GRUPO E */
export async function complementoIncapacidadARL(deuda, id_liquidacion){

    console.log("DATOS A ACTUALIZAR EN COMPLEMENTO GRUPO ARL : ", deuda, id_liquidacion)


    try {

        const [result] = await pool.query(
            `
                UPDATE
                    incapacidades_liquidacion
                SET
                    complementoIncapacidadARL = ?
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

