import { Router } from "express"

const router = Router()

import {tablaIncapacidades} from '../../../modules/incapacidades/controllers/tabla-incapacidades.controller.js'

router.get('/incapacidad/tabla/incapacidades', tablaIncapacidades);


export default router;