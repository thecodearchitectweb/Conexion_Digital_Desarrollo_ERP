import { Router } from "express"

const router = Router()

import {seleccionarEmpleado} from '../../../controllers/modulos/incapacidades/seleccionar-empleado.controller.js'

router.get('/incapacidad/seleccionar/empleado', seleccionarEmpleado);


export default router;