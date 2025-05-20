import { Router } from "express"

const router = Router()

import { Login, _Login } from '../../controllers/login/login.controller.js'


router.get('/Login', Login)


router.post('/Login', _Login)




export default router;