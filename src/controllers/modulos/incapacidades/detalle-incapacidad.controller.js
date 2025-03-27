import { pool } from "../../../models/db.js";

//import bcrypt from "bcryptjs";


import express from 'express';

const app = express();



    export const detalleIncapacidadEmpleado = async(req, res) => {
        try {
            const { id } = req.params;  //  Ahora obtenemos el ID desde req.params
    
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

                // 🔹 Formatear salario y valor_dia con separadores de miles
                const formatoMoneda = new Intl.NumberFormat('es-CO'); // Para formato colombiano
                empleado.salario = formatoMoneda.format(empleado.salario);
                empleado.valor_dia = formatoMoneda.format(empleado.valor_dia);


            return res.render('./views/modulos/incapacidades/detalle-incapacidad.ejs', 
                { 
                    id, 
                    datos_empleado: empleado   // Enviar solo el primer resultado 
                });
    
        } catch (error) {
            console.error('Error al obtener detalle de incapacidad:', error);
            return res.status(500).send('Error interno del servidor');
        }
    };



   