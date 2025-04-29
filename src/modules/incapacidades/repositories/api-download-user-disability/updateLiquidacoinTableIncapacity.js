// src/modules/incapacidades/repositories/incapacidadesRepository.js

import { pool } from "../../../../models/db.js";

export async function updateLiquidacoinTableIncapacity(data) {
    try {
        const updateValues = [
            data.nombres, data.apellidos, data.documento, data.contacto, data.tipo_contrato,
            data.cargo, data.lider, data.fecha_registro_incapacidad, data.tipo_incapacidad, data.subtipo_incapacidad,
            data.fecha_inicio_incapacidad, data.fecha_final_incapacidad, data.cantidad_dias,
            data.codigo_categoria, data.descripcion_categoria, data.codigo_subcategoria, data.descripcion_subcategoria,
            data.prorroga, data.salario_empleado, data.valor_dia_empleado, data.fecha_contratacion, data.estado_incapacidad,
            0, // downloaded
            data.id_incapacidades_historial // para el WHERE
        ];

        const result = await pool.query(
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

        return result;
    } catch (error) {
        console.error("Error al actualizar el historial de incapacidad:", error);
        throw error;
    }
}



/* ESTADO DEL DOWNLOAD  == 1*/
export async function updateDownloadStatus(id_incapacidades_historial) {
    try {
        const result = await pool.query(
            `
                UPDATE incapacidades_liquidacion SET
                    downloaded = 1
                WHERE id_incapacidades_historial = ?
            `,
            [id_incapacidades_historial]
        );

        return result;
    } catch (error) {
        console.error("Error al actualizar el estado de download:", error);
        throw error;
    }
}
