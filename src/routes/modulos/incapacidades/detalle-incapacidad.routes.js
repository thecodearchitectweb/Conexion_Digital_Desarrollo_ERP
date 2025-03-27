import { Router } from "express"

const router = Router()

import {detalleIncapacidadEmpleado} from '../../../controllers/modulos/incapacidades/detalle-incapacidad.controller.js'

router.get('/incapacidad/detalle/incapacidad/empleado/:id', detalleIncapacidadEmpleado);



export default router;