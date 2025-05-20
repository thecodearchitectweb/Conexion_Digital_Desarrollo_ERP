import { pool } from "../../../../models/db.js";
import bcrypt from 'bcryptjs'
import { addMilliseconds, isAfter } from "date-fns";
import { validationLogin } from '../../services/login/login.js' 


const MAX_LOGIN_ATTEMPTS = 3;
const LOCK_TIME_MS      = 15 * 60 * 1000; // bloquea 15 minutos


// 1) Render de la página de login
export const Login = async (req, res) => {
  try {
    // Evitar cache de la página de login
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");

    return res.render("login/login");
  } catch (error) {
    console.error("Error al renderizar login:", error);
    res.status(500).send("Error al cargar la vista");
  }
};


// 2) Procesamiento del POST /api/login
export const _Login = async (req, res) => {
  try {
  
    const { usuario, contraseña } = req.body;
    if (!usuario || !contraseña) {
      return res.status(400).json({ message: "Faltan datos de usuario o contraseña" });
    }

    const login = validationLogin(usuario, contraseña)


    
    // Login exitoso: resetear intentos y bloqueo
    await pool.query(
      "UPDATE usuarios SET login_attempts = 0, lock_until = NULL, updated_at = NOW() WHERE id = ?",
      [user.id]
    );

    // Guardar sesión (si usas express-session)
    req.session.userId = user.id;

    // Enviar cabeceras de seguridad
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");

    return res.json({
      message: "Login exitoso",
      user: {
        id: user.id,
        nombre: user.nombre,
        usuario: user.usuario,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error("Error en _Login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
