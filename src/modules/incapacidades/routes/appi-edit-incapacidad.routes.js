import { Router } from "express"

const router = Router()

import {edit_incapacidad_ventana} from '../../../modules/incapacidades/controllers/appi-edit-incapacidad.controller.js'

import upload from '../../../modules/incapacidades/middlewares/uploadConfig.middleware.js';


  router.post('/api/edit/incapacidad', upload.any(), edit_incapacidad_ventana);



export default router;