import { Router } from 'express'
import { inicio } from '../../controllers/inicio/inicio.controller.js'



const router = Router()

router.get('/inicio', inicio)


export default router