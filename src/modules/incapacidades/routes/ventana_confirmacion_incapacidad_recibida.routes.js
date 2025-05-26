import { Router } from "express"

const router = Router()

import {incapacidadRecibida} from '../../../modules/incapacidades/controllers/ventana_confirmacion_incapacidad_recibida.controller.js'

import { sessionRequired  } from '../../global/middlewares/login/autenticacion.js'
import { logAccesoModulo } from '../../global/middlewares/modulos/accesoModulos.js'



router.use(sessionRequired)
router.use(logAccesoModulo)


router.get('/incapacidad/confirmacion/incapacidad/recibida/:id', incapacidadRecibida);


export default router;