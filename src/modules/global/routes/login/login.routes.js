import { Router } from "express"
import { loginLimiter } from '../../middlewares/login/security.js' 
import { Login, _Login } from '../../controllers/login/login.controller.js'
import { logoutUser } from '../../controllers/login/logout.controller.js'

const router = Router()




router.get('/Login',  Login)

router.post('/Login',  loginLimiter,  _Login) // ingresar a session

router.post('/logout', logoutUser) // cerrar session





export default router;