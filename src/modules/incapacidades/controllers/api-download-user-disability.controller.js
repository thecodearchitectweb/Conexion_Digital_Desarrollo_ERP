import { pool } from "../../../models/db.js";
import express from 'express';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { json } from "stream/consumers";
import {getUltimasIncapacidades } from '../repositories/api-download-user-disability/incapacidadesHelpers.js'
import {getIdEmpleadoByHistorial} from '../repositories/api-download-user-disability/getIdEmpleadoByHistorial.js'
import {getDisabilityDischargeHistory} from '../repositories/api-download-user-disability/getDisabilityDischargeHistory.js'
import {updateLiquidacoinTableIncapacity, updateDownloadStatus} from '../repositories/api-download-user-disability/updateLiquidacoinTableIncapacity.js'
import {getPoliticaByParametros} from '../repositories/api-download-user-disability/getPoliticaByParametros.js'
import {formatDate, formatDate2, formatDateTime} from '../utils/formatDate/formatDate.js'
import {validarProrroga } from '../utils/api-download-user-disability/validarProrroga.js'
import {updateDisabilitySettlementExtensionLiq, updateDisabilitySettlementExtensionHis } from '../repositories/api-download-user-disability/updateDisabilitySettlementExtension.js'
import { Console } from "console";



const app = express();

