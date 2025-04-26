import { pool } from "../../../../models/db.js";

export async function getUltimasIncapacidades(id_empleado) {
    try {
        const [validacionIncapacidadesUser] = await pool.query(
            `
            SELECT 
                il.id_incapacidades_liquidacion,
                il.id_incapacidades_historial,
                il.documento,
                il.fecha_registro_incapacidad,
                il.tipo_incapacidad,
                il.subtipo_incapacidad,
                il.codigo_categoria,
                il.descripcion_categoria,
                il.codigo_subcategoria,
                il.descripcion_subcategoria,
                il.cantidad_dias,
                il.prorroga,
                il.fecha_inicio_incapacidad,
                il.fecha_final_incapacidad
            FROM incapacidades_liquidacion il
            INNER JOIN incapacidades_historial ih 
                ON il.id_incapacidades_historial = ih.id_incapacidades_historial
            WHERE ih.id_empleado = ?
            ORDER BY il.fecha_registro_incapacidad DESC
            LIMIT 1
            `,
            [id_empleado]
        );

        if (validacionIncapacidadesUser.length === 0) {
            console.warn("No se encontraron incapacidades para el empleado: ", id_empleado);
            return null;
        }

        return validacionIncapacidadesUser[0];
    } catch (error) {
        console.error("Error al obtener incapacidades:", error);
        throw error;
    }
}
