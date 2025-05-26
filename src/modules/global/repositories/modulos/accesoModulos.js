// repositories/accesosRepository.js
import { pool } from "../../../../models/db.js";

export async function registrarAcceso({ usuarioId, modulo, ruta, ip, userAgent, username }) {
  const sql = `
    INSERT INTO accesos_modulos
      (usuario_id, modulo, ruta, ip_cliente, user_agent, usuario)
    VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [usuarioId, modulo, ruta, ip, userAgent, username];
  await pool.query(sql, params);
}


