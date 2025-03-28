import { pool } from "../../../models/db.js";

//import bcrypt from "bcryptjs";


import express from 'express';

const app = express();


export const codigo_enfermedad_general_cie_10 = async(req, res) => {
    try {
        const { codigo } = req.params;

        if (!codigo) {
            return res.status(400).json({ success: false, message: "Código no proporcionado" });
        }

        // ✅ Consulta SQL corregida
        const [datos_cie_10] = await pool.query(
            `SELECT codigo_categoria, descripcion_categoria, codigo_subcategoria, descripcion_subcategoria
             FROM cie_10
             WHERE codigo_subcategoria = ?`, 
            [codigo] 
        );

        console.log(datos_cie_10)

        // ✅ Validación corregida
        if (datos_cie_10.length > 0) {
            return res.json({ success: true, ...datos_cie_10[0] });
        } else {
            return res.json({ success: false, message: "Código no encontrado" });
        }

    } catch (error) {
        console.error("Error al consultar CIE-10:", error);
        return res.status(500).json({ success: false, message: "Error en el servidor" });
    }
}

