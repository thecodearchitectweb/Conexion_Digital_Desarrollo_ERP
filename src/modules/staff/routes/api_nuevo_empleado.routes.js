import { Router } from 'express'

import { _registroNuevoEmpleado } from '../controllers/api_nuevo_empleado.controller.js'

const router = Router()

router.post('/Staff/api/registro/nuevo/empleado', _registroNuevoEmpleado )

export default router
