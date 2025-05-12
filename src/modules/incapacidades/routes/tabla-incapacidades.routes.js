import { Router } from "express"

const router = Router()

import {tablaIncapacidades} from '../../../modules/incapacidades/controllers/tabla-incapacidades.controller.js'

router.get('/incapacidad/tabla/incapacidades/:id_empleado', tablaIncapacidades);


export default router;