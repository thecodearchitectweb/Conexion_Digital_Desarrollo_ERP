import { pool } from '../../../../models/db.js';


export async function datosEmpleadoIncapacidades(id_empleado){

    try {
        
            /* CONSULTA DATOS */
        const [rows] = await pool.query(
            `
                SELECT 
                    nombres,
                    apellidos,
                    id_incapacidades_liquidacion,
                    id_empleado,
                    documento,
                    tipo_incapacidad,
                    subtipo_incapacidad,
                    fecha_inicio_incapacidad,
                    fecha_final_incapacidad,
                    cantidad_dias,
                    codigo_categoria,
                    codigo_subcategoria,
                    prorroga,
                    dias_liquidacion_empleador,
                    porcentaje_liquidacion_empleador,
                    liquidacion_empleador,
                    dias_liquidacion_eps,
                    porcentaje_liquidacion_eps,
                    liquidacion_eps,
                    dias_liquidacion_arl,
                    porcentaje_liquidacion_arl,
                    liquidacion_arl,
                    dias_liquidacion_fondo_pensiones,
                    porcentaje_liquidacion_fondo_pensiones,
                    liquidacion_fondo_pensiones,
                    dias_liquidacion_eps_fondo_pensiones,
                    porcentaje_liquidacion_eps_fondo_pensiones,
                    liquidacion_eps_fondo_pensiones,
                    estado_incapacidad
                FROM
                    incapacidades_liquidacion
                WHERE
                    id_empleado = ?
                AND
                    downloaded = 1
                ORDER BY 
                    fecha_inicio_incapacidad DESC

            `, [id_empleado]
        )

        if (!rows.length) {
            return []; // O lanza un error si prefieres forzar el fallo
        }
        
        console.log("ESTAS SON LAS INCAPACIDADES DEL EMPLEADO, TABLA INCAPACIDADES: ", rows)

        return rows

    } catch (error) {
        console.error("Error al obtener datos del empleado:", error);
        throw error;
    }
}