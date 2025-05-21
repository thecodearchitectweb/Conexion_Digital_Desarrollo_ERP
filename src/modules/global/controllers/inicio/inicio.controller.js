
import express from 'express';
const app = express();


// src/controllers/userController.js

// Terminar sesión (logout)
export const inicio = async (req, res) => {

    try {
        
        return res.render('inicio/inicio')

    } catch (error) {
        
    }
  
}
