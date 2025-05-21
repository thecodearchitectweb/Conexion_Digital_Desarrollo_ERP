import { Router } from 'express'
import { inicio } from '../../controllers/inicio/inicio.controller.js'



const router = Router()

router.get('/Inicio', inicio)


export default router