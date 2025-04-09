import { Router } from "express"

const router = Router()

import {codigo_enfermedad_general_cie_10} from '../../../modules/incapacidades/controllers/edit-incapacidad-vent-confirmacion.controller.js'


router.get('/api/cie_10/:codigo', codigo_enfermedad_general_cie_10)


export default router;