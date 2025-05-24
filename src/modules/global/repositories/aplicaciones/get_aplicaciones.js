
import { pool } from "../../../../models/db.js";


export async function getDataAplicaciones() {

    try {

        const [rows] = await pool.query(
            `
                SELECT * FROM
                    aplicativos
            `
        )

        return rows.length > 0 ? rows : null;

    } catch (error) {
        throw error;
    }
}