import { Router } from "express"

const router = Router()

import {edit_incapacidad_ventana} from '../../../modules/incapacidades/controllers/appi-edit-incapacidad.controller.js'



  router.post('/api/edit/incapacidad', edit_incapacidad_ventana);



export default router;