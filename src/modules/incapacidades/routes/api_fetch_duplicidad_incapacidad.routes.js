import { Router } from "express"
import { sessionRequired  } from '../../global/middlewares/login/autenticacion.js'

const router = Router()


import {api_validacion_incapacidad_duplicada} from '../../../modules/incapacidades/controllers/api-fetch-duplicidad-incapacidad.controller.js'
import { logAccesoModulo } from '../../global/middlewares/modulos/accesoModulos.js'


router.use(sessionRequired)
router.use(logAccesoModulo)




router.post('/api/validacion/incapacidad/duplicada', api_validacion_incapacidad_duplicada)


export default router;