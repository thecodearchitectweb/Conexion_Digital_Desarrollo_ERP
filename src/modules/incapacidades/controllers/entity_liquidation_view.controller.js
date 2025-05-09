import { pool } from "../../../models/db.js";
//import bcrypt from "bcryptjs";
import path from 'path';
import {SessionManager } from "../utils/sessionManager.js"



import express from 'express';
import { render } from "ejs";

const app = express();



export const getEntityLiquidationView = async(req, res) => {

    try {


        

        return res.render('entity_liquidation_view')
        
    } catch (error) {
        
    }
};
