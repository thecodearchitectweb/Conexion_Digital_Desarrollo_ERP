import { pool } from "../../../models/db.js";
import {SessionManager } from "../../../utils/modulos/incapacidades/sessionManager.js"
import { format } from "date-fns";
import { es } from "date-fns/locale";




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



                
               // Consulta de historial de incapacidades (Ahora traemos todas las incapacidades del empleado)
            const [datos_historial_incapacidades] = await pool.query(
                `
                SELECT 
                    e.documento,
                    ih.fecha_registro,
                    ih.fecha_inicio_incapacidad AS inicio_incapacidad,
                    ih.fecha_final_incapacidad AS final_incapacidad,
                    ih.cantidad_dias AS dias_incapacidad,
                    ih.descripcion_categoria AS categoria,
                    ih.descripcion_subcategoria AS subcategoria,
                    ih.descripcion_subcategoria AS desc_subcategoria,
                    ih.prorroga,
                    e.estado AS estado
                FROM 
                    incapacidades_historial ih
                JOIN 
                    empleado e ON ih.id_empleado = e.id_empleado
                WHERE
                    ih.id_empleado = ?;  -- Traemos todas las incapacidades del empleado
                `, [id]
            );

            console.log("Este es el historial de las incapacidades del usuario: ", datos_historial_incapacidades);



            // Formatear las fechas de cada registro
            datos_historial_incapacidades.forEach(record => {
                record.fecha_registro = record.fecha_registro 
                    ? format(new Date(record.fecha_registro), "dd 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: es }) 
                    : "Fecha no disponible";

                record.inicio_incapacidad = record.inicio_incapacidad 
                    ? format(new Date(record.inicio_incapacidad), "dd 'de' MMMM 'de' yyyy", { locale: es }) 
                    : "Fecha no disponible";

                record.final_incapacidad = record.final_incapacidad 
                    ? format(new Date(record.final_incapacidad), "dd 'de' MMMM 'de' yyyy", { locale: es }) 
                    : "Fecha no disponible";
            });

            
            console.log("Historial fechas formateado:", datos_historial_incapacidades);




            // Si no hay historial de incapacidades, podemos enviar un mensaje o simplemente mostrar un arreglo vacío
            if (!datos_historial_incapacidades.length) {
                console.log("No se encontraron incapacidades para este empleado.");
            }

            

            // Formatear salario y valor_dia con separadores de miles
            const formatoMoneda = new Intl.NumberFormat('es-CO');
            empleado.salario = formatoMoneda.format(empleado.salario);
            empleado.valor_dia = formatoMoneda.format(empleado.valor_dia);

            // Renderizar vista
            return res.render('./views/modulos/incapacidades/detalle-incapacidad.ejs', {
                id,
                datos_empleado: empleado,   // Enviar solo el primer resultado del empleado
                datos_historial_incapacidades // Se envían todas las incapacidades de ese empleado
            });

    
        } catch (error) {
            console.error('Error al obtener detalle de incapacidad:', error);
            return res.status(500).send('Error interno del servidor');
        }
    };



   