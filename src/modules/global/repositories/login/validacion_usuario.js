import { pool } from "../../../../models/db.js";


export async function verificarUsuario(usuario){

    try {
        
        const [rows] = await pool.query(
            `
                SELECT * FROM 
                    usuarios
                WHERE
                    usuario = ?
                LIMIT 1
            `, [usuario]
        )

        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        throw error;
    }

}