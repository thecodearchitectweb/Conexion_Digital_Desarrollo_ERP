import { pool } from "../../../models/db.js";
//import bcrypt from "bcryptjs";


import express from 'express';

const app = express();


export const seleccionarEmpleado = async(req, res) =>{
    
    try {

        const [Empleados] = await pool.query(
            `
                SELECT * FROM  empleado;
            `    
        );

        console.log(Empleados); // Aquí se imprimen los resultados de la consulta

        res.render('./views/modulos/incapacidades/seleccionar-empleado.ejs')
        
    } catch (error) {
        console.error(e); // Agrega un console.error para capturar errores
            res.status(500).send('Error en el servidor'); // Manejo básico de errores
    }

    
    
}





