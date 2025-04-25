import { pool } from "../../../models/db.js";
import express from 'express';

const app = express();

export const api_download_user_disability = async (req, res) => {
    try {
        const { id_liquidacion, id_historial } = req.params;

        console.log(id_liquidacion, id_historial)


        /* TRAER ID DEL EMPLEADO */
        const [rows] = await pool.query(`
            SELECT id_empleado
            FROM incapacidades_historial
            WHERE id_incapacidades_historial = ?
        `, [id_historial]);
        
        const id_empleado = rows[0]?.id_empleado;
        



        if (!id_liquidacion || !id_historial  || !id_empleado) {
            return res.status(400).json({ message: "Faltan parámetros en la solicitud." });
        }


        const [disabilityDischargeHistory] = await pool.query(
            `SELECT 
                e.nombres, 
                e.apellidos, 
                e.documento, 
                e.contacto, 
                e.tipo_contrato, 
                e.cargo, 
                e.lider, 
                e.salario AS salario_empleado, 
                e.valor_dia AS valor_dia_empleado, 
                e.fecha_contratacion,
                ih.fecha_registro AS fecha_registro_incapacidad, 
                ih.tipo_incapacidad, 
                ih.subtipo_incapacidad,
                ih.fecha_inicio_incapacidad, 
                ih.fecha_final_incapacidad, 
                ih.cantidad_dias,
                ih.codigo_categoria, 
                ih.descripcion_categoria, 
                ih.codigo_subcategoria, 
                ih.descripcion_subcategoria,
                ih.prorroga, 
                ih.id_incapacidades_historial,
                iseg.estado_incapacidad, 
                iseg.observaciones
            FROM incapacidades_historial ih
            INNER JOIN empleado e ON ih.id_empleado = e.id_empleado
            LEFT JOIN (
                SELECT is1.*
                FROM incapacidades_seguimiento is1
                INNER JOIN (
                    SELECT id_incapacidades_historial, MAX(fecha_registro) AS max_fecha
                    FROM incapacidades_seguimiento
                    GROUP BY id_incapacidades_historial
                ) is2 ON is1.id_incapacidades_historial = is2.id_incapacidades_historial
                    AND is1.fecha_registro = is2.max_fecha
            ) iseg ON ih.id_incapacidades_historial = iseg.id_incapacidades_historial
            WHERE ih.id_empleado = ? AND ih.id_incapacidades_historial = ?`,
            [id_empleado, id_historial] 
        );


        if (!disabilityDischargeHistory.length) {
            return res.status(404).json({ message: "No se encontró la incapacidad con los datos proporcionados." });
        }


        const data = disabilityDischargeHistory[0];
        console.log("🧾 Datos encontrados:", data);


        /* ACTUALIZA LA INFORMACION A LA MAS ACTUAL */
        if (disabilityDischargeHistory.length) {

            const updateValues = [
                data.nombres, data.apellidos, data.documento, data.contacto, data.tipo_contrato,
                data.cargo, data.lider, data.fecha_registro_incapacidad, data.tipo_incapacidad, data.subtipo_incapacidad,
                data.fecha_inicio_incapacidad, data.fecha_final_incapacidad, data.cantidad_dias,
                data.codigo_categoria, data.descripcion_categoria, data.codigo_subcategoria, data.descripcion_subcategoria,
                data.prorroga, data.salario_empleado, data.valor_dia_empleado, data.fecha_contratacion, data.estado_incapacidad,
                1, // downloaded
                data.id_incapacidades_historial // para el WHERE
            ];

            await pool.query(
                `UPDATE incapacidades_liquidacion SET
                    nombres = ?, apellidos = ?, documento = ?, contacto = ?, tipo_contrato = ?,
                    cargo = ?, lider = ?, fecha_registro_incapacidad = ?, tipo_incapacidad = ?, subtipo_incapacidad = ?,
                    fecha_inicio_incapacidad = ?, fecha_final_incapacidad = ?, cantidad_dias = ?,
                    codigo_categoria = ?, descripcion_categoria = ?, codigo_subcategoria = ?, descripcion_subcategoria = ?,
                    prorroga = ?, salario_empleado = ?, valor_dia_empleado = ?, fecha_contratacion = ?, estado_incapacidad = ?,
                    downloaded = ?
                WHERE id_incapacidades_historial = ?`,
                updateValues
            );
        }




        return res.json({
            ok: true,
            message: "Incapacidad actualizada correctamente",
        });

    } catch (error) {
        console.error("🔥 Error en la API de liquidación:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};
