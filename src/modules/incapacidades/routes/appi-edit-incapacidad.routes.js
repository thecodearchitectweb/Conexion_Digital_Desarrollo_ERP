import { Router } from "express"

const router = Router()

import {edit_incapacidad_ventana} from '../../../modules/incapacidades/controllers/appi-edit-incapacidad.controller.js'

import { sessionRequired  } from '../../global/middlewares/login/autenticacion.js'


router.use(sessionRequired)



  router.post('/api/edit/incapacidad', edit_incapacidad_ventana);



export default router;