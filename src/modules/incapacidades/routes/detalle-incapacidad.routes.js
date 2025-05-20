import { Router } from "express"

const router = Router()

import {detalleIncapacidadEmpleado} from '../../../modules/incapacidades/controllers/detalle-incapacidad.controller.js'

import { sessionRequired  } from '../../global/middlewares/login/autenticacion.js'


router.use(sessionRequired)


router.get('/incapacidad/detalle/incapacidad/empleado/:id', detalleIncapacidadEmpleado);



export default router;