import { Router } from "express"

const router = Router()

import {newUser, _newUser} from '../../controllers/users/new_user.controller.js'
import { sessionRequired  } from '../../middlewares/login/autenticacion.js'



router.get('/new/user', sessionRequired,  newUser)

router.post('/new/user', sessionRequired,  _newUser)



export default router;