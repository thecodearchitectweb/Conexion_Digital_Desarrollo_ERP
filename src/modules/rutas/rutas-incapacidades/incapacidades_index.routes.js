import seleccionarEmpleado  from '../../incapacidades/routes/seleccionar-empleado.routes.js'
import detalleIncapacidadEmpleado  from '../../incapacidades/routes/detalle-incapacidad.routes.js'
import  registroNuevaIncapacidad from '../../incapacidades/routes/registro-nueva-incapacidad.routes.js'
import  tablaIncapacidades from '../../incapacidades/routes/tabla-incapacidades.routes.js'
import  appi_Cie10 from '../../incapacidades/routes/appi-cie-10.routes.js'
import  ventanaIncapacidadRecibida from '../../incapacidades/routes/ventana_confirmacion_incapacidad_recibida.routes.js'
import  edit_incapacidad_ventana from '../../incapacidades/routes/appi-edit-incapacidad.routes.js'
import  api_fetch_duplicidad_incapacidad from '../../incapacidades/routes/api_fetch_duplicidad_incapacidad.routes.js'
import  UserDisabilityTable from '../../incapacidades/routes/user_disability_table.routes.js'
import  api_download_user_disability from '../../incapacidades/routes/api-download-user-disability.routes.js'
import  getEntityLiquidationView from '../../incapacidades/routes/entity_liquidation_view.routes.js'
import  api_select_disability_date from '../../incapacidades/routes/api-select-disability-date.routes.js'
import  api_select_disability_extension from '../../incapacidades/routes/api-select-disability-date.routes.js'
import  api_add_new_observation from '../../incapacidades/routes/api-add-new-observation.routes.js'
import api_download_libro_incapacidades_empleado from '../../incapacidades/routes/api-download-incapacidades-empleado.routes.js'

//import  api_add_new_observation from './modules/incapacidades/routes/api-add-new-observation.routes.js'


export default [
    seleccionarEmpleado,
    detalleIncapacidadEmpleado,
    registroNuevaIncapacidad,
    tablaIncapacidades,
    appi_Cie10,
    ventanaIncapacidadRecibida,
    edit_incapacidad_ventana,
    api_fetch_duplicidad_incapacidad,
    UserDisabilityTable,
    api_download_user_disability,
    getEntityLiquidationView,
    api_select_disability_date,
    api_select_disability_extension,
    api_add_new_observation,
    api_download_libro_incapacidades_empleado
  ];