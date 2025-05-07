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
                    id_empleado = ? AND downloaded = 1
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



export const api_select_disability_extension = async (req, res) => {
    try {
      const { id_incapacidad } = req.params;
  
      const [rows] = await pool.query(
        `
          SELECT
            tipo_incapacidad,
            subtipo_incapacidad,
            fecha_inicio_incapacidad,
            fecha_final_incapacidad,
            cantidad_dias,
            codigo_categoria,
            descripcion_categoria,
            codigo_subcategoria,
            descripcion_subcategoria,
            prorroga
          FROM
            incapacidades_liquidacion
          WHERE
            id_incapacidades_liquidacion = ?
        `,
        [id_incapacidad]
      );
  
      console.log("DATOS PARA API SELECT DISABILITY EXTENSION", rows);
  
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No se encontró ninguna incapacidad con ese ID."
        });
      }
  
      res.json({
        success: true,
        data: rows[0],
      });
  
    } catch (error) {
      console.error("Error en API SELECT DISABILITY EXTENSION:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener datos de la incapacidad."
      });
    }
  };
  