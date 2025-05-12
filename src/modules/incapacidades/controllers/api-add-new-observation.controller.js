import express from 'express';

import { addNewObservation } from '../repositories/api-add-new-observation/apiAddNewObservation.js'

const app = express();

export const api_add_new_observation = async (req, res) => {
    try {
        
        // Capturar los datos enviados desde el fetch
        const {
            codigoLiquidacion, 
            estadoIncapacidad, 
            observacion 
        } = req.body;
        

        // Verificar que los campos no estén vacíos
        if (!codigoLiquidacion || !estadoIncapacidad || !observacion) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios."
            });
        }


        /* SE REALIZA INSERCION EN LA BASE DE DATOS DE LA NUEVA OBSERVACION */
        const NewObservation = await addNewObservation(codigoLiquidacion, estadoIncapacidad, observacion)
        


        /* RESPUESTA */
        res.status(200).json({
            success: true,
            message: "Observación añadida correctamente."
        });

    } catch (error) {

        /* RESPUESTA */
        res.status(200).json({
            success: false,
            message: "Error interno del servidor"
        });

    }
}