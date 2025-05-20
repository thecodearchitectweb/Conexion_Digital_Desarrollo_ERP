// src/middleware/sessionAuth.js
const rutasPublicas = ['/login', '/api/login', '/logout']; // lo que no requiere sesión

export function sessionRequired(req, res, next) {
  if (rutasPublicas.includes(req.path)) {
    return next(); // Excluir login, logout y otras públicas
  }

  if (req.session && req.session.userId) {
    return next(); // Sesión válida
  }

  // Manejo API vs vista
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(401).json({ message: "No autenticado. Sesión requerida." });
  }

  console.warn(`Intento de acceso sin sesión: ${req.path}`);
  return res.redirect('/login');
}


