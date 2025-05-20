import { pool } from "../../../../models/db.js";
import bcrypt from 'bcryptjs'
import { addMilliseconds, isAfter } from "date-fns";
import { verificarUsuario } from '../../repositories/login/validacion_usuario.js'
import { UPDATE_LOGIN_ATTEMPTS_QUERY } from '../../repositories/login/update_estatus_seguridad.js'


const MAX_LOGIN_ATTEMPTS = 3;
const LOCK_TIME_MS = 15 * 60 * 1000; // bloquea 15 minutos


export async function validationLogin(usuario, contraseña) {

    // Buscar usuario por nombre de usuario
    const user = await verificarUsuario(usuario)


    /* SE VALIDA SI EL USUARIO EXISTE */
    if (!user) {
        return res.status(401).json({ message: "Usuario invalido" });
    }

    const now = Date.now();


    //  Si está bloqueado...
    if (user.lock_until && isAfter(new Date(user.lock_until), now)) {
        const unlockInMs = new Date(user.lock_until) - now;
        const minutes = Math.ceil(unlockInMs / 60000);
        return res.status(423).json({
            message: `Cuenta bloqueada. Intenta de nuevo en ${minutes} min.`
        });
    }


    // Comparar contraseñas
    const match = await bcrypt.compare(contraseña, user.password);

    if (!match) {
        // Incrementar intentos fallidos
        let attempts = (user.login_attempts || 0) + 1;
        let lock_until = null;

        if (attempts >= MAX_LOGIN_ATTEMPTS) {
            // Bloquear cuenta
            lock_until = addMilliseconds(new Date(), LOCK_TIME_MS).getTime();
            attempts = 0; // resetear contador tras bloqueo
        }

        /* ACTUALIZAMOS EL STATUS DE LA SEGURIDAD EN INTENTOS Y RELOJ */
        const UPDATE_SECURITY_STATUS = await UPDATE_LOGIN_ATTEMPTS_QUERY(attempts, lock_until, user.id)


        const msg =
            lock_until
                ? `Cuenta bloqueada por ${LOCK_TIME_MS / 60000} min tras ${MAX_LOGIN_ATTEMPTS} intentos fallidos.`
                : `Credenciales incorrectas. Intento ${attempts}/${MAX_LOGIN_ATTEMPTS}.`;

        return res.status(401).json({ message: msg });
    }
}