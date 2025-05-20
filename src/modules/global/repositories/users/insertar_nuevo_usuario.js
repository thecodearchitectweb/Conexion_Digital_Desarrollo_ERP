// src/repositories/userRepository.js
import { pool } from "../../../../models/db.js";



export async function createUser(data) {
  // Definición de la consulta SQL con placeholders

  const sql = `
    INSERT INTO usuarios
      (nombre, documento, estado, fecha_nacimiento, correo, contacto,
       direccion, area, cargo, lider_directo, rol, usuario, password,
       login_attempts, lock_until)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Parámetros que se inyectan en la consulta
  const params = [
    data.nombre,
    data.documento,
    data.estado,
    data.fecha_nacimiento,
    data.correo,
    data.contacto,
    data.direccion,
    data.area,
    data.cargo,
    data.lider_directo,
    data.rol,
    data.usuario,
    data.password,
    data.login_attempts || 0,
    data.lock_until || null
  ];

  // Ejecución de la consulta usando destructuring para obtener result
  const [result] = await pool.query(sql, params);
  return result.insertId;
}

