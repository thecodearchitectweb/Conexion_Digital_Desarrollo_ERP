import { Router } from "express"

const router = Router()

import {downloadInformeExcel} from '../../../modules/incapacidades/controllers/download-informe/download_Informe_Excel.controller.js'

import { sessionRequired  } from '../../global/middlewares/login/autenticacion.js'
import { logAccesoModulo } from '../../global/middlewares/modulos/accesoModulos.js'


router.use(sessionRequired)
router.use(logAccesoModulo)


router.get('/incapacidad/download/informe', downloadInformeExcel);



export default router;