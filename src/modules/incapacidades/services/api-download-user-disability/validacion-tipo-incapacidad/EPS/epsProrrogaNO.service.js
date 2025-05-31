import { getUltimasIncapacidadesIdEmpleado } from "../../../../repositories/api-download-user-disability/incapacidadesHelpers.js";
import { obtenerDiasNoRepetidos, obtenerDiasNoRepetidos2 } from "../../../../utils/api-download-user-disability/calcularDiasLiquidar.js";
import { transformarParametrosPolitica } from "../../../../utils/api-download-user-disability/transformPolicyParameters.js";
import { formatDate2 } from "../../../../utils/formatDate/formatDate.js";
import { calcularDistribucionDias, calcularDistribucionDias2 } from '../GRUPOS/distribucionDias.service.js'
import { getPoliticaGrupoA } from '../../../../repositories/api-download-user-disability/POLITICAS/politicasGrupos.js'
import { entityLiquidation } from "../../../../utils/api-download-user-disability/entityLiquidation.js";
import { updateSettlementTable, updateSettlementTableEmpleador } from "../../../../repositories/api-download-user-disability/eps-liquidacion/updateLiquidacionLicencia.js";

export async function epsProrrogaNO(
  id_liquidacion,
  id_historial,
  proceso_1,
  id_user_session
) 


{

    

    /* ID DEL USER LOGUEADO */
    const ii_usuario = id_user_session;
    console.log("id usuario: ", ii_usuario);


    /*  */
    console.log("Procesando liquidacion para INCAPCIDAD SIN PRORROGA")


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

        /* DIAS A LIQUIDAR */
    let liq_dias_empleador = 0;
    let liq_dias_eps = 0;
    let liq_dias_arl = 0;
    let liq_dias_fondo = 0;
    let liq_dias_eps_fondo = 0;
    let total_dias_liquidar = 0;


    /* VALOR TOTAL A LIQUIDAR POR ENTIDAD */
    let liq_valor_empleador = 0;
    let liq_valor_eps = 0;
    let liq_valor_arl = 0;
    let liq_valor_fondo_pensiones = 0;
    let liq_valor_eps_fondo_pensiones = 0; // <- CAMBIAR DE const A let


    /* PORCENTAJE A LIQUIDAR EMPLEADOR, EPS, ARL, FONDO DE PENSIONES, EPS - FONDO DE PENSIONES */
    let Liq_porcentaje_liquidacion_empleador = 0;
    let Liq_porcentaje_liquidacion_eps = 0;
    let Liq_porcentaje_liquidacion_arl = 0;
    let Liq_porcentaje_liquidacion_fondo_pensiones = 0;
    let Liq_porcentaje_liquidacion_eps_fondo_pensiones = 0;

    let PoliticaGrupoA = 0

    let grupoA = 0
    let grupoB = 0
    let grupoC = 0
    let grupoD = 0
    let grupoE = 0



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


    /* FUNCION PARA CALCULAR Y AGRUPAR CANTIDAD DE DIAS */
    const grupos = calcularDistribucionDias(diasNoRepetidosALiquidar)
    console.log("GRUPOS PARA LIQUIDAR: ", grupos)


    /* VALIDACION GRUPO 1-2 */
    if(grupos.diasGrupo_1a2 > 0){

        /* GUARDAR DATOS */
        grupoA = grupos.diasGrupo_1a2
        console.log("GRUPOA 1-2: ", grupoA)

        
        /* SE ASIGNA LA CANTIDAD DE DÍAS A LIQUIDAR DEL GRUPO A Y SE ASIGNA A LA VARIABLE */
        liquidacion_dias = grupoA


        /* TRAER POLITICA CON LOS DATOS INGRESADOS  */
        PoliticaGrupoA = await getPoliticaGrupoA(
            prorroga,
            dias_laborados_conversion,
            salario_conversion,
            liquidacion_dias,
            tipo_incapacidad,
            origen_incapacidad
        );

        console.log("POLITICA GRUPO A: ", PoliticaGrupoA )


        Liq_porcentaje_liquidacion_empleador = parseFloat(PoliticaGrupoA.porcentaje_liquidacion_empleador) || 0
        console.log("% liquidacion empleador: ", Liq_porcentaje_liquidacion_empleador )


        
        /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE EPS */
        liq_valor_empleador = entityLiquidation(
            proceso_1.data.salario_empleado,
            Liq_porcentaje_liquidacion_empleador,
            diasNoRepetidosALiquidar
        );
        console.log("EPS, valor a liquidar", liq_valor_empleador);


        
        const id_user = id_user_session  //USUARIO QUIEN REGISTRA LA INCAPACIDAD
        const upd_liq_dias_empleador = diasNoRepetidosALiquidar;
        const upd_Liq_porcentaje_liquidacion_empleador = Liq_porcentaje_liquidacion_empleador || 50;
        const upd_liq_valor_empleador = liq_valor_empleador;

        const upd_dias_Laborados = parametros.dias_laborados;        
        const upd_id_liquidacion = id_liquidacion;
        const upd_dias_liquidables_totales = diasNoRepetidosALiquidar;


        console.log("DATOS A LIQUIDAR: ", id_user, upd_liq_dias_empleador, upd_Liq_porcentaje_liquidacion_empleador, upd_liq_valor_empleador, upd_dias_Laborados, upd_id_liquidacion, upd_dias_liquidables_totales)


        /* SE ACTUALIZA LA BASE DE DATOS DE LIQUIDACION  */
        const updateSettlementTableLiq = await updateSettlementTableEmpleador(id_user, upd_liq_dias_empleador, upd_Liq_porcentaje_liquidacion_empleador, upd_liq_valor_empleador, upd_dias_Laborados, upd_id_liquidacion, upd_dias_liquidables_totales)

        console.log("RESPUESTA: ", updateSettlementTableLiq)

    }




}
