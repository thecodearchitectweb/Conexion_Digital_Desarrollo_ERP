// src/modules/incapacidades/repositories/incapacidadesRepository.js

import { pool } from "../../../../models/db.js";

export async function getDisabilityDischargeHistory(id_empleado, id_historial) {
    try {
        const [rows] = await pool.query(
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

        if (rows.length === 0) {
            return null;
        }

        return rows[0];
        
    } catch (error) {
        console.error("Error al obtener el historial de incapacidad:", error);
        throw error;
    }
}
