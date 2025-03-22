//import { pool } from "../../models/db.js";
//import bcrypt from "bcryptjs";


import express from 'express';

const app = express();


/* export const detalleIncapacidadEmpleado = (req, res) => {

    try {
        const { id_empleado } = req.body;

        console.log(id_empleado)

        res.render('./views/modulos/incapacidades/detalle-incapacidad.ejs')

    } catch (error) {
        console.error('Error al obtener detalle de incapacidad:', error);
        res.status(500).send('Error interno del servidor');
    }


} */


    export const detalleIncapacidadEmpleado = (req, res) => {
        try {
            const { id } = req.params;  //  Ahora obtenemos el ID desde req.params
    
            if (!id) {
                return res.status(400).send('Error: ID de empleado no proporcionado');
            }
    
            console.log("ID del empleado recibido:", id);
    
            return res.render('./views/modulos/incapacidades/detalle-incapacidad.ejs', { id });
    
        } catch (error) {
            console.error('Error al obtener detalle de incapacidad:', error);
            return res.status(500).send('Error interno del servidor');
        }
    };
    
    