import express from 'express'



const app = express()

// Muestra el formulario para crear un usuario
export const Modulos = async (req, res) => {
    try {

        /* traer los datos de la tabla aplicaciones, para mostrar los aplicativos */


       

        return res.render('modulos/modulos')

    } catch (error) {

        console.error("Error mostrando formulario:", error)
        return res.status(500).send("Error al cargar la vista")

    }
}