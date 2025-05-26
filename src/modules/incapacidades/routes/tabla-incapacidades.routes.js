import { Router } from "express"

const router = Router()

import {tablaIncapacidades} from '../../../modules/incapacidades/controllers/tabla-incapacidades.controller.js'

import { sessionRequired  } from '../../global/middlewares/login/autenticacion.js'
import { logAccesoModulo } from '../../global/middlewares/modulos/accesoModulos.js'




router.use(sessionRequired)
router.use(logAccesoModulo)


router.get('/incapacidad/tabla/incapacidades/:id_empleado', tablaIncapacidades);


export default router;