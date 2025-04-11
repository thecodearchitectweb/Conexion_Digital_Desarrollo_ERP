import { Router } from "express"

const router = Router()

import {edit_incapacidad_ventana} from '../../../modules/incapacidades/controllers/appi-edit-incapacidad.controller.js'

import upload from '../../../modules/incapacidades/middlewares/uploadConfig.middleware.js';


// Configurar los campos de archivos que se esperan en el formulario
const multipleFields = upload.fields([
    { name: 'input_file_incapacidad', maxCount: 1 },
    { name: 'input_file_historia_clinica', maxCount: 1 },
    { name: 'input_file_cedula', maxCount: 1 },
    { name: 'input_file_soat', maxCount: 1 },
    { name: 'input_file_licencia_conduccion', maxCount: 1 },
    { name: 'input_file_tecnico_mecanica', maxCount: 1 },
    { name: 'input_file_formulario_furips', maxCount: 1 }
  ]);


  router.post('/api/edit/incapacidad', upload.any(), edit_incapacidad_ventana);



export default router;