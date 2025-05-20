import { Router } from "express"

const router = Router()

import {api_add_new_observation} from '../../../modules/incapacidades/controllers/api-add-new-observation.controller.js'
import { sessionRequired  } from '../../global/middlewares/login/autenticacion.js'

router.use(sessionRequired)


router.post('/api/agregar/nueva/observacion', api_add_new_observation)


export default router;