import { Router } from "express"

const router = Router()

import { registroNuevaIncapacidad} from '../../../controllers/modulos/incapacidades/registro-nueva-incapacidad.controller.js'


router.post('/incapacidad/registro/nueva/incapacidad', registroNuevaIncapacidad);


export default router;

