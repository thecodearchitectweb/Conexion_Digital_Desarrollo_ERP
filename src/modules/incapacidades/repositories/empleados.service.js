import { pool } from "../../../models/db.js";


/* CONSULTA DOCUMENTO DEL EMPLEADO POR MEDIO DEL ID */

export async function getEmpleadoById(idEmpleado) {
    const [rows] = await pool.query(
      'SELECT * FROM empleado WHERE id_empleado = ?',
      [idEmpleado]
    );
    return rows.length > 0 ? rows[0] : null;
  }
  