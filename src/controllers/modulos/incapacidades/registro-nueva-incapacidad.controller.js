import { pool } from "../../../models/db.js";
//import bcrypt from "bcryptjs";


import express from 'express';

const app = express();



export const registroNuevaIncapacidad = async(req, res) => {
    try {
        const id_empleado = req.session.id_empleado_consultado;

        if (!id_empleado) {
            console.error("Error: No hay un ID de empleado en la sesión.");
            return res.status(400).send("Error: No se encontró el ID del empleado en la sesión.");
        }

        console.log("ID del empleado consultado:", id_empleado);

        const datos = req.body;

        console.log(datos)



        // Desestructura los datos (opcionalmente, verifica que existan)
        const {
            select_tipo_incapacidad,
            select_detalle_incapacidad_eps_arl,
            input_fecha_inicio_incapacidad,
            input_fecha_final_incapacidad,
            input_cantidad_dias_incapacidad,
            list_codigo_enfermedad_general,
            input_descripcion_diagnostico,
            input_descripcion_categoria,
            input_codigo_categoria,
            select_estado_incapacidad,
            input_toggle_prorroga,
            input_file_incapacidad,
            textarea_observaciones,
        } = datos;




        // Convertir checkbox a SI O NO
        const prorroga = input_toggle_prorroga ? 1 : 0;


        /* INSERTAR DATOS EN LA TABLA HISTORIAL DE INCAPACIDADES */
        const [data_insert_incapacidad] = await pool.query(

            'INSERT INTO incapacidades_historial  (tipo_incapacidad, subtipo_incapacidad, fecha_inicio_incapacidad, fecha_final_incapacidad, cantidad_dias, codigo_categoria, descripcion_categoria,  codigo_subcategoria, descripcion_subcategoria,  prorroga, id_empleado ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [
                select_tipo_incapacidad,
                select_detalle_incapacidad_eps_arl, 
                input_fecha_inicio_incapacidad,
                input_fecha_final_incapacidad,
                input_cantidad_dias_incapacidad,
                input_codigo_categoria,
                input_descripcion_categoria,
                list_codigo_enfermedad_general,
                input_descripcion_diagnostico,
                prorroga,
                id_empleado
                
            ]
        );

        // Obtener el ID de inserción
        const data_insert_incapacidad_ID = data_insert_incapacidad.insertId;

        console.log("ID de la incapacidad insertada:", data_insert_incapacidad_ID);



        /* INSERTAR OBSERVACIONES EN LA TABLA  incapacidades_seguimiento*/
        const [] = await pool.query(
            
            'INSERT INTO incapacidades_seguimiento (estado_incapacidad, observaciones, id_incapacidades_historial) VALUES (?, ?, ?)',
            [
                select_estado_incapacidad,
                textarea_observaciones,
                data_insert_incapacidad_ID
            ]
        );

         // Obtener el ID de inserción
         const data_insert_observaciones_incapacidad_ID = data_insert_incapacidad.insertId;



        res.redirect(`/incapacidad/seleccionar/empleado`);


    } catch (error) {
        console.error("Error al registrar la incapacidad:", error);
        return res.status(500).send("Error interno del servidor.");
    }
};
