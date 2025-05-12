//import { pool } from "../../models/db.js";
//import bcrypt from "bcryptjs";

import { datosEmpleadoIncapacidades } from '../repositories/tabla-incapacidades/get_tabla_incapacidades_empleado.js' 
import { formatDate, formatDate2, formatDateTime } from '../utils/formatDate/formatDate.js'

import express from 'express';

const app = express();



export const tablaIncapacidades = async(req, res) =>{

    try {

        const {id_empleado} = req.params

        console.log("ESTE ES EL ID DEL EMPLEADO SELECCIONADO: ", id_empleado)

        /* TRAER DATOS DE LA TABLA LIQUIDACION */
        const datosEmpleadoTablaLiquidacion = await datosEmpleadoIncapacidades(id_empleado)

        console.log("Estos son los datos de la incapacidad del empleado: ", datosEmpleadoTablaLiquidacion)


        /* FORMATO FECHA DE INICIO INCAPCIDAD Y FINAL INCAPACIDAD */
        datosEmpleadoTablaLiquidacion.forEach(obs => {
            obs.fecha_inicio_incapacidad = formatDate2(obs.fecha_inicio_incapacidad)
        })


        /* FORMATO FECHA DE INICIO INCAPCIDAD Y FINAL INCAPACIDAD */
        datosEmpleadoTablaLiquidacion.forEach(obs => {
            obs.fecha_final_incapacidad = formatDate2(obs.fecha_final_incapacidad)
        })

        return res.render('tabla-incapacidades', 
            {
                tabla_incapacidades: datosEmpleadoTablaLiquidacion
            }
        )

    } catch (error) {
          console.error("Error:", error);
        res.status(500).send("Error al cargar la vista");
    }
}