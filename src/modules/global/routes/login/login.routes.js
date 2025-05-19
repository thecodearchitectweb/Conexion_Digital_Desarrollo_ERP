import { Router } from "express"

const router = Router()

import { Login } from '../../controllers/login/login.controller.js'


router.get('/Login', Login)


export default router;