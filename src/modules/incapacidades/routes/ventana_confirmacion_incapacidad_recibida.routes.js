import { Router } from "express"

const router = Router()

import {incapacidadRecibida} from '../../../modules/incapacidades/controllers/ventana_confirmacion_incapacidad_recibida.controller.js'

router.get('/incapacidad/confirmacion/incapacidad/recibida/:id', incapacidadRecibida);


export default router;