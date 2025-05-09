import { pool } from "../../../../models/db.js";

export async function getDataLiquidation(id_incapacidades_liquidacion) {

    try {


        const [rows] = await pool.query(

            ` 
                SELECT * FROM
                    incapacidades_liquidacion
                WHERE
                    id_incapacidades_liquidacion = ?

            `, [id_incapacidades_liquidacion]);



        /* CONFIRMACION SI EL EMPLEADO SE ENCUENTRA */
        if (!rows.length) {
            throw new Error("Incapacidad no encontrada");
        }

        return rows[0]


    } catch (error) {
        console.error("Error en getDataLiquidation:", error);
        throw error;
    }
}







