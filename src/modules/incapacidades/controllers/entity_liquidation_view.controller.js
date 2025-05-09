import { pool } from "../../../models/db.js";
//import bcrypt from "bcryptjs";
import path from 'path';
import {SessionManager } from "../utils/sessionManager.js"
import { formatDate, formatDate2, formatDateTime } from '../utils/formatDate/formatDate.js';
import { getEmployeeData } from "../repositories/entity-liquidation-view/get_employee_data.js"
import { getDataLiquidation } from "../repositories/entity-liquidation-view/get_liquidation_data.js"




import express from 'express';
import { render } from "ejs";

const app = express();



export const getEntityLiquidationView = async(req, res) => {

    try {

        const { id_liquidacion } = req.params
        console.log("ESTE ES EL ID QUE RECIBE EL CONTROLLER ENTITY LIQUIDATION VIEW", id_liquidacion)


        const incapacidadLiquidada = await getDataLiquidation(id_liquidacion)
        console.log("ESTOS SON TODOS LOS DATOS QUE TRAE EL ID: ", incapacidadLiquidada)

        const id_empleado = incapacidadLiquidada.id_empleado

        const dataEmployee = await  getEmployeeData(id_empleado)
        console.log("ESTOS SON TODOS LOS DATOS DEL EMPLEADO QUE TRAE CON EL ID: ", dataEmployee)


        
        /* FORMATEAMOS FECHAS */
        dataEmployee.fecha_contratacion = formatDate2(dataEmployee.fecha_contratacion);
        incapacidadLiquidada.fecha_inicio_incapacidad = formatDate2(incapacidadLiquidada.fecha_inicio_incapacidad)
        incapacidadLiquidada.fecha_final_incapacidad = formatDate2(incapacidadLiquidada.fecha_final_incapacidad)
        incapacidadLiquidada.fecha_registro = formatDateTime(incapacidadLiquidada.fecha_registro)



        return res.render('entity_liquidation_view',
            {
                datos_empleado: dataEmployee,
                datos_incapacidad_liquidad: incapacidadLiquidada
            }
        )
        
    } catch (error) {
        console.error("Error en getEntityLiquidationView:", error);
        res.status(500).send("Error al cargar la vista de liquidación de incapacidad");
    }
};
