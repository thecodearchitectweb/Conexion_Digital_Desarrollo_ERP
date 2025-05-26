import { Router } from "express"

const router = Router()

import {detalleIncapacidadEmpleado} from '../../../modules/incapacidades/controllers/detalle-incapacidad.controller.js'

import { sessionRequired  } from '../../global/middlewares/login/autenticacion.js'
import { logAccesoModulo } from '../../global/middlewares/modulos/accesoModulos.js'


router.use(sessionRequired)
router.use(logAccesoModulo)


router.get('/incapacidad/detalle/incapacidad/empleado/:id', detalleIncapacidadEmpleado);



export default router;