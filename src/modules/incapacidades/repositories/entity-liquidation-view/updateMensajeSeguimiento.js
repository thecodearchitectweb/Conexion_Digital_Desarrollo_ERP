import { pool } from "../../../../models/db.js";

export async function updateMensajeSeguimiento(id_incapacidades_liquidacion) {
    try {
        if (!id_incapacidades_liquidacion) {
            throw new Error("ID de incapacidad no proporcionado");
        }

        const estado = "SISTEMATIZADA";
        const observacion = "Se ha registrado la incapacidad satisfactoriamente";

        // Consultamos si ya existe un seguimiento con estado SISTEMATIZADA para esta liquidación
        const [rows] = await pool.query(
            `
                SELECT 
                    estado
                FROM 
                    seguimiento_incapacidad_liquidada
                WHERE 
                    id_incapacidades_liquidacion = ?
                AND 
                    estado = ?
            `,
            [id_incapacidades_liquidacion, estado]
        );

        // Si ya existe un registro con ese estado, no insertamos nada
        if (rows.length > 0) {
            return { message: "Ya se ha registrado la observación 'SISTEMATIZADA' previamente." };
        }

        // Si no existe, insertamos el mensaje
        const [result] = await pool.query(
            `
                INSERT INTO seguimiento_incapacidad_liquidada (
                    estado,
                    observaciones,
                    id_incapacidades_liquidacion
                ) VALUES (?, ?, ?)
            `,
            [estado, observacion, id_incapacidades_liquidacion]
        );

        return result;

    } catch (error) {
        console.error("Error en updateMensajeSeguimiento:", error);
        throw error;
    }
}
