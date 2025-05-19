import { pool } from "../../../../models/db.js";



/* TRAER LOS DATOS DE INCAPCIDAD VINCULADA CON PRORROGA */
export async function incapacidadProrrogaVinculadaDB(id_liquidacion){

    try {

        const [rows] = await pool.query(
 
            `
                SELECT 
                    id_incapacidad_prorroga
                FROM 
                    prorroga
                WHERE
                    id_incapacidades_liquidacion = ?

            `, [id_liquidacion]
        )
       
        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
         throw error;
    }
}





/* TRAER LOS DATOS DE LA PRORROGA VINCULADA */
export async function ProrrogaVinculadaDB(incapacidadProrrogaVinculada){

    try {

        const [rows] = await pool.query(
 
            `
                SELECT 
                    id_incapacidades_liquidacion,
                    id_empleado,
                    fecha_registro_incapacidad,
                    tipo_incapacidad,
                    subtipo_incapacidad,
                    fecha_inicio_incapacidad,
                    fecha_final_incapacidad,
                    cantidad_dias,
                    dias_liquidables_totales,
                    codigo_categoria,
                    descripcion_categoria,
                    codigo_subcategoria,
                    descripcion_subcategoria,
                    prorroga,
                    dias_liquidacion_empleador,
                    dias_liquidacion_eps,
                    dias_liquidacion_arl,
                    dias_liquidacion_fondo_pensiones,
                    dias_liquidacion_eps_fondo_pensiones,
                    liquidacion_empleador,
                    liquidacion_eps,
                    liquidacion_arl,
                    liquidacion_fondo_pensiones,
                    liquidacion_eps_fondo_pensiones,
                    estado_incapacidad                    
                FROM 
                    incapacidades_liquidacion
                WHERE
                    id_incapacidades_liquidacion = ?

            `, [incapacidadProrrogaVinculada]
        )
       
        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
         throw error;
    }
}



