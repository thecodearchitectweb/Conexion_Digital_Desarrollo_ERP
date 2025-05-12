import { Router } from "express"

const router = Router()

import {api_add_new_observation} from '../../../modules/incapacidades/controllers/api-add-new-observation.controller.js'


router.post('/api/agregar/nueva/observacion', api_add_new_observation)


export default router;