import { pool } from "../../../../models/db.js";
import bcrypt from 'bcryptjs'
import { addMilliseconds, isAfter } from "date-fns";
import { validationLogin } from '../../services/login/login.js'
import { LIMPIAR_BLOQUEO_USUARIO } from '../../repositories/login/update_limpiar_bloqueo_usuario.js'


const MAX_LOGIN_ATTEMPTS = 3;
const LOCK_TIME_MS = 15 * 60 * 1000; // bloquea 15 minutos


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

    console.log("DATOS RECIBIDOS, USUARIO Y CONTRASEÑA")

    /* MANEJO DE LOGICA PARA LOGIN */
    const user = await validationLogin(usuario, contraseña)


    console.log("SE EJECUTA MANEJO DE LOGICA: ", user)


    /* LOGIN EXITOSO */
    const RESTAURAR_USUARIO_AUTENTICADO = await LIMPIAR_BLOQUEO_USUARIO(user.id)

    console.log("LOGIN EXITODO, SE RESTAURA USUARIO: ", RESTAURAR_USUARIO_AUTENTICADO)

    // Guardar sesión (si usas express-session)
    req.session.userId = user.id;

    console.log("USUARIO GUARDADO EN SESSION: ", req.session.userId)


    // Enviar cabeceras de seguridad
    /*     res.setHeader("Cache-Control", "no-store");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY"); */


    req.session.user = {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      documento: user.documento,
      estado: user.estado,
      area: user.area,
      cargo: user.cargo,
      rol: user.rol,
      usuario: user.usuario
    }


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
    const status = error.status || error.statusCode || 500;  // <-- added fallback to statusCode
    return res.status(status).json({ message: error.message });
  }
};
