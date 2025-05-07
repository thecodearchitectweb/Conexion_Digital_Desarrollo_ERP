import { pool } from "../../../../models/db.js";

export async function getUltimasIncapacidades(id_incapacidad_extension) {
    try {
        const [validacionIncapacidadesUser] = await pool.query(
            `
            SELECT 
                fecha_inicio_incapacidad,
                fecha_final_incapacidad
            FROM 
                incapacidades_liquidacion il
            WHERE id_incapacidades_historial = ?              
            `,
            [id_incapacidad_extension]
        );

        console.log("DATOS ENCONTRADOS EN FUNCION PARA TRAER DATOS DE INCAPACIDAD: ",validacionIncapacidadesUser )

        if (validacionIncapacidadesUser.length === 0) {
            console.warn("No se encontraron incapacidades para el empleado: ", validacionIncapacidadesUser);
            return null;
        }

        return validacionIncapacidadesUser[0];
    } catch (error) {
        console.error("Error al obtener incapacidades:", error);
        throw error;
    }
}




/* TRAER LA ULTIMA INCAPACIDAD REGISTRADA DEL EMPLEADO */
export async function getUltimasIncapacidadesIdEmpleado(id_empleado) {
    try {
        const [rows] = await pool.query(
            `
            SELECT 
              fecha_inicio_incapacidad,
              fecha_final_incapacidad
            FROM 
              incapacidades_liquidacion il
            WHERE 
              id_empleado = ? AND downloaded = 1
            ORDER BY 
              fecha_inicio_incapacidad DESC
            LIMIT 1
            `,
            [id_empleado]
          );
          

        console.log("DATOS ENCONTRADOS EN FUNCION PARA TRAER DATOS DE INCAPACIDAD: ",rows )

        if (rows.length === 0) {
            console.warn("No se encontraron incapacidades para el empleado: ", rows);
            return null;
        }

        return rows[0];
    } catch (error) {
        console.error("Error al obtener incapacidades:", error);
        throw error;
    }
}