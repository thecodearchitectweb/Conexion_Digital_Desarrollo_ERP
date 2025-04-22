import { Router } from "express"

const router = Router()

import {api_download_user_disability} from '../../../modules/incapacidades/controllers/api-download-user-disability.controller.js'


router.post('/api/download/user/disability', api_download_user_disability)


export default router;