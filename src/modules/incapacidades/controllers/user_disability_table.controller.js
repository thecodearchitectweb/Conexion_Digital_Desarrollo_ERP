import { pool } from "../../../models/db.js";
//import bcrypt from "bcryptjs";


import express from 'express';

const app = express();


export const UserDisabilityTable = async(req, res) =>{


    const { id_empleado, id_incapacidad } = req.params;
    console.log(id_empleado, id_incapacidad);



    /* CONSULTA SI LA  INCAPACIDAD YA FUE DESCAGGADA EN INCAPACIDAD HISTORIAL  */
    const [disabilityDischargeHistory] = await pool.query (
        `
            SELECT 
                downloaded
            FROM 
                incapacidades_liquidacion
            WHERE
                id_incapacidades_historial = ?;
        `, [id_incapacidad]
    ) 

    console.log("Incapacidad descargada HISTORIAL", disabilityDischargeHistory)



    
    /* CONSULTA SI LA  INCAPACIDAD YA FUE DESCAGGADA EN INCAPOACIDAD LIQUIDACION*/
    const [disabilityDischargeSettlement] = await pool.query (
        `
            SELECT 
                downloaded
            FROM 
                incapacidades_liquidacion
            WHERE
                id_incapacidades_historial = ?;
        `, [id_incapacidad]
    ) 

    console.log("Incapacidad descargada LIQUIDACION", disabilityDischarge)




    /* TRAE LOS DATOS COMPLETOS A LA TABLA DE LAS INCAPACIDADES DESCARGADAS*/
/*     const [] = await pool.query(
        `

        `
    )    
 */

    return res.render('user_disability_table')
}