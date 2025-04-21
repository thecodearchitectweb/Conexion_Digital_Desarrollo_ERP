import { Router } from "express"

const router = Router()

import {UserDisabilityTable} from '../../../modules/incapacidades/controllers/user_disability_table.controller.js'

router.get('/incapacidad/user/disabiblity/table', UserDisabilityTable);



export default router;