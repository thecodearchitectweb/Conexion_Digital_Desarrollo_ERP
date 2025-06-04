import { complementoIncapacidadEmpleador } from "../../../../repositories/api-download-user-disability/complemento-incapacidad/complemento_incapacidad.js";
import { buscarProrrogaConsecutiva } from "../../../../repositories/api-download-user-disability/get_buscar_prorroga_consecutiva.js";
import { getDatosIncapacidadProrroga } from "../../../../repositories/api-download-user-disability/get_incapacidad_prorroga.js";
import { getPoliticaGrupoB } from "../../../../repositories/api-download-user-disability/getPoliticaByParametros.js";
import { getPoliticaGrupoA } from "../../../../repositories/api-download-user-disability/POLITICAS/politicasGrupos.js";
import { updateDisabilitySettlementExtensionHis } from "../../../../repositories/api-download-user-disability/updateDisabilitySettlementExtension.js";
import { entityLiquidation } from "../../../../utils/api-download-user-disability/entityLiquidation.js";
import { transformarParametrosPolitica } from "../../../../utils/api-download-user-disability/transformPolicyParameters.js";
import { formatDate2 } from "../../../../utils/formatDate/formatDate.js";
import { acomuladoDeuda } from "../../acomulado-deuda-incapacidad/acomulado.service.js";
import { calcularDistribucionDias, calcularDistribucionDiasPorProrroga } from "../../calcularDistribucionDiasGrupos.js";
import { obtenerDiasNoRepetidosProrroga } from "../../obtenerDiasNoRepetidos.js";



