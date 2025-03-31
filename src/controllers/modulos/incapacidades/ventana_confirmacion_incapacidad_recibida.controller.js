import { pool } from "../../../models/db.js";
//import bcrypt from "bcryptjs";


import express from 'express';

const app = express();


export const incapacidadRecibida = async(req, res) =>{

    try {

        /* ID GUARDADOS EN SESSION, PARA LLAMAR A LAS BASES DE DATOS MAS FACILMENTE */
        const id_empleado = req.session.id_empleado_consultado;
        const id_incapacidad_recibida = req.session.id_incapacidad_registrada;

        console.log("ID incapacidad recibida", id_incapacidad_recibida)

        /* CONFIRMACION DE ID EMPLEADO */
        if (!id_empleado) {
            console.error("Error: No hay un ID de empleado en la sesión.");
            return res.status(400).send("Error: No se encontró el ID del empleado en la sesión.");
        }

        console.log("ID del empleado consultado:", id_empleado);


        /* CONFIRMACION DE ID HISTORIAL INCAPACIDAD */
        if (!id_incapacidad_recibida) {
            console.error("Error: No hay un ID de historial empleado");
            return res.status(400).send("Error: No se encontró el ID del historial empleado en la sesión.");
        }

        console.log("ID HISTORIAL INCAPACIDAD del empleado consultado:", id_incapacidad_recibida);




        /* CONSULTA EN BASES DE DATOS, PARA CONFIRMAR DATOS INGRESADOS DE LA INCAPACIDAD */
        const[datos_empleado] = await pool.query(

            ` 
                SELECT 
                    e.id_empleado,
                    e.nombres,
                    e.apellidos,
                    e.documento,
                    e.contacto,
                    e.area,
                    e.fecha_contratacion,
                    e.tipo_contrato,
                    e.cargo,
                    e.estado,
                    e.lider,
                    e.salario,
                    e.valor_dia,

                    emp.id_empresa,
                    emp.nombre AS empresa_nombre,
                    emp.nit AS empresa_nit,

                    ss.id_seguridad_social,
                    ss.eps,
                    ss.arl,
                    ss.fondo_pension,
                    ss.caja_compensacion
                FROM empleado e

                
                LEFT JOIN empresas emp 
                    ON e.id_empleado = emp.id_empleado
                    AND emp.fecha_actualizacion = (
                        SELECT MAX(fecha_actualizacion) 
                        FROM empresas 
                        WHERE id_empleado = e.id_empleado
                    )

                
                LEFT JOIN seguridad_social ss 
                    ON e.id_empleado = ss.id_empleado
                    AND ss.fecha_actualizacion = (
                        SELECT MAX(fecha_actualizacion) 
                        FROM seguridad_social 
                        WHERE id_empleado = e.id_empleado
                    )

                WHERE e.id_empleado = ?;

            `, [id_empleado]);


            /* SI EL  */
            if (!datos_empleado.length) {
                return res.status(404).send('Empleado no encontrado');
            }

            console.log(datos_empleado)





        /* CONSULTA INCAPACIDAD HISTORIAL SEGUMIENTO */

        const [datos_incapacidad_confirmacion] = await pool.query(

            `
                SELECT * FROM incapacidades_historial 
                WHERE id_incapacidades_historial = ?;

            `, [id_incapacidad_recibida]

        );


            
            console.log(datos_incapacidad_confirmacion)


            if (!datos_incapacidad_confirmacion.length) {
                return res.status(404).send('No se encontro historial de incapacidades del empleado');
            }


            let empleado = datos_empleado[0];






            // 🔹 Formatear salario y valor_dia con separadores de miles
            const formatoMoneda = new Intl.NumberFormat('es-CO'); // Para formato colombiano
            empleado.salario = formatoMoneda.format(empleado.salario);
            empleado.valor_dia = formatoMoneda.format(empleado.valor_dia);





            /* ELIMINAR ID DE LA SESSION, LUEGO DE UTILIZARLA */
            console.log("Session antes de borrar:", req.session);

            if (req.session) {
                if (req.session.id_empleado_consultado) {
                    console.log("Borrando id_empleado_consultado:", req.session.id_empleado_consultado);
                    delete req.session.id_empleado_consultado;
                }
                if (req.session.id_incapacidad_registrada) {
                    console.log("Borrando id_incapacidad_registrada:", req.session.id_incapacidad_registrada);
                    delete req.session.id_incapacidad_registrada;
                }
            }
            console.log("Session después de borrar:", req.session);
            



            /* RENDERIZAR VISTA CON LOS DATOS */
            return res.render('./views/modulos/incapacidades/ventana_confirmacion_incapacidad_recibida.ejs',
                {
                    datos_empleado: empleado,   // Enviar solo el primer resultado 
                    datos_incapacidad_confirmacion: datos_incapacidad_confirmacion   // Enviar solo el primer resultado 
                }
            )
        
    } catch (error) {
        console.error('Error al obtener detalle de incapacidad:', error);
        return res.status(500).send('Error interno del servidor');
    }

   
}


