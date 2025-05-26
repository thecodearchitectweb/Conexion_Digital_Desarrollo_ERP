import { Router } from "express"

const router = Router()

import {codigo_enfermedad_general_cie_10} from '../../../modules/incapacidades/controllers/appi-cie-10.controller.js'

import { sessionRequired  } from '../../global/middlewares/login/autenticacion.js'
import { logAccesoModulo } from '../../global/middlewares/modulos/accesoModulos.js'



router.use(sessionRequired)
router.use(logAccesoModulo)



router.get('/api/cie_10/:codigo', codigo_enfermedad_general_cie_10)


export default router;