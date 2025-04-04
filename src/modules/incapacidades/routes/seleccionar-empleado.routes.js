import { Router } from "express"

const router = Router()

import { getseleccionarEmpleado, postseleccionarEmpleado} from '../../../modules/incapacidades/controllers/seleccionar-empleado.controller.js'

router.get('/incapacidad/seleccionar/empleado', getseleccionarEmpleado);

router.post('/incapacidad/seleccionar/empleado', postseleccionarEmpleado);


export default router;