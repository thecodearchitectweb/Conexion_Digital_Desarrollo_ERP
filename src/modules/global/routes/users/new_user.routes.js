import { Router } from "express"

const router = Router()

import {newUser, _newUser} from '../../controllers/users/new_user.controller.js'


router.get('/new/user', newUser)
router.post('/new/user', _newUser)



export default router;