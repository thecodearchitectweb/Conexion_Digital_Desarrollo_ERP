import { Router } from 'express'
import { Aplicativos } from '../../controllers/aplicativos/aplicativos.controller.js'
import { logAccesoModulo } from '../../middlewares/modulos/accesoModulos.js'


const router = Router()

router.get('/Aplicativos',  logAccesoModulo, Aplicativos)


export default router