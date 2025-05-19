
import express from 'express'
const app = express()


export const Login = async (req, res) => {
    try {

        return res.render('login/login')

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error al cargar la vista");
    }
}


