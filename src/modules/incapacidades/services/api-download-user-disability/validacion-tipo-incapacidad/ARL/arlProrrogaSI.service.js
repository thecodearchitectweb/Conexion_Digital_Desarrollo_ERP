import { complementoIncapacidadARL } from "../../../../repositories/api-download-user-disability/complemento-incapacidad/complemento_incapacidad.js"
import { buscarProrrogaConsecutivaARL } from "../../../../repositories/api-download-user-disability/get_buscar_prorroga_consecutiva.js"
import { getDatosIncapacidadProrrogaARL } from "../../../../repositories/api-download-user-disability/get_incapacidad_prorroga.js"
import { updateTablaProrrogaDB } from "../../../../repositories/api-download-user-disability/insert_tabla_prorroga_DB.js"
import { updateDownloadStatus } from "../../../../repositories/api-download-user-disability/updateLiquidacoinTableIncapacity.js"
import { updateSettlementTable } from "../../../../repositories/api-download-user-disability/updateSettlementTable.js"
import { entityLiquidation } from "../../../../utils/api-download-user-disability/entityLiquidation.js"
import { transformarParametrosPolitica } from "../../../../utils/api-download-user-disability/transformPolicyParameters.js"
import { formatDate2 } from "../../../../utils/formatDate/formatDate.js"
import { acomuladoDeuda } from "../../acomulado-deuda-incapacidad/acomulado.service.js"
import { obtenerDiasNoRepetidosProrroga } from "../../obtenerDiasNoRepetidos.js"

