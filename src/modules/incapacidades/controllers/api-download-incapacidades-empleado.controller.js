

import express from 'express';
import { parse, format } from "date-fns";
import { convertirFecha } from '../utils/formatDate/formatDate.js'
import { generarLibroIncapacidadesEmpleado } from '../services/seleccion_empleado/generarLibroIncapacidadesEmpleado.js'

import { DataIncapacidadesEmpleado } from '../repositories/seleccionar-empleado/data-Incapacidades-empleado.js'


const app = express()


export const api_download_libro_incapacidades_empleado = async (req, res) => {

    try {

        /* CAPTURAR LOS DATOS DE LA API FETCH */
        const {
            fecha_inicio,
            fecha_final,
            id_empleado
        } = req.body


        /* FORMATEAMOS LAS FECHAS PARA QUE QUEDEN AAAA/MM/DD */
        const F_inicio = convertirFecha(fecha_inicio);
        const F_final = convertirFecha(fecha_final);


        const workbook = await generarLibroIncapacidadesEmpleado(fecha_inicio, fecha_final, id_empleado);


        /* VALIDACION SIN HAY DATOS */
        if (!workbook) {
            return res.status(404).json({
                ok: false,
                message: "No se encontraron registros de incapacidades.",
            });
        }


        /* Configuras las cabeceras HTTP para indicarle al navegador que la respuesta es un archivo Excel descargable, con nombre sugerido incapacidades_empleado.xlsx. */
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=incapacidades_empleado.xlsx"
        );

        /* Escribes el contenido del archivo Excel directamente en la respuesta HTTP usando el método de la librería ExcelJS (o similar). Luego cierras la conexión con res.end() para que el navegador empiece la descarga. */
        await workbook.xlsx.write(res);
        res.end();



    } catch (error) {
        console.error("Error en api_download_libro_incapacidades_empleado:", error);
        res.status(500).json({
            ok: false,
            message: "Error interno al generar el archivo Excel."
        });
    }
}