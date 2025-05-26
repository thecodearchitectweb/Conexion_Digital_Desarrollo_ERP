// middlewares/logAcceso.js
/* import { logearAcceso } from '../../services/modulos/accesoModulos.service.js';

export function logAccesoModulo(req, res, next) {
  // Llamamos en background y pasamos al siguiente handler
  logearAcceso(req)
    .then(() => console.log('Acceso registrado'))
    .catch(err => console.error('Error en logAccesoModulo:', err));
  next();
} */


  // middlewares/logAcceso.js
import { logearAcceso } from '../../services/modulos/accesoModulos.service.js';

// Cache temporal para evitar duplicados
const accesoCache = new Set();

export async function logAccesoModulo(req, res, next) {
  try {
    const userId = req.session?.user?.id;
    const ruta = req.originalUrl;
    const clave = `${userId}-${ruta}`;

    if (!accesoCache.has(clave)) {
      accesoCache.add(clave);

      // Evita duplicados por 5 segundos
      setTimeout(() => accesoCache.delete(clave), 5000);

      await logearAcceso(req);
      console.log('Acceso registrado');
    }
  } catch (err) {
    console.error('Error en logAccesoModulo:', err);
  }

  next();
}