export async function arlProrrogaSI(id_liquidacion, id_historial,  proceso_1, id_user_session){

    try {
        
        console.log("INGRESO MODULO INCAPACIDAD ARL CON PRORROGA: ", id_liquidacion, id_historial,  proceso_1, id_user_session)

        let user_id_session = id_user_session
        console.log("Usuario ID: ", user_id_session)

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
        
        /* TRAEMOS EL ID DE LA INCAPACIDAD EXTENSION QUE NOS DA LA TABLAHISTORIAL */
        const id_incapacidad_prorroga = proceso_1.data.id_incapacidad_extension
        console.log("ID INCAPACIDAD EXTENSION: ", id_incapacidad_prorroga)


        /* SE GENERA LA CONSULTA A LA BASE DE DATOS LIQUIDACION PARA TRAER DATOS DE LA INCAPACIDAD PRORROGA */
        const datosIncapacidadProrrogaARL = await getDatosIncapacidadProrrogaARL (id_incapacidad_prorroga)
        console.log("DATOS DE LA INCAPACIDAD PRORROGA, getDatosIncapacidadProrrogaARL: ", datosIncapacidadProrrogaARL)

        
        /* INCAPACIDAD CON PRORROGA*/
        if(datosIncapacidadProrrogaARL){

            console.log("---> datos ProrrogaARL: ", datosIncapacidadProrrogaARL)
            
            /* FORMATEAMOS FECHAS */
            const fecha_inicio_incapacidad_anterior = formatDate2(datosIncapacidadProrrogaARL.fecha_inicio_incapacidad)
            const fecha_final_incapacidad_anterior = formatDate2(datosIncapacidadProrrogaARL.fecha_final_incapacidad)
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
            const diasNoRepetidosARL = obtenerDiasNoRepetidosProrroga(incapacidadAnterior, incapacidadNueva);
            console.log("Días no repetidos a liquidar por prórroga NUEVA INCAPCIDAD ARL:", diasNoRepetidosARL.length);
        

            /* SE GUARDA LOS DÍAS REALES A LIQUIDAR */
            total_dias_liquidar = diasNoRepetidosARL.length
            const diasNoRepetidosALiquidarARL = total_dias_liquidar

            console.log("DÍAS REALES A LIQUIDAR DE INCAPACIDAD NUEVA ARL: ", diasNoRepetidosALiquidarARL)


            /* DIAS LIQUIDADOS DE LA INCAPACIDAD ANTERIOR */
            const dias_liquidados_incapacidad_prorroga = datosIncapacidadProrrogaARL.dias_liquidables_totales
            console.log("DIAS LIQUIDADOS DE LA INCAPACIDAD ANTERIOR", dias_liquidados_incapacidad_prorroga)


            /* SE REALIZA BUSQUEDA EN LA TABLA DE PRORROGA PARA VALIDAR SI EXISTE UNA PRORROGA ANTERIOR CONSECUTIVA */
            const validacioTablaProrroga = await buscarProrrogaConsecutivaARL(id_incapacidad_prorroga)
            console.log("DATOS TRAIDOS DE LA TABLA DE PRORROGA: ", validacioTablaProrroga)

            
            /* FILTRO PARA CARGAR LA POLITCA SUGERIDA A LA NUEVA INCAPACIDAD*/
            const parametroGrupoARL = transformarParametrosPolitica(proceso_1.data);

            console.log("FILTRO PARA CARGAR LA INCAPACIDAD, parametroGrupoARL: ", parametroGrupoARL)
            

            /* VARIABLES PARA CONSULTAR POLITICAS */
            let cumplimiento_politica = 'SI'
            let prorroga = 'SI'
            let dias_laborados_conversion_grupoARL = parametroGrupoARL.dias_laborados_conversion
            let salario_conversion_grupoARL = parametroGrupoARL.salario
            let liquidacion_dias_grupoARL  = 0
            let tipo_incapacidad_grupoARL = parametroGrupoARL.tipo_incapacidad

            console.log("dias_laborados_conversion_grupoARL: ", dias_laborados_conversion_grupoARL)
            console.log("salario_conversion_grupoARL: ", salario_conversion_grupoARL)
            console.log("tipo_incapacidad_grupoARL: ", tipo_incapacidad_grupoARL)



            console.log("")
            console.log("")
            console.log("")
            console.log("")


            console.log("DATOS EN LA TABLA PRORROGA TRUE")
            /* VERIFICAR SI HAY ACOMULADO EN TABLA PRORROGA PARA SUMAR EL TOTAL */
            if(validacioTablaProrroga){
                
                console.log("DATOS EN LA TABLA PRORROGA TRUE")

                /* SE DA LA SUMATORIA ACOMULADA CON LA TABLA PRORROGA Y SE PAGA AL 100% AL SER ARL */
                const sumatoria_incapacidadesARL = validacioTablaProrroga.sumatoria_incapacidades + diasNoRepetidosALiquidarARL
                console.log("SUMATORIA TOTAL CON INCAPACIDAD ACOMULADA: ", sumatoria_incapacidadesARL)

                
                /* TRAER PORCENTAJE A LIQUIDAR POR PARTE DE EPS */
                let Liq_porcentaje_liquidacion_ARL = parseFloat( parametroGrupoARL.porcentaje_liquidacion_arl  ) || 100;
                console.log("Liq_porcentaje_liquidacion_eps_grupoD", Liq_porcentaje_liquidacion_ARL);


                /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE ARL  */
                let liq_valor_ARL = entityLiquidation(
                    proceso_1.data.salario_empleado,
                    Liq_porcentaje_liquidacion_ARL,
                    total_dias_liquidar
                );
                console.log("VALOR A LIQUIDAR POR PARTE DE ARL: ", liq_valor_ARL);



                /* CALCULAR EL ACOMULATIVO SI APLICA  EPS PARA QUE EL EMPLEADOR NIVELE*/
                acomuladoDeudaGrupoA = acomuladoDeuda(proceso_1.data.salario_empleado, Liq_porcentaje_liquidacion_ARL, total_dias_liquidar, id_liquidacion)
                console.log("ACOMULADO DEUDA GRUPO B: ", acomuladoDeudaGrupoA)


                /* GUARDAMOS EN LA BASE DE DATOS SI APLICA */
                if(acomuladoDeudaGrupoA > 0){


                    console.log("Entramos al condicional")
                    /* FUNCION PARA GUARDAR EN BASE DE DATOS */
                    const complemento = await complementoIncapacidadARL(acomuladoDeudaGrupoA, id_liquidacion)
                    console.log("COMPLEMENTO INCAPACIDAD GRUPO E: ", complemento)

                }
                
                
                
                /* GUARDAR LOS DATOS EN LA BASE DE DATOS VTABLA LIQUIDACION */
                /* SE MONTAN CONST PARA QUE NO VARIE LA INFORMACION Y SE ENVIA A UNA FUNCION PARA ACTUALIZAR LA INFORMACION */
                const upd_liq_dias_empleador = 0;
                const upd_liq_dias_eps = 0;
                const upd_liq_dias_arl = total_dias_liquidar;
                const upd_liq_dias_fondo_pensiones = 0;
                const upd_liq_dias_eps_fondo_pensiones = 0;

                const upd_Liq_porcentaje_liquidacion_empleador = 0;
                const upd_Liq_porcentaje_liquidacion_eps = 0;
                const upd_Liq_porcentaje_liquidacion_arl = Liq_porcentaje_liquidacion_ARL;
                const upd_Liq_porcentaje_liquidacion_fondo_pensiones = 0;
                const upd_Liq_porcentaje_liquidacion_eps_fondo_pensiones = 0;

                const upd_liq_valor_empleador = 0;
                const upd_liq_valor_eps = 0;
                const upd_liq_valor_arl = liq_valor_ARL;
                const upd_liq_valor_fondo_pensiones = 0;
                const upd_liq_valor_eps_fondo_pensiones = 0;

                const upd_dias_Laborados = parametroGrupoARL.dias_laborados;
                const upd_id_liquidacion = id_liquidacion;
                const upd_dias_liquidables_totales = diasNoRepetidosARL.length;

                console.log("  ", )
                console.log(" upd_liq_dias_empleador ", upd_liq_dias_empleador)
                console.log(" upd_liq_dias_eps ", upd_liq_dias_eps)
                console.log(" upd_liq_dias_arl ", upd_liq_dias_arl)
                console.log(" upd_liq_dias_fondo_pensiones ", upd_liq_dias_fondo_pensiones)
                console.log(" upd_liq_dias_eps_fondo_pensiones ", upd_liq_dias_eps_fondo_pensiones)
                console.log("  ", )
                console.log(" upd_Liq_porcentaje_liquidacion_empleador ", upd_Liq_porcentaje_liquidacion_empleador)
                console.log(" upd_Liq_porcentaje_liquidacion_eps ",upd_Liq_porcentaje_liquidacion_eps )
                console.log(" upd_Liq_porcentaje_liquidacion_arl ",upd_Liq_porcentaje_liquidacion_arl )
                console.log(" upd_Liq_porcentaje_liquidacion_fondo_pensiones ", upd_Liq_porcentaje_liquidacion_fondo_pensiones)
                console.log(" upd_Liq_porcentaje_liquidacion_eps_fondo_pensiones ", upd_Liq_porcentaje_liquidacion_eps_fondo_pensiones)
                console.log("  ", )
                console.log(" upd_liq_valor_empleador ", upd_liq_valor_empleador)
                console.log(" upd_liq_valor_eps ", upd_liq_valor_eps)
                console.log(" upd_liq_valor_arl ",upd_liq_valor_arl )
                console.log(" upd_liq_valor_fondo_pensiones ",upd_liq_valor_fondo_pensiones )
                console.log(" upd_liq_valor_eps_fondo_pensiones ", upd_liq_valor_eps_fondo_pensiones)
                console.log("  ", )
                console.log(" upd_dias_Laborados ",upd_dias_Laborados )
                console.log(" upd_id_liquidacion ", upd_id_liquidacion)
                console.log(" upd_dias_liquidables_totales ", upd_dias_liquidables_totales)
                console.log("  ", )


                /* SE ACTUALIZA LA BASE DE DATOS DE LIQUIDACION  */
                const updateSettlementTableLiq = await updateSettlementTable(
                    upd_liq_dias_empleador,
                    upd_liq_dias_eps,
                    upd_liq_dias_arl,
                    upd_liq_dias_fondo_pensiones,
                    upd_liq_dias_eps_fondo_pensiones,
                    upd_Liq_porcentaje_liquidacion_empleador,
                    upd_Liq_porcentaje_liquidacion_eps,
                    upd_Liq_porcentaje_liquidacion_arl,
                    upd_Liq_porcentaje_liquidacion_fondo_pensiones,
                    upd_Liq_porcentaje_liquidacion_eps_fondo_pensiones,
                    upd_liq_valor_empleador,
                    upd_liq_valor_eps,
                    upd_liq_valor_arl,
                    upd_liq_valor_fondo_pensiones,
                    upd_liq_valor_eps_fondo_pensiones,
                    upd_dias_Laborados,
                    upd_id_liquidacion,
                    upd_dias_liquidables_totales,
                    id_user_session
                );
                console.log("DATOS ACTUALIZADOS, INCAPACIDAD LIQUIDADA CON PRORROGA ARL PROCESO 1:", updateSettlementTableLiq);


                /* DATOS PARA ACTUALIZAR TABLA PRORROGA */
                const up_T_prorroga_id_empleado = proceso_1.id_empleado
                const up_T_prorroga_id_incapacidad_prorroga = id_incapacidad_prorroga
                const up_T_prorroga_tipo_incapacidad_prorroga = datosIncapacidadProrrogaARL.tipo_incapacidad
                const up_T_prorroga_fecha_inicio_incapacidad = datosIncapacidadProrrogaARL.fecha_inicio_incapacidad
                const up_T_prorroga_fecha_final_incapacidad = datosIncapacidadProrrogaARL.fecha_final_incapacidad
                const up_T_prorroga_dias_incapacidad_prorroga = datosIncapacidadProrrogaARL.cantidad_dias
                const up_T_prorroga_dias_liquidables_totales_prorroga = datosIncapacidadProrrogaARL.dias_liquidables_totales
                const up_T_prorroga_id_incapacidad_liquidacion = id_liquidacion
                const up_T_prorroga_tipo_incapcidad = proceso_1.data.tipo_incapacidad
                const up_T_prorroga_fehca_inicio = proceso_1.data.fecha_inicio_incapacidad
                const up_T_prorroga_fecha_final = proceso_1.data.fecha_final_incapacidad
                const up_T_prorroga_dias_incapacidad = proceso_1.data.cantidad_dias
                const up_T_prorroga_dias_liquidados = total_dias_liquidar
                const up_T_prorroga_sumatoria_acomulada = sumatoria_incapacidadesARL


                console.log(" up_T_prorroga_id_empleado:",up_T_prorroga_id_empleado )
                console.log(" up_T_prorroga_id_incapacidad_prorroga:", up_T_prorroga_id_incapacidad_prorroga)
                console.log(" up_T_prorroga_tipo_incapacidad_prorroga:",up_T_prorroga_tipo_incapacidad_prorroga )
                console.log(" up_T_prorroga_fecha_inicio_incapacidad:", up_T_prorroga_fecha_inicio_incapacidad)
                console.log(" up_T_prorroga_fecha_final_incapacidad:",up_T_prorroga_fecha_final_incapacidad )
                console.log(" up_T_prorroga_dias_incapacidad_prorroga:", up_T_prorroga_dias_incapacidad_prorroga)
                console.log(" up_T_prorroga_dias_liquidables_totales_prorroga:", up_T_prorroga_dias_liquidables_totales_prorroga)
                console.log(" up_T_prorroga_id_incapacidad_liquidacion:", up_T_prorroga_id_incapacidad_liquidacion)
                console.log(" up_T_prorroga_tipo_incapcidad:", up_T_prorroga_tipo_incapcidad)
                console.log(" up_T_prorroga_fehca_inicio:", up_T_prorroga_fehca_inicio)
                console.log(" up_T_prorroga_fecha_final:", up_T_prorroga_fecha_final)
                console.log(" up_T_prorroga_dias_incapacidad:", up_T_prorroga_dias_incapacidad)
                console.log(" up_T_prorroga_dias_liquidados:",up_T_prorroga_dias_liquidados )
                console.log(" up_T_prorroga_sumatoria_acomulada:", up_T_prorroga_sumatoria_acomulada)

            
                /* SE ACTUALIZA BASE DE DATOS DE PRORROGA */
                const updateTablaProrroga = await updateTablaProrrogaDB (
                    up_T_prorroga_id_empleado,
                    up_T_prorroga_id_incapacidad_prorroga,
                    up_T_prorroga_tipo_incapacidad_prorroga,
                    up_T_prorroga_fecha_inicio_incapacidad,
                    up_T_prorroga_fecha_final_incapacidad,
                    up_T_prorroga_dias_incapacidad_prorroga,
                    up_T_prorroga_dias_liquidables_totales_prorroga,
                    up_T_prorroga_id_incapacidad_liquidacion,
                    up_T_prorroga_tipo_incapcidad,
                    up_T_prorroga_fehca_inicio,
                    up_T_prorroga_fecha_final,
                    up_T_prorroga_dias_incapacidad,
                    up_T_prorroga_dias_liquidados,
                    up_T_prorroga_sumatoria_acomulada
                    
                )

                console.log("TABLA PRORROGA ACTUALIZADA: ", updateTablaProrroga)

                const updateDownloadStatusLiq = await updateDownloadStatus(id_historial);   //Actualiza downloaded = 1, en la tabla liquidacion




            }    
            
            console.log("")
            console.log("")
            console.log("")
            console.log("")
            

            console.log("DATOS EN LA TABLA PRORROGA FALSE", validacioTablaProrroga)
            /* SIN DATOS EN TABLA PRORROGA PARA SUMATORIA ACOMULADA */
            if(!validacioTablaProrroga){
                
                console.log("DATOS EN LA TABLA PRORROGA FALSE", validacioTablaProrroga)

                const sumatoria_incapacidadesARL = total_dias_liquidar + datosIncapacidadProrrogaARL.dias_liquidables_totales

                console.log("SUMATORIA ENTRE LAS DOS INCAPACIDADES VINCULADAS, SIN SUMATORIA ACOMULADA YA QUE NO HAY REGISTRO EN TABLA PRORROGA: ", sumatoria_incapacidadesARL)


                /* TRAER PORCENTAJE A LIQUIDAR POR PARTE DE ARL */
                let Liq_porcentaje_liquidacion_ARL = parseFloat( parametroGrupoARL.porcentaje_liquidacion_arl  ) || 100;
                console.log("Liq_porcentaje_liquidacion_eps_grupoD", Liq_porcentaje_liquidacion_ARL);


                
                /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE FARL  */
                let liq_valor_ARL = entityLiquidation(
                    proceso_1.data.salario_empleado,
                    Liq_porcentaje_liquidacion_ARL,
                    total_dias_liquidar
                );
                console.log("VALOR A LIQUIDAR POR PARTE DE ARL: ", liq_valor_ARL);

                /* CALCULAR EL ACOMULATIVO SI APLICA  EPS PARA QUE EL EMPLEADOR NIVELE*/
                acomuladoDeudaGrupoA = acomuladoDeuda(proceso_1.data.salario_empleado, Liq_porcentaje_liquidacion_ARL, total_dias_liquidar, id_liquidacion)
                console.log("ACOMULADO DEUDA GRUPO B: ", acomuladoDeudaGrupoA)


                /* GUARDAMOS EN LA BASE DE DATOS SI APLICA */
                if(acomuladoDeudaGrupoA > 0){


                    console.log("Entramos al condicional")
                    /* FUNCION PARA GUARDAR EN BASE DE DATOS */
                    const complemento = await complementoIncapacidadARL(acomuladoDeudaGrupoA, id_liquidacion)
                    console.log("COMPLEMENTO INCAPACIDAD GRUPO E: ", complemento)

                } 

                /* SE MONTAN CONST PARA QUE NO VARIE LA INFORMACION Y SE ENVIA A UNA FUNCION PARA ACTUALIZAR LA INFORMACION */
                const upd_liq_dias_empleador = 0;
                const upd_liq_dias_eps = 0;
                const upd_liq_dias_arl = total_dias_liquidar;
                const upd_liq_dias_fondo_pensiones = 0;
                const upd_liq_dias_eps_fondo_pensiones = 0;

                const upd_Liq_porcentaje_liquidacion_empleador = 0;
                const upd_Liq_porcentaje_liquidacion_eps = 0;
                const upd_Liq_porcentaje_liquidacion_arl = Liq_porcentaje_liquidacion_ARL;
                const upd_Liq_porcentaje_liquidacion_fondo_pensiones = 0;
                const upd_Liq_porcentaje_liquidacion_eps_fondo_pensiones = 0;

                const upd_liq_valor_empleador = 0;
                const upd_liq_valor_eps = 0;
                const upd_liq_valor_arl = liq_valor_ARL;
                const upd_liq_valor_fondo_pensiones = 0;
                const upd_liq_valor_eps_fondo_pensiones = 0;

                const upd_dias_Laborados = parametroGrupoARL.dias_laborados;
                const upd_id_liquidacion = id_liquidacion;
                const upd_dias_liquidables_totales = total_dias_liquidar;

                console.log("  ", )
                console.log(" upd_liq_dias_empleador ", upd_liq_dias_empleador)
                console.log(" upd_liq_dias_eps ", upd_liq_dias_eps)
                console.log(" upd_liq_dias_arl ", upd_liq_dias_arl)
                console.log(" upd_liq_dias_fondo_pensiones ", upd_liq_dias_fondo_pensiones)
                console.log(" upd_liq_dias_eps_fondo_pensiones ", upd_liq_dias_eps_fondo_pensiones)
                console.log("  ", )
                console.log(" upd_Liq_porcentaje_liquidacion_empleador ", upd_Liq_porcentaje_liquidacion_empleador)
                console.log(" upd_Liq_porcentaje_liquidacion_eps ",upd_Liq_porcentaje_liquidacion_eps )
                console.log(" upd_Liq_porcentaje_liquidacion_arl ",upd_Liq_porcentaje_liquidacion_arl )
                console.log(" upd_Liq_porcentaje_liquidacion_fondo_pensiones ", upd_Liq_porcentaje_liquidacion_fondo_pensiones)
                console.log(" upd_Liq_porcentaje_liquidacion_eps_fondo_pensiones ", upd_Liq_porcentaje_liquidacion_eps_fondo_pensiones)
                console.log("  ", )
                console.log(" upd_liq_valor_empleador ", upd_liq_valor_empleador)
                console.log(" upd_liq_valor_eps ", upd_liq_valor_eps)
                console.log(" upd_liq_valor_arl ",upd_liq_valor_arl )
                console.log(" upd_liq_valor_fondo_pensiones ",upd_liq_valor_fondo_pensiones )
                console.log(" upd_liq_valor_eps_fondo_pensiones ", upd_liq_valor_eps_fondo_pensiones)
                console.log("  ", )
                console.log(" upd_dias_Laborados ",upd_dias_Laborados )
                console.log(" upd_id_liquidacion ", upd_id_liquidacion)
                console.log(" upd_dias_liquidables_totales ", upd_dias_liquidables_totales)
                console.log("  ", )


                /* SE ACTUALIZA LA BASE DE DATOS DE LIQUIDACION  */
                const updateSettlementTableLiq = await updateSettlementTable(
                    upd_liq_dias_empleador,
                    upd_liq_dias_eps,
                    upd_liq_dias_arl,
                    upd_liq_dias_fondo_pensiones,
                    upd_liq_dias_eps_fondo_pensiones,
                    upd_Liq_porcentaje_liquidacion_empleador,
                    upd_Liq_porcentaje_liquidacion_eps,
                    upd_Liq_porcentaje_liquidacion_arl,
                    upd_Liq_porcentaje_liquidacion_fondo_pensiones,
                    upd_Liq_porcentaje_liquidacion_eps_fondo_pensiones,
                    upd_liq_valor_empleador,
                    upd_liq_valor_eps,
                    upd_liq_valor_arl,
                    upd_liq_valor_fondo_pensiones,
                    upd_liq_valor_eps_fondo_pensiones,
                    upd_dias_Laborados,
                    upd_id_liquidacion,
                    upd_dias_liquidables_totales,
                    id_user_session
                );
                console.log("DATOS ACTUALIZADOS, INCAPACIDAD LIQUIDADA CON PRORROGA ARL PROCESO 2:", updateSettlementTableLiq);


                /* DATOS PARA ACTUALIZAR TABLA PRORROGA */
                const up_T_prorroga_id_empleado = proceso_1.id_empleado
                const up_T_prorroga_id_incapacidad_prorroga = id_incapacidad_prorroga
                const up_T_prorroga_tipo_incapacidad_prorroga = datosIncapacidadProrrogaARL.tipo_incapacidad
                const up_T_prorroga_fecha_inicio_incapacidad = datosIncapacidadProrrogaARL.fecha_inicio_incapacidad
                const up_T_prorroga_fecha_final_incapacidad = datosIncapacidadProrrogaARL.fecha_final_incapacidad
                const up_T_prorroga_dias_incapacidad_prorroga = datosIncapacidadProrrogaARL.cantidad_dias
                const up_T_prorroga_dias_liquidables_totales_prorroga = datosIncapacidadProrrogaARL.dias_liquidables_totales
                const up_T_prorroga_id_incapacidad_liquidacion = id_liquidacion
                const up_T_prorroga_tipo_incapcidad = proceso_1.data.tipo_incapacidad
                const up_T_prorroga_fehca_inicio = proceso_1.data.fecha_inicio_incapacidad
                const up_T_prorroga_fecha_final = proceso_1.data.fecha_final_incapacidad
                const up_T_prorroga_dias_incapacidad = proceso_1.data.cantidad_dias
                const up_T_prorroga_dias_liquidados = total_dias_liquidar
                const up_T_prorroga_sumatoria_acomulada = sumatoria_incapacidadesARL


                console.log(" up_T_prorroga_id_empleado:",up_T_prorroga_id_empleado )
                console.log(" up_T_prorroga_id_incapacidad_prorroga:", up_T_prorroga_id_incapacidad_prorroga)
                console.log(" up_T_prorroga_tipo_incapacidad_prorroga:",up_T_prorroga_tipo_incapacidad_prorroga )
                console.log(" up_T_prorroga_fecha_inicio_incapacidad:", up_T_prorroga_fecha_inicio_incapacidad)
                console.log(" up_T_prorroga_fecha_final_incapacidad:",up_T_prorroga_fecha_final_incapacidad )
                console.log(" up_T_prorroga_dias_incapacidad_prorroga:", up_T_prorroga_dias_incapacidad_prorroga)
                console.log(" up_T_prorroga_dias_liquidables_totales_prorroga:", up_T_prorroga_dias_liquidables_totales_prorroga)
                console.log(" up_T_prorroga_id_incapacidad_liquidacion:", up_T_prorroga_id_incapacidad_liquidacion)
                console.log(" up_T_prorroga_tipo_incapcidad:", up_T_prorroga_tipo_incapcidad)
                console.log(" up_T_prorroga_fehca_inicio:", up_T_prorroga_fehca_inicio)
                console.log(" up_T_prorroga_fecha_final:", up_T_prorroga_fecha_final)
                console.log(" up_T_prorroga_dias_incapacidad:", up_T_prorroga_dias_incapacidad)
                console.log(" up_T_prorroga_dias_liquidados:",up_T_prorroga_dias_liquidados )
                console.log(" up_T_prorroga_sumatoria_acomulada:", up_T_prorroga_sumatoria_acomulada)

                /* SE ACTUALIZA BASE DE DATOS DE PRORROGA */
                const updateTablaProrroga = await updateTablaProrrogaDB (
                    up_T_prorroga_id_empleado,
                    up_T_prorroga_id_incapacidad_prorroga,
                    up_T_prorroga_tipo_incapacidad_prorroga,
                    up_T_prorroga_fecha_inicio_incapacidad,
                    up_T_prorroga_fecha_final_incapacidad,
                    up_T_prorroga_dias_incapacidad_prorroga,
                    up_T_prorroga_dias_liquidables_totales_prorroga,
                    up_T_prorroga_id_incapacidad_liquidacion,
                    up_T_prorroga_tipo_incapcidad,
                    up_T_prorroga_fehca_inicio,
                    up_T_prorroga_fecha_final,
                    up_T_prorroga_dias_incapacidad,
                    up_T_prorroga_dias_liquidados,
                    up_T_prorroga_sumatoria_acomulada
                    
                )

                console.log("TABLA PRORROGA ACTUALIZADA: ", updateTablaProrroga) 

                const updateDownloadStatusLiq = await updateDownloadStatus(id_historial);   //Actualiza downloaded = 1, en la tabla liquidacion

            }

            return {
                success: true,
                message: 'Liquidación de incapacidad ARL procesada '        
            };  

        }


              
        

    } catch (error) {
        console.error("Error al momento de liquidar incapacidad")
    }
}