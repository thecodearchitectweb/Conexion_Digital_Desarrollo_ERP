import { getUltimasIncapacidadesIdEmpleado } from "../../../../repositories/api-download-user-disability/incapacidadesHelpers.js";
import { obtenerDiasNoRepetidos, obtenerDiasNoRepetidos2 } from "../../../../utils/api-download-user-disability/calcularDiasLiquidar.js";
import { transformarParametrosPolitica } from "../../../../utils/api-download-user-disability/transformPolicyParameters.js";
import { formatDate2 } from "../../../../utils/formatDate/formatDate.js";
import { calcularDistribucionDias, calcularDistribucionDias2 } from '../GRUPOS/distribucionDias.service.js'
import { getPoliticaGrupoA, getPoliticaGrupoB, getPoliticaGrupoC, getPoliticaGrupoD, getPoliticaGrupoE } from '../../../../repositories/api-download-user-disability/POLITICAS/politicasGrupos.js'
import { entityLiquidation } from "../../../../utils/api-download-user-disability/entityLiquidation.js";
import { updateSettlementTable, updateSettlementTableEmpleador, updateSettlementTableEps, updateSettlementTableEps_50, updateSettlementTableFondoPensiones, updateSettlementTableEpsFondoPensiones } from "../../../../repositories/api-download-user-disability/eps-liquidacion/updateLiquidacion.js";
import { acomuladoDeuda } from '../../acomulado-deuda-incapacidad/acomulado.service.js'
import { complementoIncapacidadEmpleador, complementoIncapacidad, complementoIncapacidadEPS_50, complementoIncapacidadFondoPensiones, complementoIncapacidadEPSFondoPensiones } from '../../../../repositories/api-download-user-disability/complemento-incapacidad/complemento_incapacidad.js'




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

    let acomuladoDeudaGrupoA = 0
    let acomuladoDeudaGrupoB = 0
    let acomuladoDeudaGrupoC = 0
    let acomuladoDeudaGrupoD = 0
    let acomuladoDeudaGrupoE = 0

    let PoliticaGrupoA = 0
    let PoliticaGrupoB = 0
    let PoliticaGrupoC = 0
    let PoliticaGrupoD = 0
    let PoliticaGrupoE = 0

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
        console.log("GRUPOA A: ", grupoA)

        
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
        console.log("liquidacion_dias: ", liquidacion_dias )


        /* PORCENTAJE A LIQUIDAR SEGUN PRORROGA */
        Liq_porcentaje_liquidacion_empleador = parseFloat(PoliticaGrupoA.porcentaje_liquidacion_empleador) || 0
        console.log("% liquidacion empleador: ", Liq_porcentaje_liquidacion_empleador )


        
        /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE EMPLEADOR */
        liq_valor_empleador = entityLiquidation(
            proceso_1.data.salario_empleado,
            Liq_porcentaje_liquidacion_empleador,
            liquidacion_dias
        );
        console.log("EPS, valor a liquidar", liq_valor_empleador);


        /* CALCULAR EL ACOMULATIVO SI APLICA  EPS PARA QUE EL EMPLEADOR NIVELE*/
        acomuladoDeudaGrupoA = acomuladoDeuda(proceso_1.data.salario_empleado, Liq_porcentaje_liquidacion_empleador, grupoA, id_liquidacion)
        console.log("ACOMULADO DEUDA GRUPO B: ", acomuladoDeudaGrupoA)


        /* GUARDAMOS EN LA BASE DE DATOS SI APLICA */
        if(acomuladoDeudaGrupoA > 0){


            console.log("Entramos al condicional")
            /* FUNCION PARA GUARDAR EN BASE DE DATOS */
            const complemento = await complementoIncapacidadEmpleador(acomuladoDeudaGrupoA, id_liquidacion)
            console.log("COMPLEMENTO INCAPACIDAD GRUPO E: ", complemento)

        } 


        /* CONSTANTES PARA INGRESAR DATOS A LA BASE DE DATOS */
        const id_user = id_user_session  //USUARIO QUIEN REGISTRA LA INCAPACIDAD
        const upd_liq_dias_empleador = liquidacion_dias;
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



    /* DÍAS 3 - 90  EPS */
    if(grupos.diasGrupo_2a90 > 0){
         
        console.log(" ")

        /* GUARDAR DATOS */
        grupoB = grupos.diasGrupo_2a90
        console.log("GRUPO B: ", grupoB)


        /* SE ASIGNA LA CANTIDAD DE DÍAS B LIQUIDAR DEL GRUPO A Y SE ASIGNA A LA VARIABLE */
         liquidacion_dias = grupoB


        /* TRAER POLITICA CON LOS DATOS INGRESADOS  */
        PoliticaGrupoB = await getPoliticaGrupoB(
            prorroga,
            dias_laborados_conversion,
            salario_conversion,
            liquidacion_dias,
            tipo_incapacidad,
            origen_incapacidad
        );


        console.log("POLITICA GRUPO B: ", PoliticaGrupoB )
        console.log("liquidacion_dias: ", liquidacion_dias )


        /* PORCENTAJE A LIQUIDAR SEGUN PRORROGA */
        Liq_porcentaje_liquidacion_eps = parseFloat(PoliticaGrupoB.porcentaje_liquidacion_eps) || 0
        console.log("% liquidacion EPS: ", Liq_porcentaje_liquidacion_eps )


        /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE EPS */
        liq_valor_eps = entityLiquidation(
            proceso_1.data.salario_empleado,
            Liq_porcentaje_liquidacion_eps,
            liquidacion_dias
        );
        console.log("EPS, valor a liquidar", liq_valor_eps);


        /* CALCULAR EL ACOMULATIVO SI APLICA  EPS PARA QUE EL EMPLEADOR NIVELE*/
        acomuladoDeudaGrupoB = acomuladoDeuda(proceso_1.data.salario_empleado, Liq_porcentaje_liquidacion_eps, grupoB, id_liquidacion)
        console.log("ACOMULADO DEUDA GRUPO B: ", acomuladoDeudaGrupoB)


        /* GUARDAMOS EN LA BASE DE DATOS SI APLICA */
        if(acomuladoDeudaGrupoB > 0){


            console.log("Entramos al condicional")
            /* FUNCION PARA GUARDAR EN BASE DE DATOS */
            const complemento = await complementoIncapacidad(acomuladoDeudaGrupoB, id_liquidacion)
            console.log("COMPLEMENTO INCAPACIDAD GRUPO B: ", complemento)

        }            

        /* CONSTANTES PARA INGRESAR DATOS A LA BASE DE DATOS */
        const id_user = id_user_session  //USUARIO QUIEN REGISTRA LA INCAPACIDAD
        const upd_liq_dias_eps = liquidacion_dias;
        const upd_Liq_porcentaje_liquidacion_eps = Liq_porcentaje_liquidacion_eps || 50;
        const upd_liq_valor_eps = liq_valor_eps;

        const upd_dias_Laborados = parametros.dias_laborados;        
        const upd_id_liquidacion = id_liquidacion;
        const upd_dias_liquidables_totales = diasNoRepetidosALiquidar;

        console.log("DATOS A LIQUIDAR GRUPO B: ", id_user, upd_liq_dias_eps, upd_Liq_porcentaje_liquidacion_eps, upd_liq_valor_eps, upd_dias_Laborados, upd_id_liquidacion, upd_dias_liquidables_totales)


        
        /* SE ACTUALIZA LA BASE DE DATOS DE LIQUIDACION  */
        const updateSettlementTableLiq = await updateSettlementTableEps(id_user, upd_liq_dias_eps, upd_Liq_porcentaje_liquidacion_eps, upd_liq_valor_eps, upd_dias_Laborados, upd_id_liquidacion, upd_dias_liquidables_totales)

        console.log("RESPUESTA: ", updateSettlementTableLiq)



    }


    /* DIAS 91 - 180 EPS */
    if(grupos.diasGrupo_91a180 > 0){


        console.log(" ")

        /* GUARDAR DATOS */
        grupoC = grupos.diasGrupo_91a180
        console.log("GRUPO C: ", grupoC)
        
        
        /* SE ASIGNA LA CANTIDAD DE DÍAS A LIQUIDAR DEL GRUPO C Y SE ASIGNA A LA VARIABLE */
         liquidacion_dias = grupoA + grupoB + grupoC


        /* TRAER POLITICA CON LOS DATOS INGRESADOS  */
        PoliticaGrupoC = await getPoliticaGrupoC(
            prorroga,
            dias_laborados_conversion,
            salario_conversion,
            liquidacion_dias,
            tipo_incapacidad,
            origen_incapacidad
        );


        console.log("POLITICA GRUPO C: ", PoliticaGrupoC )
        console.log("liquidacion_dias: ", grupoC, liquidacion_dias )


        /* PORCENTAJE A LIQUIDAR SEGUN PRORROGA */
        Liq_porcentaje_liquidacion_eps = parseFloat(PoliticaGrupoC.porcentaje_liquidacion_eps) || 0
        console.log("% liquidacion EPS: ", Liq_porcentaje_liquidacion_eps )


        /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE EPS */
        liq_valor_eps = entityLiquidation(
            proceso_1.data.salario_empleado,
            Liq_porcentaje_liquidacion_eps,
            grupoC
        );
        console.log("EPS, valor a liquidar", liq_valor_eps);



        /* CALCULAR EL ACOMULATIVO SI APLICA  EPS PARA QUE EL EMPLEADOR NIVELE*/
        acomuladoDeudaGrupoC = acomuladoDeuda(proceso_1.data.salario_empleado, Liq_porcentaje_liquidacion_eps, grupoC, id_liquidacion)
        console.log("ACOMULADO DEUDA GRUPO B: ", acomuladoDeudaGrupoC)


        /* GUARDAMOS EN LA BASE DE DATOS SI APLICA */
        if(acomuladoDeudaGrupoC > 0){


            console.log("Entramos al condicional")
            /* FUNCION PARA GUARDAR EN BASE DE DATOS */
            const complemento = await complementoIncapacidadEPS_50(acomuladoDeudaGrupoC, id_liquidacion)
            console.log("COMPLEMENTO INCAPACIDAD GRUPO B: ", complemento)

        }         



        /* CONSTANTES PARA INGRESAR DATOS A LA BASE DE DATOS */
        const id_user = id_user_session  //USUARIO QUIEN REGISTRA LA INCAPACIDAD
        const upd_liq_dias_eps = grupoC;
        const upd_Liq_porcentaje_liquidacion_eps = Liq_porcentaje_liquidacion_eps || 50;
        const upd_liq_valor_eps = liq_valor_eps;

        const upd_dias_Laborados = parametros.dias_laborados;        
        const upd_id_liquidacion = id_liquidacion;
        const upd_dias_liquidables_totales = diasNoRepetidosALiquidar;

        
        /* SE ACTUALIZA LA BASE DE DATOS DE LIQUIDACION  */
        const updateSettlementTableLiq = await updateSettlementTableEps_50(id_user, upd_liq_dias_eps, upd_Liq_porcentaje_liquidacion_eps, upd_liq_valor_eps, upd_dias_Laborados, upd_id_liquidacion, upd_dias_liquidables_totales)

        console.log("RESPUESTA: ", updateSettlementTableLiq)

    }


    /* DIAS 181 - 540 */
    if(grupos.diasGrupo_181a540 > 0){


        console.log(" ")
        
        /* GUARDAR DATOS */
        grupoD = grupos.diasGrupo_181a540
        console.log("GRUPO D: ", grupoD)


        /* SE ASIGNA LA CANTIDAD DE DÍAS A LIQUIDAR DEL GRUPO C Y SE ASIGNA A LA VARIABLE */
        liquidacion_dias = grupoA + grupoB + grupoC + grupoD


        /* TRAER POLITICA CON LOS DATOS INGRESADOS  */
        PoliticaGrupoD = await getPoliticaGrupoD(
            prorroga,
            dias_laborados_conversion,
            salario_conversion,
            liquidacion_dias,
            tipo_incapacidad,
            origen_incapacidad
        );        


        console.log("POLITICA GRUPO C: ", PoliticaGrupoD )
        console.log("liquidacion_dias: ", grupoD, liquidacion_dias )        


        /* PORCENTAJE A LIQUIDAR SEGUN PRORROGA */
        Liq_porcentaje_liquidacion_fondo_pensiones = parseFloat(PoliticaGrupoD.porcentaje_liquidacion_fondo_pensiones) || 50
        console.log("% liquidacion FONDO DE PENSIONES: ", Liq_porcentaje_liquidacion_fondo_pensiones )        


        /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE FONDO DE PENSIONES */
        liq_valor_fondo_pensiones = entityLiquidation(
            proceso_1.data.salario_empleado,
            Liq_porcentaje_liquidacion_fondo_pensiones,
            grupoD
        );
        console.log("FONDO DE PENSIONES, valor a liquidar", liq_valor_fondo_pensiones);    
        
        



        /* CALCULAR EL ACOMULATIVO SI APLICA  EPS PARA QUE EL EMPLEADOR NIVELE*/
        acomuladoDeudaGrupoD = acomuladoDeuda(proceso_1.data.salario_empleado, Liq_porcentaje_liquidacion_fondo_pensiones, grupoD, id_liquidacion)
        console.log("ACOMULADO DEUDA GRUPO B: ", acomuladoDeudaGrupoD)


        /* GUARDAMOS EN LA BASE DE DATOS SI APLICA */
        if(acomuladoDeudaGrupoD > 0){


            console.log("Entramos al condicional")
            /* FUNCION PARA GUARDAR EN BASE DE DATOS */
            const complemento = await complementoIncapacidadFondoPensiones(acomuladoDeudaGrupoD, id_liquidacion)
            console.log("COMPLEMENTO INCAPACIDAD GRUPO B: ", complemento)

        }           




        /* CONSTANTES PARA INGRESAR DATOS A LA BASE DE DATOS */
        const id_user = id_user_session  //USUARIO QUIEN REGISTRA LA INCAPACIDAD
        const upd_liq_dias_fondo_pensiones = grupoD;
        const upd_Liq_porcentaje_liquidacion_fondo_pensiones = Liq_porcentaje_liquidacion_fondo_pensiones || 50;
        const upd_liq_valor_fondo_pensiones = liq_valor_fondo_pensiones;

        const upd_dias_Laborados = parametros.dias_laborados;        
        const upd_id_liquidacion = id_liquidacion;
        const upd_dias_liquidables_totales = diasNoRepetidosALiquidar;        


        /* SE ACTUALIZA LA BASE DE DATOS DE LIQUIDACION  */
        const updateSettlementTableLiq = await updateSettlementTableFondoPensiones(id_user, upd_liq_dias_fondo_pensiones, upd_Liq_porcentaje_liquidacion_fondo_pensiones, upd_liq_valor_fondo_pensiones, upd_dias_Laborados, upd_id_liquidacion, upd_dias_liquidables_totales)

        console.log("RESPUESTA: ", updateSettlementTableLiq)

    }


    /* DÍAS 541 + */
    if(grupos.diasGrupo_541plus > 0){


        console.log(" ")
        

        /* GUARDAR DATOS */
        grupoE = grupos.diasGrupo_541plus
        console.log("GRUPO E: ", grupoE)        


        /* SE ASIGNA LA CANTIDAD DE DÍAS A LIQUIDAR DEL GRUPO C Y SE ASIGNA A LA VARIABLE */
        liquidacion_dias = grupoA + grupoB + grupoC + grupoD + grupoE 


        /* TRAER POLITICA CON LOS DATOS INGRESADOS  */
        PoliticaGrupoE = await getPoliticaGrupoE(
            prorroga,
            dias_laborados_conversion,
            salario_conversion,
            liquidacion_dias,
            tipo_incapacidad,
            origen_incapacidad
        );     


        console.log("POLITICA GRUPO C: ", PoliticaGrupoE )
        console.log("liquidacion_dias: ", grupoE, liquidacion_dias )    
        
        
        /* PORCENTAJE A LIQUIDAR SEGUN PRORROGA */
        Liq_porcentaje_liquidacion_eps_fondo_pensiones = parseFloat(PoliticaGrupoE.porcentaje_liquidacion_eps_fondo_pensiones) || 50
        console.log("% liquidacion EPS / FONDO DE PENSIONES: ", Liq_porcentaje_liquidacion_eps_fondo_pensiones )         


        /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE FONDO DE PENSIONES */
        liq_valor_eps_fondo_pensiones = entityLiquidation(
            proceso_1.data.salario_empleado,
            Liq_porcentaje_liquidacion_eps_fondo_pensiones,
            grupoE
        );
        console.log("EPS / FONDO DE PENSIONES, valor a liquidar", liq_valor_eps_fondo_pensiones);    
                



        /* CALCULAR EL ACOMULATIVO SI APLICA  EPS PARA QUE EL EMPLEADOR NIVELE*/
        acomuladoDeudaGrupoE = acomuladoDeuda(proceso_1.data.salario_empleado, Liq_porcentaje_liquidacion_eps_fondo_pensiones, grupoE, id_liquidacion)
        console.log("ACOMULADO DEUDA GRUPO B: ", acomuladoDeudaGrupoE)


        /* GUARDAMOS EN LA BASE DE DATOS SI APLICA */
        if(acomuladoDeudaGrupoE > 0){


            console.log("Entramos al condicional")
            /* FUNCION PARA GUARDAR EN BASE DE DATOS */
            const complemento = await complementoIncapacidadEPSFondoPensiones(acomuladoDeudaGrupoE, id_liquidacion)
            console.log("COMPLEMENTO INCAPACIDAD GRUPO E: ", complemento)

        }   




        /* CONSTANTES PARA INGRESAR DATOS A LA BASE DE DATOS */
        const id_user = id_user_session  //USUARIO QUIEN REGISTRA LA INCAPACIDAD
        const upd_liq_dias_eps_fondo_pensiones = grupoE;
        const upd_Liq_porcentaje_liquidacion_eps_fondo_pensiones = Liq_porcentaje_liquidacion_eps_fondo_pensiones || 50;
        const upd_liq_valor_eps_fondo_pensiones = liq_valor_eps_fondo_pensiones;

        const upd_dias_Laborados = parametros.dias_laborados;        
        const upd_id_liquidacion = id_liquidacion;
        const upd_dias_liquidables_totales = diasNoRepetidosALiquidar;           



        /* SE ACTUALIZA LA BASE DE DATOS DE LIQUIDACION  */
        const updateSettlementTableLiq = await updateSettlementTableEpsFondoPensiones(id_user, upd_liq_dias_eps_fondo_pensiones, upd_Liq_porcentaje_liquidacion_eps_fondo_pensiones, upd_liq_valor_eps_fondo_pensiones, upd_dias_Laborados, upd_id_liquidacion, upd_dias_liquidables_totales)

        console.log("RESPUESTA: ", updateSettlementTableLiq)        
    }


    // Devuelves directamente el objeto que vino de epsLicencias
    return {
        success: true,
        message: 'Liquidación de incapacidad procesada'        
    };


}
