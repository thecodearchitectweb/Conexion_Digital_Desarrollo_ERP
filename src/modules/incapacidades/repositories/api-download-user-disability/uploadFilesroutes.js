import { pool } from '../../../../models/db.js';

/* TRAER LOS DATOS DE LA TABLA RUTA DOCUMENTOS E INSERTARLOS EN files_upload */
export async function uploadFilesroutes(id_historial, id_incapacidades_liquidacion) {
    try {
        // Obtener los documentos relacionados
        const [rows] = await pool.query(
            `
                SELECT 
                    id_ruta_documentos,
                    nombre, 
                    ruta 
                FROM 
                    ruta_documentos 
                WHERE 
                    id_incapacidades_historial = ?`
                , 
                [id_historial]
        );

        if (!rows.length) {
            return [];
        }

        // Preparar los valores para la inserción
        const values = rows.map(row => [row.id_ruta_documentos, row.nombre, row.ruta, id_incapacidades_liquidacion]);

        // Insertar todos los documentos en files_upload
        const [result] = await pool.query(
            `INSERT INTO files_upload (id_ruta_documentos_tabla_historial, nombre, ruta, id_incapacidades_liquidacion) VALUES ?`,
            [values]
        );

        return result;

    } catch (error) {
        console.error("Error al insertar documentos en files_upload:", error);
        throw error;
    }
}
