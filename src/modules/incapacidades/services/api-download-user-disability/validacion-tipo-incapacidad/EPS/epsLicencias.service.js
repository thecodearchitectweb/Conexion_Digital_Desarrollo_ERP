import { transformarParametrosPolitica } from "../../../../utils/api-download-user-disability/transformPolicyParameters.js";
import { getPoliticaLicencia } from '../../../../repositories/api-download-user-disability/getPoliticaByParametros.js'
import { getUltimasIncapacidadesIdEmpleado } from '../../../../repositories/api-download-user-disability/incapacidadesHelpers.js'
import { obtenerDiasNoRepetidos, obtenerDiasNoRepetidos2  } from "../../../../utils/api-download-user-disability/calcularDiasLiquidar.js";
import { formatDate2 } from "../../../../utils/formatDate/formatDate.js";
import { entityLiquidation } from "../../../../utils/api-download-user-disability/entityLiquidation.js";
import { updateDownloadStatus } from "../../../../repositories/api-download-user-disability/updateLiquidacoinTableIncapacity.js";
import { updateSettlementTable } from '../../../../repositories/api-download-user-disability/eps-liquidacion/updateLiquidacionLicencia.js'



export async function epsLicencias(id_liquidacion, id_historial,  proceso_1, id_user_session) {
    try {


        const ii_usuario = id_user_session
        console.log("id usuario: ", ii_usuario)
        

        console.log("Procesando liquidacion para licencia de maternidad o paternidad")

        /* FILTRO PARA CARGAR LA POLITCA SUGERIDA A LA NUEVA INCAPACIDAD*/
        const parametros = transformarParametrosPolitica(proceso_1.data);
        console.log('Estos son los datos de parametros en las licencias', parametros)


        let prorroga = parametros.prorroga
        let dias_laborados_conversion = parametros.dias_laborados_conversion
        let salario_conversion = parametros.salario
        let liquidacion_dias  = 0
        let tipo_incapacidad = proceso_1.data.tipo_incapacidad
        let origen_incapacidad = proceso_1.data.subtipo_incapacidad
        let diasNoRepetidosALiquidar = 0
        let Liq_porcentaje_liquidacion_eps


        console.log("prorroga :",prorroga )
        console.log(" dias_laborados_conversion:",dias_laborados_conversion )
        console.log(" salario_conversion:",salario_conversion )
        console.log("liquidacion_dias :",liquidacion_dias )
        console.log(" tipo_incapacidad:",tipo_incapacidad )
        console.log("origen_incapacidad :", origen_incapacidad)


        /* TRAER POLITICA CON LOS DATOS INGRESADOS  */
        const politica = await getPoliticaLicencia(
            prorroga,
            dias_laborados_conversion,
            salario_conversion,
            tipo_incapacidad,
            origen_incapacidad
        );

        console.log("POLITICA LICENCIA: ", politica)

        if (!politica) {
            // Si no hay política, devolvemos un error controlado
            return {
                success: false,
                message: 'No se encontró una política aplicable para la licencia.',
                data: null
            };
        }


        /* FUNCION QUE TRAAE LA ULTIMA INCAPACIDAD DEL EMPLEADO */
        const data_incapacidades_liquidadas = await getUltimasIncapacidadesIdEmpleado(proceso_1.id_empleado);
        console.log("data_incapacidades_liquidadas", data_incapacidades_liquidadas);


        /* CON INCAPACIDAD ANTERIOR */
        if(data_incapacidades_liquidadas){
            
            /* TRAER LAS FECHAS DE LA INCAPACIDAD ANTERIOR Y LA NUEVA INCAPACIDAD */
            const fecha_inicio_incapacidad_anterior = data_incapacidades_liquidadas?.fecha_inicio_incapacidad;
            const fecha_final_incapacidad_anterior = data_incapacidades_liquidadas?.fecha_final_incapacidad;
            const fecha_inicial_incapacidad_liquidar = formatDate2(proceso_1.data.fecha_inicio_incapacidad);
            const fecha_final_incapacidad_liquidar = formatDate2(proceso_1.data.fecha_final_incapacidad);

            console.log("fecha_inicio_incapacidad_anterior", fecha_inicio_incapacidad_anterior);
            console.log("fecha_final_incapacidad_anterior", fecha_final_incapacidad_anterior);
            console.log("fecha_inicial_incapacidad_liquidar", fecha_inicial_incapacidad_liquidar);
            console.log("fecha_final_incapacidad_liquidar", fecha_final_incapacidad_liquidar);


            /* CONSTRUCCION DEL OBJETO PARA VALIDAR DIAS */
            const incapacidadA = {
                fecha_inicio_incapacidad: fecha_inicio_incapacidad_anterior,
                fecha_final_incapacidad: fecha_final_incapacidad_anterior
            };
            const incapacidadB = {
                fecha_inicio_incapacidad: fecha_inicial_incapacidad_liquidar,
                fecha_final_incapacidad: fecha_final_incapacidad_liquidar
            };


            /* CALCULAR LOS DÍAS UNICOS NO REPETIDOS*/
            const diasNoRepetidos = obtenerDiasNoRepetidos(incapacidadA, incapacidadB);
            console.log("FUNCION DIAS NO REPETIDOS:", diasNoRepetidos.length);


            /*  DÍAS REALES A LIQUIDAR */
            diasNoRepetidosALiquidar = diasNoRepetidos.length

        }
        

        /* SIN INCAPACIDAD ANTERIOR */
        if(!data_incapacidades_liquidadas){
           
            console.log(">> No hay incapacidad anterior, tomando todos los días.");

            const fecha_inicial_incapacidad_liquidar = formatDate2(proceso_1.data.fecha_inicio_incapacidad);
            const fecha_final_incapacidad_liquidar = formatDate2(proceso_1.data.fecha_final_incapacidad);
            
            console.log("fecha_inicial_incapacidad_liquidar", fecha_inicial_incapacidad_liquidar);
            console.log("fecha_final_incapacidad_liquidar", fecha_final_incapacidad_liquidar);


            const incapacidadB = {
                fecha_inicio_incapacidad: fecha_inicial_incapacidad_liquidar,
                fecha_final_incapacidad: fecha_final_incapacidad_liquidar
            };


            /* CALCULAR LOS DÍAS UNICOS NO REPETIDOS*/
            const diasNoRepetidos = obtenerDiasNoRepetidos2(incapacidadB);
            console.log("FUNCION DIAS NO REPETIDOS:", diasNoRepetidos.length);


            /*  DÍAS REALES A LIQUIDAR */
            diasNoRepetidosALiquidar = diasNoRepetidos.length

        }
 

        console.log("DÍAS REALES A LIQUIDAR DE INCAPACIDAD NUEVA: ", diasNoRepetidosALiquidar)


        /* TRAER PORCENTAJE A LIQUIDAR POR PARTE DE EPS */
        Liq_porcentaje_liquidacion_eps = parseFloat( politica.porcentaje_liquidacion_eps  ) || 0;
        console.log("Liq_porcentaje_liquidacion_eps", Liq_porcentaje_liquidacion_eps);



        /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE EPS */
        const liq_valor_EPS = entityLiquidation(
            proceso_1.data.salario_empleado,
            Liq_porcentaje_liquidacion_eps,
            diasNoRepetidosALiquidar
        );
        console.log("EPS, valor a liquidar", liq_valor_EPS);



        const id_user = id_user_session  //USUARIO QUIEN REGISTRA LA INCAPACIDAD
        const upd_liq_dias_eps = diasNoRepetidosALiquidar;
        const upd_Liq_porcentaje_liquidacion_eps = Liq_porcentaje_liquidacion_eps || 50;
        const upd_liq_valor_eps = liq_valor_EPS;
        const upd_dias_Laborados = parametros.dias_laborados;
        const upd_id_liquidacion = id_liquidacion;
        const upd_dias_liquidables_totales = diasNoRepetidosALiquidar;

        console.log(" upd_liq_dias_eps ", upd_liq_dias_eps)
        console.log(" upd_Liq_porcentaje_liquidacion_eps ",upd_Liq_porcentaje_liquidacion_eps )
        console.log(" upd_liq_valor_eps ", upd_liq_valor_eps)
        console.log(" upd_dias_Laborados ",upd_dias_Laborados )
        console.log(" upd_id_liquidacion ", upd_id_liquidacion)
        console.log(" upd_dias_liquidables_totales ", upd_dias_liquidables_totales)
        console.log(" id_user_session ", id_user)



        /* SE ACTUALIZA LA BASE DE DATOS DE LIQUIDACION  */
        const updateSettlementTableLiq = await updateSettlementTableEmpleador(id_user, upd_liq_dias_eps, upd_Liq_porcentaje_liquidacion_eps, upd_liq_valor_eps, upd_dias_Laborados, upd_id_liquidacion, upd_dias_liquidables_totales)


        console.log("RESPUESTA: ", updateSettlementTableLiq)


        return {
            success: true,
            message: 'Liquidación EPS actualizada correctamente.'
        };



    } catch (error) {
        console.error("❌ Error repo updateSettlementTable:", error);
        throw error;  // lo subes al service padre
    }
}



