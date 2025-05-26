import { Router } from "express"

const router = Router()

import { api_select_disability_date, api_select_disability_extension } from '../controllers/api-select-disability-date.controller.js'

import { sessionRequired  } from '../../global/middlewares/login/autenticacion.js'
import { logAccesoModulo } from '../../global/middlewares/modulos/accesoModulos.js'



router.use(sessionRequired)
router.use(logAccesoModulo)



/* Seleccionar las fechas de todas las incapacidades del usuario */
router.get('/incapacidad/api/select/disability/date/:id_empleado', api_select_disability_date)


/* Seleccionar la incapacidad del usuario segun la fecha que haya seleccionado */
router.get('/incapacidad/api/select/disability/extension/:id_incapacidad', api_select_disability_extension)




export default router;


