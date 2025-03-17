//import { pool } from "../../models/db.js";
//import bcrypt from "bcryptjs";


import express from 'express';

const app = express();


export const seleccionarEmpleado = (req, res) =>{
    res.render('./views/modulos/incapacidades/seleccionar-empleado.ejs')
}


