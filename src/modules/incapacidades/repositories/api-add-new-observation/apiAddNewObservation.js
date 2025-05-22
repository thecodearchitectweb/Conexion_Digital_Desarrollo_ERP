import { pool } from "../../../../models/db.js";

// ✅ Función para agregar una nueva observación a la tabla seguimiento_incapacidad_liquidada
export async function addNewObservation(user, codigoLiquidacion, estadoIncapacidad, observacion) {
    try {



        // ✅ Verificar que los campos no estén vacíos
        if (!codigoLiquidacion || !estadoIncapacidad || !observacion) {
            return {
                success: false,
                message: "Todos los campos son obligatorios."
            };
        }
        


        // ✅ Insertar la nueva observación en la base de datos
        const [result] = await pool.query(
            `
            INSERT INTO seguimiento_incapacidad_liquidada (
                id_user,
                estado,
                observaciones,
                id_incapacidades_liquidacion
            ) VALUES (?, ?, ?, ?)
            `,
            [user, estadoIncapacidad, observacion, codigoLiquidacion]
        );


        // ✅ Verificar si la inserción fue exitosa
        if (result.affectedRows > 0) {
            return {
                success: true,
                message: "Observación agregada correctamente."
            };
        } else {
            return {
                success: false,
                message: "No se pudo agregar la observación."
            };
        }

    } catch (error) {
        console.error("🚨 Error en la consulta:", error);
        // ✅ Retornar un mensaje de error controlado
        return {
            success: false,
            message: "Error al agregar la observación. Intenta de nuevo más tarde."
        };
    }
}
