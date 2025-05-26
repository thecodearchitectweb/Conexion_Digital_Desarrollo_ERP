import { Router } from "express"
import { sessionRequired  } from '../../global/middlewares/login/autenticacion.js'
import { secureHeaders, generalLimiter, loginLimiter  } from '../../global/middlewares/login/security.js'
import { getseleccionarEmpleado, postseleccionarEmpleado} from '../../../modules/incapacidades/controllers/seleccionar-empleado.controller.js'
import { logAccesoModulo } from '../../global/middlewares/modulos/accesoModulos.js'
 


const router = Router()

// Aplica primeramente las cabeceras seguras y rate limit global
//router.use(secureHeaders)
router.use(generalLimiter)
router.use(sessionRequired)
router.use(logAccesoModulo)



router.get('/incapacidad/seleccionar/empleado',   getseleccionarEmpleado);

router.post('/incapacidad/seleccionar/empleado',  postseleccionarEmpleado);


export default router;