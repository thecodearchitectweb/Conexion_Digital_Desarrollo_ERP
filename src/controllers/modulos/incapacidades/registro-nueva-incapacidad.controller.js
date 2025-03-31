import { pool } from "../../../models/db.js";
//import bcrypt from "bcryptjs";
import path from 'path';


import express from 'express';

const app = express();



export const registroNuevaIncapacidad = async(req, res) => {
    try {

        /* ID GUARDADO EN LA SESSION DESDE DETALLE INCAPACIDAD CONTROLLER */
        const id_empleado = req.session.id_empleado_consultado;

        if (!id_empleado) {
            console.error("Error: No hay un ID de empleado en la sesión.");
            return res.status(400).send("Error: No se encontró el ID del empleado en la sesión.");
        }

        console.log("registro nueva incapacidad controller - ID del empleado consultado:", id_empleado);

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

        req.session.id_incapacidad_registrada = data_insert_incapacidad_ID;

        /* req.session.id_incapacidad_registrada = data_insert_incapacidad.insertId;
 */

        console.log("registro nueva incapacidad controller - ID de la incapacidad insertada:", data_insert_incapacidad_ID);



        /* INSERTAR OBSERVACIONES EN LA TABLA  incapacidades_seguimiento*/
        const [data_insert_seguimiento_incapacidad] = await pool.query(
            
            'INSERT INTO incapacidades_seguimiento (estado_incapacidad, observaciones, id_incapacidades_historial) VALUES (?, ?, ?)',
            [
                select_estado_incapacidad,
                textarea_observaciones,
                data_insert_incapacidad_ID
            ]
        );

         // Obtener el ID de inserción
         const data_insert_observaciones_incapacidad_ID = data_insert_seguimiento_incapacidad.insertId;
         console.log("registro nueva incapacidad controller - ID de la observacion insertada - incapacidad insertada:", data_insert_observaciones_incapacidad_ID);



            // Verificar si hay archivos en la solicitud
/*             if (req.files) {
                for (const campo in req.files) {
                    for (const file of req.files[campo]) {
                        // Obtener la ruta relativa del archivo
                        const rutaRelativa = path.join(file.destination.replace(path.join(process.cwd(), 'upload'), ''), file.filename);


                        // Insertar en la base de datos
                        const [data_insert_ruta] = await pool.query(
                            'INSERT INTO ruta_documentos (nombre, ruta, id_incapacidades_historial) VALUES (?, ?, ?)',
                            [campo, rutaRelativa, data_insert_incapacidad_ID]
                        );


                        // Obtener el ID de inserción y mostrarlo en consola
                        const data_insert_ruta_ID = data_insert_ruta.insertId;
                        console.log("Registro nueva incapacidad controller - ID de la ruta insertada:", data_insert_ruta_ID);
                    }
                }
            } */

                
                // Verificar si hay archivos en la solicitud
                if (req.files) {
                    // Inicializamos un arreglo para almacenar los IDs de cada ruta insertada
                    let rutasIds = [];
                    
                    for (const campo in req.files) {
                        for (const file of req.files[campo]) {
                            // Obtener la ruta relativa del archivo
                            const rutaRelativa = path.join(
                                file.destination.replace(path.join(process.cwd(), 'upload'), ''),
                                file.filename
                            );

                            // Insertar en la base de datos
                            const [data_insert_ruta] = await pool.query(
                                'INSERT INTO ruta_documentos (nombre, ruta, id_incapacidades_historial) VALUES (?, ?, ?)',
                                [campo, rutaRelativa, data_insert_incapacidad_ID]
                            );

                            // Obtener el ID de inserción y agregarlo al arreglo
                            const data_insert_ruta_ID = data_insert_ruta.insertId;
                            rutasIds.push(data_insert_ruta_ID);
                            console.log("Registro nueva incapacidad controller - ID de la ruta insertada:", data_insert_ruta_ID);
                        }
                    }
                    
                    // Guardamos el arreglo de IDs en la sesión
                    req.session.ids_rutas_documentos = rutasIds;
                }



            

           





        return res.redirect(`/incapacidad/confirmacion/incapacidad/recibida/${id_empleado}`);



    } catch (error) {
        console.error("Error al registrar la incapacidad:", error);
        return res.status(500).send("Error interno del servidor.");
    }
};
