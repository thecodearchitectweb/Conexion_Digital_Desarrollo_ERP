import { Router } from "express"

const router = Router()

import {getEntityLiquidationView } from '../../../modules/incapacidades/controllers/entity_liquidation_view.controller.js'


import { sessionRequired  } from '../../global/middlewares/login/autenticacion.js'

import { logAccesoModulo } from '../../global/middlewares/modulos/accesoModulos.js'



router.use(sessionRequired)
router.use(logAccesoModulo)


router.get('/incapacidad/vista/liquidacion/entidades/:id_liquidacion', getEntityLiquidationView)


export default router;