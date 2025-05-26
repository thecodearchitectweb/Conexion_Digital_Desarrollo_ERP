import { Router } from "express"

const router = Router()

import { sessionRequired } from '../../middlewares/login/autenticacion.js'
import { Modulos  } from '../../controllers/modulos/modulos.controller.js'
import { logAccesoModulo } from '../../middlewares/modulos/accesoModulos.js'


router.use(sessionRequired)


router.get('/Modulos', logAccesoModulo,  Modulos)


export default router;