//import { pool } from "../../models/db.js";
//import bcrypt from "bcryptjs";


import express from 'express';

const app = express();


export const UserDisabilityTable = (req, res) =>{
    return res.render('user_disability_table')
}