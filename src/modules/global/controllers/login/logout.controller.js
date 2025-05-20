
import express from 'express';
const app = express();


// src/controllers/userController.js

// Terminar sesión (logout)
export const logoutUser = (req, res) => {

    

  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err)
      return res.status(500).json({ message: 'No se pudo cerrar la sesión' })
    }

    // Elimina cookie del cliente
    res.clearCookie('session_cookie_name') // debe coincidir con la key en express-session

    res.status(200).json({ message: 'Sesión cerrada correctamente' })
  })
}
