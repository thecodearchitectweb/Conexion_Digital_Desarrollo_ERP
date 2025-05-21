import { Router } from "express"

const router = Router()

import { sessionRequired } from '../../middlewares/login/autenticacion.js'
import { Modulos  } from '../../controllers/modulos/modulos.controller.js'

router.use(sessionRequired)


router.get('/Modulos',   Modulos)


export default router;