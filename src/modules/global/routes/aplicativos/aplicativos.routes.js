import { Router } from 'express'
import { Aplicativos } from '../../controllers/aplicativos/aplicativos.controller.js'



const router = Router()

router.get('/Aplicativos', Aplicativos)


export default router