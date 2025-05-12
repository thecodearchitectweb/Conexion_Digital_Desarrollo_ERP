import { pool } from "../../../models/db.js";
import {SessionManager } from "../utils/sessionManager.js"
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatDate, formatDate2, formatDateTime } from '../utils/formatDate/formatDate.js'


import { datosEmpleadoIncapacidades } from '../repositories/tabla-incapacidades/get_tabla_incapacidades_empleado.js' 





import express from 'express';

const app = express();



    export const detalleIncapacidadEmpleado = async(req, res) => {
        try {
            const { id } = req.params;  //  Ahora obtenemos el ID desde req.params


            
        // Guardar el ID del empleado en la sesión usando SessionManager
        await SessionManager.set(req, "id_empleado_consultado", id);
        console.log("Antes de guardar sesión, id_empleado_consultado:", await SessionManager.get(req, "id_empleado_consultado"));

        // Forzar el guardado de la sesión
        await SessionManager.save(req);



        // Obtener el ID desde la sesión (Ejemplo de cómo se usa en otro momento)
        const idEmpleadoGuardado = SessionManager.get(req, "id_empleado_consultado");
        console.log("ID de empleado consultado guardado en sesión:", idEmpleadoGuardado);
    


            if (!id) {
                return res.status(400).send('Error: ID de empleado no proporcionado');
            }
    
            console.log("ID del empleado recibido:", id);
    
            const [datos_empleado] = await pool.query(
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

                `, [id]);

                

            if (!datos_empleado.length) {
                return res.status(404).send('Empleado no encontrado');
            }

            let empleado = datos_empleado[0];



            // Formatear la fecha de contratación
            empleado.fecha_contratacion = empleado.fecha_contratacion 
            ? format(new Date(empleado.fecha_contratacion), "dd 'de' MMMM 'de' yyyy", { locale: es }) 
            : "Fecha no disponible";





            /* TRAER DATOS DE LA TABLA LIQUIDACION */
            const datosEmpleadoTablaLiquidacion = await datosEmpleadoIncapacidades(id)
                


            // Si no hay historial de incapacidades, podemos enviar un mensaje o simplemente mostrar un arreglo vacío
            if (!datosEmpleadoTablaLiquidacion.length) {
                console.log("No se encontraron incapacidades para este empleado.");
            }

            

            /* FORMATO FECHA DE INICIO INCAPCIDAD Y FINAL INCAPACIDAD */
            datosEmpleadoTablaLiquidacion.forEach(obs => {
                obs.fecha_inicio_incapacidad = formatDate2(obs.fecha_inicio_incapacidad)
            })
    
    
            /* FORMATO FECHA DE INICIO INCAPCIDAD Y FINAL INCAPACIDAD */
            datosEmpleadoTablaLiquidacion.forEach(obs => {
                obs.fecha_final_incapacidad = formatDate2(obs.fecha_final_incapacidad)
            })


            // Renderizar vista
            return res.render('detalle-incapacidad', {
                id,
                datos_empleado: empleado,   // Enviar solo el primer resultado del empleado
                tabla_incapacidades: datosEmpleadoTablaLiquidacion
            });

    
        } catch (error) {
            console.error('Error al obtener detalle de incapacidad:', error);
            return res.status(500).send('Error interno del servidor');
        }
    };



   