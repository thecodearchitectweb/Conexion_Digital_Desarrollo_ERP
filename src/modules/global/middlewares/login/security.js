// src/middleware/security.js
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'


// Middleware para cabeceras seguras
export const secureHeaders = helmet()


// Rate limit general: 100 peticiones / 15 min
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas peticiones desde esta IP, inténtalo más tarde.'
})


// Rate limit específico para login: 5 intentos / 2 min
export const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos de login. Espera 2 minutos e inténtalo de nuevo.'
})
