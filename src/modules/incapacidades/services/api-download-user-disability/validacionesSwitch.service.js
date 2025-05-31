
import { epsProrrogaNO } from '../api-download-user-disability/validacion-tipo-incapacidad/EPS/epsProrrogaNO.service.js'
import { epsProrrogaSI } from '../api-download-user-disability/validacion-tipo-incapacidad/EPS/epsProrrogaSI.service.js'
import { epsLicencias } from '../api-download-user-disability/validacion-tipo-incapacidad/EPS/epsLicencias.service.js'

import { arlProrrogaNO } from '../../services/api-download-user-disability/validacion-tipo-incapacidad/ARL/arlProrrogaNO.service.js'
import { arlProrrogaSI } from '../../services/api-download-user-disability/validacion-tipo-incapacidad/ARL/arlProrrogaSI.service.js'
import { updateDownloadStatus } from "../../repositories/api-download-user-disability/updateLiquidacoinTableIncapacity.js";




export async function validacionesSwitch(
  id_liquidacion,
  id_historial,
  proceso_1,
  id_user_session
) 
{
  try {
 
    /* VALIDAR SI CUMPLE REQUISITOS PARA LIQUIDAR LA INCAPACIDAD */
    if (proceso_1.Liq_cumplimiento === "SI") {
      switch (proceso_1.parametros.tipo_incapacidad) {
        /* EPS */
        case "EPS":

            /* VALIDACION INCAPACIDAD LICENCIAS */
            if( proceso_1.data.subtipo_incapacidad === 'LICENCIA DE MATERNIDAD' || 
                proceso_1.data.subtipo_incapacidad === 'LICENCIA DE PATERNIDAD' ){
                
                /* FUNCION PARA LICENCIAS */
                const licencias = await epsLicencias( id_liquidacion, id_historial,  proceso_1, id_user_session )


                /* SI EL RESULTADO ES TRUE, ACTUALIZAR DOWNLOAD A  1 */
                if(licencias.success){

                    /* ACTUALIZAR DESCARGA DE INCAPACIDAD A 1 */
                    const updateDownloadStatusLiq = await updateDownloadStatus(id_historial); 
                   
                   
                    // Devuelves directamente el objeto que vino de epsLicencias
                    return {
                      success: true,
                      message: 'Liquidación de licencia procesada correctamente',
                      data: licencias
                    };
                }


                /* SI EL RESULTADO ES FALSE, ACTUALIZAR DOWNLOAD A  1 */
                if(!licencias.success){
                 
                    // Devuelves directamente el objeto que vino de epsLicencias
                    return {
                      success: false,
                      message: licencias.message,
                      data: licencias
                    };
                }

            }



            /* VALIDACION INCAPCIDAD PRORROGA NO */
            if(proceso_1.liq_prorroga === 'NO'){

                /* FUNCION PARA PRRROGA NO */
                const epsProrrogaNO_ = await epsProrrogaNO( id_liquidacion, id_historial,  proceso_1, id_user_session)

            }


            /* VALIDACION INCAPCIDAD PRORROGA SI */
            if(proceso_1.liq_prorroga === 'SI'){
                
                /* FUNCION PARA PRRROGA SI */
                const epsProrrogaSI_ = await epsProrrogaSI( id_liquidacion, id_historial,  proceso_1)
            }

        break;


        case "ARL":

            /* ARL SIN PRORROGA */
            if(proceso_1.liq_prorroga === 'NO'){
                
                /* FUNCION PARA PRRROGA NO */
                const arlProrrogaNO_ = await arlProrrogaNO( id_liquidacion, id_historial,  proceso_1)

            }

            
            /* ARL SIN PRORROGA */
            if(proceso_1.liq_prorroga === 'SI'){
                
                /* FUNCION PARA PRRROGA NO */
                const arlProrrogaSI_ = await arlProrrogaSI( id_liquidacion, id_historial,  proceso_1)

            }

        break;

      }
    }
  } catch (error) {}
}
