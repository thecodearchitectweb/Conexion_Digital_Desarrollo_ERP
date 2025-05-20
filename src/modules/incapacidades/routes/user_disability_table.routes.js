import { Router } from "express"

const router = Router()

import {UserDisabilityTable} from '../../../modules/incapacidades/controllers/user_disability_table.controller.js'


import { sessionRequired  } from '../../global/middlewares/login/autenticacion.js'

router.use(sessionRequired)


router.get('/incapacidad/user/disabiblity/table/:id_empleado/:id_incapacidad', UserDisabilityTable);



export default router;