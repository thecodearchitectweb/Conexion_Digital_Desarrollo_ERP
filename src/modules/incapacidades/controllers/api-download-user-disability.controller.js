import { pool } from "../../../models/db.js";
import express from 'express';



const app = express();

export const api_validacion_incapacidad_duplicada = async (req, res) => {

    try{
        
    }catch (error){

    }

};



/*     try {
        const { fecha, id_empleado } = req.body; // <-- Aquí recibís también el ID desde el front

        console.log("📅 Fecha recibida en la API:", fecha);
        console.log("🆔 ID empleado recibido:", id_empleado);

        if (!fecha || !id_empleado) {
            return res.status(400).json({ success: false, message: "Faltan datos obligatorios." });
        }

        // Validar si ya existe una incapacidad con la misma fecha de inicio para ese empleado
        const [validacion_duplicado_incapacidad] = await pool.query(
            `SELECT fecha_inicio_incapacidad FROM incapacidades_historial WHERE id_empleado = ? AND fecha_inicio_incapacidad = ?`,
            [id_empleado, fecha]
        );

        console.log("Esta es la consulta por duplicidad:", validacion_duplicado_incapacidad)


        if (validacion_duplicado_incapacidad.length > 0) {
            return res.status(409).json({"success": true, "duplicado": true, mensaje: "Ya existe una incapacidad registrada para ese mismo día." });
        }

        

        // No hay duplicado
        return res.json({ success: true, duplicado: false });
    } catch (error) {
        console.error("❌ Error al consultar duplicidad:", error);
        return res.status(500).json({ success: false, message: "Error en el servidor" });
    } */

