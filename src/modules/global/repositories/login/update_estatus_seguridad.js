import { pool } from "../../../../models/db.js";


export async function UPDATE_LOGIN_ATTEMPTS_QUERY(attempts, lock_until, id_user){

    try {
        const [result] = await pool.query(
            `
                UPDATE 
                    usuarios 
                SET 
                    login_attempts = ?, 
                    lock_until = ? 
                WHERE id = ?
            `, [attempts, lock_until, id_user]
        )

        return result.affectedRows > 0;

    } catch (error) {
        throw error;
    }
}