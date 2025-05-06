import { Router } from "express"

const router = Router()

import {getEntityLiquidationView } from '../../../modules/incapacidades/controllers/entity_liquidation_view.controller.js'


router.get('/incapacidad/vista/liquidacion/entidades', getEntityLiquidationView)


export default router;