export const api_download_user_disability = async (req, res) => {
    try {
        const { id_liquidacion, id_historial } = req.params;
        console.log(id_liquidacion, id_historial)



/* ------------------------------------------------------------------------------------------------------------------------- */

        /* TRAER ID DEL EMPLEADO CONSULTA EN REPOSITORIES*/
        const id_empleado = await getIdEmpleadoByHistorial(id_historial);
        
/* ------------------------------------------------------------------------------------------------------------------------- */



/* ------------------------------------------------------------------------------------------------------------------------- */

        /* VALIDACION SI HACE FALTA ALGUNO DE LOS DATOS */
        if (!id_liquidacion || !id_historial  || !id_empleado) {
            return res.status(400).json({ message: "Faltan parámetros en la solicitud." });
        }

/* ------------------------------------------------------------------------------------------------------------------------- */



/* ------------------------------------------------------------------------------------------------------------------------- */

        // OBTENER DATOS ACTUALIZADOS DE LA INCAPACIDAD TABLA PRE-LIMINAR
        const disabilityDischargeHistory = await getDisabilityDischargeHistory(id_empleado, id_historial);

        // Validar si no encontró datos
        if (!disabilityDischargeHistory) {
            return res.status(404).json({ message: "No se encontró la incapacidad con los datos proporcionados." });
        }

        // Ya tienes el objeto listo
        const data = disabilityDischargeHistory;
        console.log("🧾 Datos encontrados:", data);

/* ------------------------------------------------------------------------------------------------------------------------- */



/* ------------------------------------------------------------------------------------------------------------------------- */

        /* ACTUALIZA LA INFORMACION A LA MAS ACTUAL */
        const updateResult = await updateLiquidacoinTableIncapacity(data);

        if (updateResult.affectedRows > 0) {
            return res.status(200).json({ message: "Información actualizada correctamente." });
        }

/* ------------------------------------------------------------------------------------------------------------------------- */



/* ------------------------------------------------------------------------------------------------------------------------- */

        /* CALCULAR CANTIDAD DE DÍAS LABORADOS DEL EMPLEADO */
        const fechaContratacionRaw = new Date(data.fecha_contratacion);
        const hoy = new Date();
        
        const fechaContratacion = format(fechaContratacionRaw, 'yyyy-MM-dd', { locale: es });
        const fechaHoy = format(hoy, 'yyyy-MM-dd', { locale: es });
        
        const diasLaborados = differenceInDays(hoy, fechaContratacionRaw) + 1 
        const diasLaborados_conversion = differenceInDays(hoy, fechaContratacionRaw) + 1 >= 30 ? ">30" : "<30";
        
        console.log(`📅 Días laborados: ${diasLaborados}`);
        console.log("📆 FECHA CONTRATACION:", fechaContratacion);
        console.log("📆 HOY:", fechaHoy);

/* ------------------------------------------------------------------------------------------------------------------------ */




/* ------------------------------------------------------------------------------------------------------------------------ */

        /* TRAER DATOS NECESARIOS PARA EJECUTAR CONSULTA EN LA BASE DE DATOS POLITICAS */

        const SMMLV =  1423500 

        const P_salario = data.salario_empleado
        const P_salario_conversion = data.salario_empleado > SMMLV ? ">SMLV" : "SMLV"

        const P_tipo_incapacidad = data.tipo_incapacidad

        const P_N_dias_incapacidad = data.cantidad_dias
        const P_N_dias_incapacidad_conversion = data.cantidad_dias > 2 ? ">2" : "<3"

        const P_prorroga_texto = data.prorroga
        const P_prorroga_texto_conversion = data.prorroga === 1 ? "SI" : "NO";


        console.log(P_salario, P_salario_conversion)
        console.log(P_tipo_incapacidad)
        console.log(P_N_dias_incapacidad, P_N_dias_incapacidad_conversion)
        console.log(P_prorroga_texto, P_prorroga_texto_conversion)

/* ------------------------------------------------------------------------------------------------------------------------ */




/* ------------------------------------------------------------------------------------------------------------------------ */

        /* TRAER POLITICA QUE APLICA A LA INCAPACIDAD */
        const politicaAplicada = await getPoliticaByParametros(
            P_prorroga_texto_conversion,
            diasLaborados_conversion,
            P_salario_conversion,
            P_tipo_incapacidad,
            P_N_dias_incapacidad_conversion
        );

        if (!politicaAplicada) {
            return res.status(404).json({ message: "No se encontró ninguna política para liquidar la incapacidad." });
        }

              

        console.log("📜 Política encontrada:", politicaAplicada);
        
/* ------------------------------------------------------------------------------------------------------------------------ */




/* ------------------------------------------------------------------------------------------------------------------------ */

        /* VARIABLES PARA LA LIQUIDACION  */
        //const Liq_empleador = data_politica
        const Liq_entidad =   P_tipo_incapacidad
        const Liq_cumplimiento = politicaAplicada.cumplimiento
        const Liq_porcentaje_liquidacion_empleador = parseFloat(politicaAplicada.porcentaje_liquidacion_empleador) || 0

        const Liq_porcentaje_liquidacion_eps = parseFloat(politicaAplicada.porcentaje_liquidacion_eps) || 0
        const Liq_porcentaje_liquidacion_arl = parseFloat(politicaAplicada.porcentaje_liquidacion_arl) || 0
        const Liq_porcentaje_liquidacion_fondo_pensiones = parseFloat(politicaAplicada.porcentaje_liquidacion_fondo_pensiones) || 0
        const Liq_porcentaje_liquidacion_eps_fondo_pensiones = parseFloat(politicaAplicada.porcentaje_liquidacion_eps_fondo_pensiones) || 0

        //console.log("EMPLEADOR Liq_empleador: ", Liq_empleador)
        console.log("ENTIDAD: ", Liq_entidad)
        console.log("ENTICUMPLIMIENTO: ", Liq_cumplimiento)
        console.log("PORCENTAJE A LIQUIDAR EMPLEADOR: ", Liq_porcentaje_liquidacion_empleador)
        console.log("PORCENTAJE A LIQUIDAR EPS: ", Liq_porcentaje_liquidacion_eps)
        console.log("PORCENTAJE A LIQUIDAR ARL: ", Liq_porcentaje_liquidacion_arl)
        console.log("PORCENTAJE A LIQUIDAR F.PENSIONES: ", Liq_porcentaje_liquidacion_fondo_pensiones)
        console.log("PORCENTAJE A LIQUIDAR F.PENSIONES Y EPS: ", Liq_porcentaje_liquidacion_eps_fondo_pensiones)

/* ------------------------------------------------------------------------------------------------------------------------ */



/* ------------------------------------------------------------------------------------------------------------------------ */

/* VARIABLE DE DÍAS A LIQUIDAR POR CADA ENTIDAD */

    const liq_dias_Incapacidad = parseInt(data.cantidad_dias); // total días de la incapacidad
    const liq_tipo_Incapacidad = P_tipo_incapacidad.toUpperCase();  // tipo de incapacidad
    const liq_prorroga = P_prorroga_texto_conversion.toUpperCase(); // "SI" o "NO"

    let liq_dias_empleador = 0;
    let liq_dias_eps = 0;
    let liq_dias_arl = 0;
    let liq_dias_fondo = 0;
    let liq_dias_eps_fondo = 0;




    /* VALDIACION PARA EJECUTAR CONSULTAS Y LIQUIDACION CORRECTA DE ENTIDADES */
    if (Liq_cumplimiento === 'SI') {

        if (liq_prorroga === 'SI') {
    
            /* SE LLAMA FUNCION PARA TRAER LAS ULTIMAS INCAPACIDADES DEL USER */
            const data_incapacidades_liquidadas = await getUltimasIncapacidades(id_empleado);
            
            
            /* FECHAS FORMATEADAS */
            const fecha_inicio_incapacidad_anterior = formatDate2(data_incapacidades_liquidadas.fecha_inicio_incapacidad);
            const fecha_final_incapacidad_anterior = formatDate2(data_incapacidades_liquidadas.fecha_final_incapacidad); /* TRAER FECHA FINAL DE LA ULTIMA INCAPACIDAD Y FECHA INICIAL DE LA INCAPACIDAD A LIQUIDAR */
            const fecha_inicial_incapacidad_liquidar = formatDate2(data.fecha_inicio_incapacidad)    /* FECHA INICIAL DE INCAPAVCIDAD A LIQUIDAR */
            const fecha_final_incapacidad_liquidar = formatDate2(data.fecha_final_incapacidad)   /* FECHA FINAL DE INCAPACIDAD A LIQUIDAR  */
            console.log("FECHA INICIAL ULTIMA INCAPACIDAD: ", fecha_inicio_incapacidad_anterior,"FECHA FINAL ULTIMA INCAPACIDAD: ", fecha_final_incapacidad_anterior, "FECHA INICIAL INCAPACIDAD A LIQUIDAR: ", fecha_inicial_incapacidad_liquidar, "FECHA FINAL INCAPACIDAD A LIQUIDAR: ", fecha_final_incapacidad_liquidar)


            /* FUNCION PARA DETERMINAR SI APLICA O NO APLICA PRORROGA */
            const prorrogaValida = validarProrroga(
                fecha_inicio_incapacidad_anterior,
                fecha_final_incapacidad_anterior,
                fecha_inicial_incapacidad_liquidar,
                fecha_final_incapacidad_liquidar
            );
            
            if (prorrogaValida) {
                console.log("Prórroga aplicada correctamente.");
            } else {
                const updateDisabilityExtensionliq = await updateDisabilitySettlementExtensionLiq(id_historial)  /*  ACTUALIZACION PRORROGA TABLA LIQUIDACION EN 0  */
                const updateDisabilityExtensionHis = await updateDisabilitySettlementExtensionHis(id_historial) /*  ACTUALIZACION PRORROGA TABLA HISTORIAL EN 0 */

                console.log("ACTUALIZACION PRORROGA LIQUIDACION: ", updateDisabilityExtensionliq)
                console.log("ACTUALIZACION PRORROGA HISTORIAL: ", updateDisabilityExtensionHis)

            }




            /* ACTUALIZAR DOWNLOAD A 1 */
            const updateDownloadStatusLiq = await updateDownloadStatus(id_historial)




            switch (liq_tipo_Incapacidad) {
                case 'EPS':

                    liq_dias_empleador = 0;
                    liq_dias_eps = liq_dias_Incapacidad;
                    break;

                case 'ARL':
                    liq_dias_arl = liq_dias_Incapacidad;
                    break;
                default:
                    console.log(`Tipo de incapacidad con prórroga no reconocido: ${liq_tipo_Incapacidad}`);
            }
    
        } else if (liq_prorroga === 'NO') {
    
            switch (liq_tipo_Incapacidad) {
                case 'EPS':
                    liq_dias_empleador = liq_dias_Incapacidad >= 2 ? 2 : liq_dias_Incapacidad;
                    liq_dias_eps = Math.max(liq_dias_Incapacidad - 2, 0);
                    break;
                case 'ARL':
                    liq_dias_arl = liq_dias_Incapacidad;
                    break;
                case 'FONDO':
                    liq_dias_fondo = liq_dias_Incapacidad;
                    break;
                case 'EPS+FONDO':
                    liq_dias_eps_fondo = liq_dias_Incapacidad;
                    break;
                default:
                    console.log(`Tipo de incapacidad sin prórroga no reconocido: ${liq_tipo_Incapacidad}`);
            }
    
        } else {
            console.error(`Valor inesperado de prórroga: ${liq_prorroga}`);
        }
    
    } else {
        console.error(`Cumplimiento no aprobado: ${liq_cumplimiento}`);
    }
    

console.log({
    liq_dias_Incapacidad,
    liq_tipo_Incapacidad,
    liq_prorroga,
    liq_dias_empleador,
    liq_dias_eps,
    liq_dias_arl,
    liq_dias_fondo,
    liq_dias_eps_fondo
});



/* ------------------------------------------------------------------------------------------------------------------------ */


/* 
[
  {
    id_politicas_incapacidades: 11,
    cumplimiento: 'SI',
    prorroga: 'SI',
    dias_laborados: '>30',
    salario: '>SMLV',
    tipo_incapacidad: 'EPS',
    dias_incapacidad: '<3',
    porcentaje_liquidacion_empleador: '0.00',
    porcentaje_liquidacion_eps: '66.67',
    porcentaje_liquidacion_arl: '0.00',
    porcentaje_liquidacion_fondo_pensiones: '0.00',
    porcentaje_liquidacion_eps_fondo_pensiones: '0.00',
    fecha_registro: 2025-04-25T15:45:56.000Z,
    fecha_actualizacion: 2025-04-25T16:14:47.000Z
  }
]
*/

/* ------------------------------------------------------------------------------------------------------------------------ */

        /* CALCULAR DIAS */


/* ------------------------------------------------------------------------------------------------------------------------ */


/* ------------------------------------------------------------------------------------------------------------------------ */

        /* CALCULAR LIQUIDACION DE EMPLEADOR */


/* ------------------------------------------------------------------------------------------------------------------------ */







        /* SE ENVIA A LA API LA RESPUESTA DE LA ACTUALIZACION */
        return res.json({
            ok: true,
            message: "Incapacidad actualizada correctamente",
        });


    } catch (error) {
        console.error("🔥 Error en la API de liquidación:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};
