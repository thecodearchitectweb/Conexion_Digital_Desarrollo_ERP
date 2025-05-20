import { Router } from "express"


import newUser from '../../global/routes/users/new_user.routes.js'
import { sessionRequired  } from '../../global/middlewares/login/autenticacion.js'

const router = Router()


router.use(sessionRequired)


export default [
    newUser
]
