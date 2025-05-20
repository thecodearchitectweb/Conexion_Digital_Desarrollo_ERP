import { Router } from "express"

import upload from '../../../modules/incapacidades/middlewares/uploadConfig.middleware.js';
import { registroNuevaIncapacidad} from '../../../modules/incapacidades/controllers/registro-nueva-incapacidad.controller.js'

import { sessionRequired  } from '../../global/middlewares/login/autenticacion.js'


const router = Router()


router.use(sessionRequired)


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



router.post('/incapacidad/registro/nueva/incapacidad', multipleFields , registroNuevaIncapacidad);


export default router;

