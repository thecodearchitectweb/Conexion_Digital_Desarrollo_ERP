import { Router } from 'express'

import { registroNuevoEmpleado } from '../controllers/nuevo_empleado.controller.js'

const router = Router()

router.get('/Staff/registro/nuevo/empleado', registroNuevoEmpleado )

export default router
