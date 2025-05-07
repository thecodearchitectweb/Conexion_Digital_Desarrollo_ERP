import { pool } from "../../../models/db.js";
import express from 'express';

const app = express();

export const api_select_disability_date = async (req, res) => {
    try {
        const { id_empleado } = req.params;

        const [rows] = await pool.query(
            `
                SELECT 
                    id_incapacidades_liquidacion AS id,
                    fecha_inicio_incapacidad AS fecha_inicio,
                    fecha_final_incapacidad AS fecha_final
                FROM
                    incapacidades_liquidacion
                WHERE
                    id_empleado = ?
                ORDER BY fecha_inicio_incapacidad DESC
                LIMIT 5
            `,
            [id_empleado]
        );

        console.log("DATOS PARA API SELECT DISABILITY DATE", rows)

        res.json({
            success: true,
            fechas: rows
        });

    } catch (error) {
        console.error("Error en API fechas:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener fechas de incapacidades"
        });
    }
};
