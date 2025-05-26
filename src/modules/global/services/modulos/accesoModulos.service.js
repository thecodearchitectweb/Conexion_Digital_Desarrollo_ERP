// services/accesosService.js
import { registrarAcceso } from '../../repositories/modulos/accesoModulos.js';

export async function logearAcceso(req) {
  try {
    // Usuario desde sesión
    const usuarioId = req.session?.user?.id;
    if (!usuarioId) throw new Error('No hay usuario en sesión');

    // IP real (confía en proxy si lo tienes configurado)
    const xff = req.headers['x-forwarded-for'];
    const ip  = xff ? xff.split(',')[0].trim() : req.ip;

    // Ruta y módulo
    const ruta   = req.originalUrl;
    const modulo = req.params.modulo || ruta;

    // User-Agent real
    const userAgent = req.get('User-Agent') || '';

    // extraes el username de la sesión
    const username = req.session.user.usuario || '';

    // Llamada al repo con exactamente los 5 campos
    await registrarAcceso({ usuarioId, modulo, ruta, ip, userAgent, username });
  } catch (err) {
    console.error('Error logearAcceso:', err);
  }
}
