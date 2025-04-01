import { pool } from "../../../models/db.js";
//import bcrypt from "bcryptjs";


import express from 'express';

const app = express();


    export const getseleccionarEmpleado = (req, res) => {
        try {

            return res.render("./views/modulos/incapacidades/seleccionar-empleado.ejs", { Empleados: [] });

        } catch (error) {
            console.error("Error al renderizar la vista:", error);
            res.status(500).send("Error en el servidor");
        }
    }


    export const postseleccionarEmpleado = async (req, res) => {
        try {
            const { filtro, busqueda } = req.body;
    
            console.log("Filtro recibido:", filtro);
            console.log("Búsqueda recibida:", busqueda);
    
            // Validar que ambos valores existan
            if (!filtro || !busqueda) {
                return res.status(400).send("Faltan datos en la solicitud.");
            }
    
            // Mapeo del filtro a la columna correspondiente en la BD
            const filtroColumnas = {
                cedula: "e.documento",
                contacto: "e.contacto",
                nombres: "e.nombres",
                apellidos: "e.apellidos",
            };
    
            // Verifica que el filtro sea válido
            if (!filtroColumnas[filtro]) {
                return res.status(400).send("Filtro no válido.");
            }
    
            // Ejecutar la consulta con el valor de búsqueda
            const [filtroEmpleados] = await pool.query(
                `
                SELECT DISTINCT
                    e.id_empleado,
                    e.nombres,
                    e.apellidos,
                    e.documento,
                    e.contacto,
                    e.area,
                    e.cargo,
                    e.estado,
                    e.lider,
                    ss.eps
                FROM empleado e
                LEFT JOIN seguridad_social ss ON e.id_empleado = ss.id_empleado
                WHERE ${filtroColumnas[filtro]} ${filtro === "nombres" || filtro === "apellidos" ? "LIKE ?" : "= ?"};      /* Filtra la búsqueda basándose en el filtro seleccionado (ej: nombres, apellidos, documento, etc.) */
                `,
                [filtro === "nombres" || filtro === "apellidos" ? `%${busqueda}%` : busqueda]   /* Si el filtro es nombres o apellidos, usa LIKE (búsqueda parcial), de lo contrario usa "=" (búsqueda exacta) */
            );
    
            console.log("Resultados de la consulta:", filtroEmpleados);
    
            // Enviar los datos a la vista
            return res.render("./views/modulos/incapacidades/seleccionar-empleado.ejs", 
                { 
                    Empleados: filtroEmpleados 
                });
           
        } catch (error) {
            console.error("Error en postseleccionarEmpleado:", error);
            return res.status(500).send("Error en el servidor: " + error.message);
        }
    };








