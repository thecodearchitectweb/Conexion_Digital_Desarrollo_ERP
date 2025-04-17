import { Router } from "express"

const router = Router()

import {api_validacion_incapacidad_duplicada} from '../../../modules/incapacidades/controllers/api-fetch-duplicidad-incapacidad.controller.js'


router.post('/api/validacion/incapacidad/duplicada', api_validacion_incapacidad_duplicada)


export default router;