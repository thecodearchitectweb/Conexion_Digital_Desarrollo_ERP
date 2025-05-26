import { Router } from 'express'
import { inicio } from '../../controllers/inicio/inicio.controller.js'
import { logAccesoModulo } from '../../middlewares/modulos/accesoModulos.js'



const router = Router()

router.get('/Inicio', logAccesoModulo,  inicio)


export default router