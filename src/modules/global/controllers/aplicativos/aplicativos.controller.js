// src/modules/global/controllers/modulos/modulos.controller.js
import express from 'express';
import { aplicaivosDB } from '../../services/aplicativos/get_aplicativos.js';


export const Aplicativos = async (req, res) => {
  try {
    
    // 1. Esperamos la resolución de la promesa
    const dataAplicativos = await aplicaivosDB();
    console.log(dataAplicativos);

    
    // 2. Renderizamos la vista pasando los datos
    return res.render('aplicativos/aplicativos', {
      aplicativos: dataAplicativos || []  // siempre enviamos un array
    });
    

  } catch (error) {
    console.error('Error en Aplicativos controller:', error);
    // 3. Manejamos el error devolviendo un 500
    return res.status(500).send('Error cargando los aplicativos');
  }
};
