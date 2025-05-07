import { Router } from "express"

const router = Router()

import { api_select_disability_date } from '../controllers/api-select-disability-date.controller.js'


/* Seleccionar las fechas de todas las incapacidades del usuario */
router.get('/incapacidad/api/select/disability/date/:id_empleado', api_select_disability_date)


/* Seleccionar la incapacidad del usuario segun la fecha que haya seleccionado */
//router.get('/incapacidad/api/select/disability/extension/:fecha_inicio', api_select_disability_extension)




export default router;