export async function epsProrrogaSI(id_liquidacion, id_historial,  proceso_1, id_user_session)
{

    let total_dias_liquidar = 0;

    console.log("Procesando liquidacion para INCAPCIDAD CON PRORROGA")

    let sumatoria_incapacidades = 0
    let cumplimiento_politica_grupoB = 'SI'
    let prorroga_grupoB = 'SI'
    let dias_laborados_conversion_grupoB = parametroGrupoB.dias_laborados_conversion
    let salario_conversion_grupoB = parametroGrupoB.salario
    let liquidacion_dias_grupoB  = 0
    let tipo_incapacidad_grupoB = parametroGrupoB.tipo_incapacidad


    /* ID DEL USER LOGUEADO */
    const ii_usuario = id_user_session;
    console.log("id usuario: ", ii_usuario);


    /* TRAEMOS EL ID DE LA INCAPACIDAD EXTENSION QUE NOS DA LA TABLAHISTORIAL */
    const id_incapacidad_prorroga = proceso_1.data.id_incapacidad_extension
    console.log("ID INCAPACIDAD EXTENSION: ", id_incapacidad_prorroga)

    

    /* VALIDACION SI HAY DATOS EN LA PRORROGA */
    if(id_incapacidad_prorroga == null){

        console.log("NO SE ENCONTRO DATOS DE LA PRORROGA SOBRE LA INCAPACIDAD SELECCIONADA, DE ACTUALIZA PRORROGA A 'NO' ")
        
        const actuaizarProrrogaTabHistorial = await updateDisabilitySettlementExtensionHis(id_historial)
        console.log("SE ACTUALIZA PRORROGA A NO: ", actuaizarProrrogaTabHistorial)

    }



    /* SE GENERA LA CONSULTA A LA BASE DE DATOS PARA TRAER DATOS DE LA INCAPACIDAD PRORROGA */
    const datosIncapacidadProrroga = await getDatosIncapacidadProrroga (id_incapacidad_prorroga)
    console.log("DATOS DE LA INCAPACIDAD PRORROGA: ", datosIncapacidadProrroga)    



    /* FORMATEAMOS FECHAS */
    const fecha_inicio_incapacidad_anterior = formatDate2(datosIncapacidadProrroga.fecha_inicio_incapacidad)
    const fecha_final_incapacidad_anterior = formatDate2(datosIncapacidadProrroga.fecha_final_incapacidad)
    const fecha_inicial_incapacidad_liquidar = formatDate2(proceso_1.data.fecha_inicio_incapacidad);
    const fecha_final_incapacidad_liquidar = formatDate2(proceso_1.data.fecha_final_incapacidad);
    
    console.log("FECHAS FORMATEADAS: ", fecha_inicio_incapacidad_anterior, " ", fecha_final_incapacidad_anterior)
    console.log("FECHAS FORMATEADAS: ", fecha_inicial_incapacidad_liquidar, " ", fecha_final_incapacidad_liquidar)    


    /* CONSTRUCCION DEL OBJETO PARA VALIDAR DIAS  */
    const incapacidadAnterior = {
    fecha_inicio_incapacidad: fecha_inicio_incapacidad_anterior,
    fecha_final_incapacidad: fecha_final_incapacidad_anterior
    };

    const incapacidadNueva = {
        fecha_inicio_incapacidad: fecha_inicial_incapacidad_liquidar,
        fecha_final_incapacidad: fecha_final_incapacidad_liquidar
    }; 



    /* SE CALCULA CANTIDAD DE DÍAS A LIQUIDAR CON LAS FECHAS DE LA PRORROGA */
    const diasNoRepetidos = obtenerDiasNoRepetidosProrroga(incapacidadAnterior, incapacidadNueva);
    console.log("Días no repetidos a liquidar por prórroga NUEVA INCAPCIDAD:", diasNoRepetidos.length);
    


    /* SE GUARDA LOS DÍAS REALES A LIQUIDAR */
    total_dias_liquidar = diasNoRepetidos.length
    const diasNoRepetidosALiquidar = total_dias_liquidar
    console.log("DÍAS REALES A LIQUIDAR DE INCAPACIDAD NUEVA: ", diasNoRepetidosALiquidar)



    /* DIAS LIQUIDADOS DE LA INCAPACIDAD ANTERIROR */
    const dias_liquidados_incapacidad_prorroga = datosIncapacidadProrroga.dias_liquidables_totales
    console.log("DIAS LIQUIDADOS DE LA INCAPACIDAD ANTERIROR", dias_liquidados_incapacidad_prorroga)



    /* SE REALIZA BUSQUEDA EN LA TABLA DE PRORROGA PARA VALIDAR SI EXISTE UNA PRORROGA ANTERIOR CONSECUTIVA */
    const validacioTablaProrroga = await buscarProrrogaConsecutiva(id_incapacidad_prorroga)
    console.log("DATOS TRAIDOS DE LA TABLA DE PRORROGA: ", validacioTablaProrroga)    



    /* FILTRO PARA CARGAR LA POLITCA SUGERIDA A LA NUEVA INCAPACIDAD*/
    const parametros = transformarParametrosPolitica(proceso_1.data);
    console.log('Estos son los datos de parametros en las licencias', parametros)
    console.log(" ")


        let prorroga = parametros.prorroga
        let dias_laborados_conversion = parametros.dias_laborados_conversion
        let salario_conversion = parametros.salario
        let liquidacion_dias  = 0
        let tipo_incapacidad = proceso_1.data.tipo_incapacidad
        let origen_incapacidad = proceso_1.data.subtipo_incapacidad

    /* VALIDACION CO PRORROGA CONTINUA */
    if(validacioTablaProrroga){

        /* FUNCIONA PARA CALCULAR Y AGRUPAR CANTIDAD DE DÍAS  Y LOGRAR CALCULAR DE MANERA ADECUADA POR PORCENTAJE 3 - 90, y mayor a 90 */
        const resultado = calcularDistribucionDias(
            validacioTablaProrroga,
            datosIncapacidadProrroga.dias_liquidables_totales,
            diasNoRepetidosALiquidar
        );
        
        sumatoria_incapacidades = resultado.sumatoriaTotal
        console.log("SUMATORIA TOTAL CON INCAPACIDAD ACOMULADA: ", sumatoria_incapacidades)
        console.log("RESULTADO: ", resultado)        
    }



    /* VALIDACION SIN PROROGA CONTINUA */
    if(!validacioTablaProrroga){


        console.log("VALIDACION SIN PROROGA CONTINUA, INICIO CONDICIOAL")

        const resultado = calcularDistribucionDiasPorProrroga(
            diasNoRepetidos, // array de fechas
            datosIncapacidadProrroga.dias_liquidables_totales, // número
            validacioTablaProrroga // puede ser null o un objeto con sumatoria_incapacidades
        );    
        console.log("SIN PRORROGA CONTINUA, SE CALCULA POR GRUPO: ", resultado)
        console.log(" ")
        


            /* VARIABLES PARA EJECUTAR EL RESULTRADO FINAL */
        let liquidacion_dias_grupo_menor_90 = 0
        let Liq_porcentaje_liquidacion_eps_grupoA = 0
        let liq_valor_eps_grupoA = 0
        let PoliticaGrupoA = 0

        let acomuladoDeudaGrupoA = 0


        if(resultado.diasTramo_1a90 > 0 ){


            /* POLITICA PARA APLICAR A MENOR 90 */ 
            liquidacion_dias_grupo_menor_90 = resultado.diasTramo_1a90   // CONST que guarda los días reales a liquidar al 66%  
            console.log("DIAS A LIQUIDAR  GRUPO A: ", liquidacion_dias_grupo_menor_90)


            /* TRAER POLITICA CON LOS DATOS INGRESADOS  */
            PoliticaGrupoA = await getPoliticaGrupoA(
                prorroga,
                dias_laborados_conversion,
                salario_conversion,
                liquidacion_dias_grupo_menor_90,
                tipo_incapacidad,
                origen_incapacidad
            );

            console.log("POLITICA TRAIDA PARA TRAMO 1 - 90: ", PoliticaGrupoA)

             /* TRAER PORCENTAJE A LIQUIDAR POR PARTE DE EPS */
            Liq_porcentaje_liquidacion_eps_grupoA = parseFloat( PoliticaGrupoA.porcentaje_liquidacion_eps  ) || 0;
            console.log("Liq_porcentaje_liquidacion_eps GRUPO A", Liq_porcentaje_liquidacion_eps_grupoA);

            /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE EPS  */
            liq_valor_eps_grupoA = entityLiquidation(
                proceso_1.data.salario_empleado,
                Liq_porcentaje_liquidacion_eps_grupoA,
                liquidacion_dias_grupo_menor_90
            );
            console.log("VALOR A LIQUIDAR POR PARTE DE EPS GRUPO A: ", liq_valor_eps_grupoA);


                    /* CALCULAR EL ACOMULATIVO SI APLICA  EPS PARA QUE EL EMPLEADOR NIVELE*/
            acomuladoDeudaGrupoA = acomuladoDeuda(proceso_1.data.salario_empleado, Liq_porcentaje_liquidacion_eps_grupoA, liquidacion_dias_grupo_menor_90, id_liquidacion)
            console.log("ACOMULADO DEUDA GRUPO A, EPS PRORROGA: ", acomuladoDeudaGrupoA)


            /* GUARDAMOS EN LA BASE DE DATOS SI APLICA */
            if(acomuladoDeudaGrupoA > 0){


                console.log("Entramos al condicional")
                /* FUNCION PARA GUARDAR EN BASE DE DATOS */
                const complemento = await complementoIncapacidad(acomuladoDeudaGrupoA, id_liquidacion)
                console.log("COMPLEMENTO INCAPACIDAD GRUPO E: ", complemento)

            } 
            
        }


        /* VARIABLES PARA EJECUTAR EL RESULTRADO FINAL */
        let dias_grupo_91a180  = 0
        let Liq_porcentaje_liquidacion_eps_grupoB = 0
        let liq_valor_eps_grupoB = 0
        let PoliticaGrupoB = 0

        if(resultado.diasTramo_91a180 > 0){


            /* POLITICA PARA APLICAR A MAYOR 90 */ 
            dias_grupo_91a180 = resultado.diasTramo_91a180   
            console.log("DIAS A LIQUIDAR  B: ", dias_grupo_91a180)


            /* CALCULAR DIAS PARA VERIFICAR POLITICAS CON MÁS PRECISION */
            liquidacion_dias_grupoB = resultado.sumatoriaPrevia + resultado.diasTramo_1a90 +resultado.diasTramo_91a180
            console.log("liquidacion_dias_grupoB: ", liquidacion_dias_grupoB)





        }



    }
        

        
}



 