import { Router } from "express"

const router = Router()

import {api_download_libro_incapacidades_empleado} from '../../../modules/incapacidades/controllers/api-download-incapacidades-empleado.controller.js'


import { sessionRequired  } from '../../global/middlewares/login/autenticacion.js'

router.use(sessionRequired)


router.post('/api/download/libro/incapacidades/empleado', api_download_libro_incapacidades_empleado)


export default router;