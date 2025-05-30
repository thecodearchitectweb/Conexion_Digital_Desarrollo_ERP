import { Router } from "express"

const router = Router()

import {newUser, _newUser} from '../../controllers/users/new_user.controller.js'
import { sessionRequired  } from '../../middlewares/login/autenticacion.js'
import { logAccesoModulo } from '../../middlewares/modulos/accesoModulos.js'




router.get('/new/user',  logAccesoModulo,  newUser)

router.post('/new/user', sessionRequired,  _newUser)



export default router;