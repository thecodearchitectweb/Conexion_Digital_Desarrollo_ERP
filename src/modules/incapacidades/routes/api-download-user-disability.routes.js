import { Router } from "express"

const router = Router()

import {api_download_user_disability} from '../../../modules/incapacidades/controllers/liquidacion-incapcidad/liquidacion_incapcidad.controller.js'

import { sessionRequired  } from '../../global/middlewares/login/autenticacion.js'
import { logAccesoModulo } from '../../global/middlewares/modulos/accesoModulos.js'



router.use(sessionRequired)
router.use(logAccesoModulo)



router.post('/api/download/user/disability/:id_liquidacion/:id_historial', api_download_user_disability)


export default router;