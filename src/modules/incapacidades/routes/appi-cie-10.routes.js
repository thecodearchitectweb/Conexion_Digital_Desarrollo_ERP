import { Router } from "express"

const router = Router()

import {codigo_enfermedad_general_cie_10} from '../../../modules/incapacidades/controllers/appi-cie-10.controller.js'


router.get('/api/cie_10/:codigo', codigo_enfermedad_general_cie_10)


export default router;