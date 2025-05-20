import { pool } from "../../../../models/db.js";

export async function LIMPIAR_BLOQUEO_USUARIO(id_user, now) {
    try {
        const [result] = await pool.query(
            `
                UPDATE
                    usuarios
                SET
                    login_attempts = 0, 
                    lock_until = NULL, 
                    updated_at = NOW()
                WHERE
                    id = ?
            `, [id_user]
        )
        return result.affectedRows > 0;

    } catch (error) {
        throw error;

    }
}