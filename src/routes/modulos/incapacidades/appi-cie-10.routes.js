import { Router } from "express"

const router = Router()

import {codigo_enfermedad_general_cie_10} from '../../../controllers/modulos/incapacidades/appi-cie-10.controller.js'


router.get('/api/cie_10/:codigo', codigo_enfermedad_general_cie_10)


export default router;