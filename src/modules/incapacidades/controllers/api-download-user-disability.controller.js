// IMPORTACIONES NECESARIAS
import { pool } from "../../../models/db.js";
import express from 'express';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { getUltimasIncapacidades, getUltimasIncapacidadesIdEmpleado } from '../repositories/api-download-user-disability/incapacidadesHelpers.js';
import { getIdEmpleadoByHistorial } from '../repositories/api-download-user-disability/getIdEmpleadoByHistorial.js';
import { getDisabilityDischargeHistory } from '../repositories/api-download-user-disability/getDisabilityDischargeHistory.js';
import { updateLiquidacoinTableIncapacity, updateDownloadStatus } from '../repositories/api-download-user-disability/updateLiquidacoinTableIncapacity.js';
import { getPoliticaByParametros, getPoliticaByParametrosProrroga, getPoliticaGrupoA, getPoliticaGrupoB, getPoliticaGrupoC, getPoliticaGrupoD } from '../repositories/api-download-user-disability/getPoliticaByParametros.js';
import { formatDate, formatDate2 } from '../utils/formatDate/formatDate.js';
import { validarProrroga } from '../utils/api-download-user-disability/validarProrroga.js';
import { updateDisabilitySettlementExtensionLiq, updateDisabilitySettlementExtensionHis } from '../repositories/api-download-user-disability/updateDisabilitySettlementExtension.js';
import { calculateDaysEps } from '../utils/api-download-user-disability/calculateDaysEps.js'
import { entityLiquidation, entityLiquidationEmpleador } from '../utils/api-download-user-disability/entityLiquidation.js'
import { updateSettlementTable, updateSettlementTableEmpleador, updateSettlementTableARL } from '../repositories/api-download-user-disability/updateSettlementTable.js'
import { calcularDiasLiquidar } from '../utils/api-download-user-disability/calcularDiasLiquidarSinProrroga.js'
import { transformarParametrosPolitica } from '../utils/api-download-user-disability/transformPolicyParameters.js'
import { uploadFilesroutes } from '../repositories/api-download-user-disability/uploadFilesroutes.js'
import { obtenerDiasNoRepetidos, obtenerDiasEntreFechas } from '../utils/api-download-user-disability/calcularDiasLiquidar.js'
import { getDatosIncapacidadProrroga, getDatosIncapacidadProrrogaARL } from '../repositories/api-download-user-disability/get_incapacidad_prorroga.js'
import { obtenerDiasNoRepetidosProrroga } from '../services/api-download-user-disability/obtenerDiasNoRepetidos.js'
import { buscarProrrogaConsecutiva, buscarProrrogaConsecutivaARL } from '../repositories/api-download-user-disability/get_buscar_prorroga_consecutiva.js'
import { calcularDistribucionDias  } from '../services/api-download-user-disability/calcularDistribucionDiasGrupos.js'
import { updateTablaProrrogaDB } from '../repositories/api-download-user-disability/insert_tabla_prorroga_DB.js'
const app = express();

// CONTROLADOR PRINCIPAL
export const api_download_user_disability = async (req, res) => {
    try {
        const { id_liquidacion, id_historial } = req.params;
        await processDownloadUserDisability(id_liquidacion, id_historial, res);
    } catch (error) {
        console.error("Error en controlador principal:", error);
        return res.status(500).json({ message: "Error en el servidor." });
    }
};



// FUNCION INDEPENDIENTE
const processDownloadUserDisability = async (id_liquidacion, id_historial, res) => {
    try {
        const id_empleado = await getIdEmpleadoByHistorial(id_historial);

        if (!id_liquidacion || !id_historial || !id_empleado) {
            return res.status(400).json({ message: "Faltan parámetros en la solicitud." });
        }


        /* TRAER LA ULTIMA INCAPACIDAD DE TABLA HISTORIAL  PARA ACTUALIZAR TABLA LIQUIDACION*/
        const disabilityDischargeHistory = await getDisabilityDischargeHistory(id_empleado, id_historial);
        if (!disabilityDischargeHistory) {
            return res.status(404).json({ message: "No se encontró la incapacidad con los datos proporcionados." });
        }


        /* DATA - GUARDA LOS DATOS DE LA TABLA HISTORIAL PARA ACTUALIZAR DATOS EN LA TABLA LIQUIDACION */
        const data = disabilityDischargeHistory;
        console.log("🧾 Datos encontrados TABLA HISTORIAL:", data);


        /* SE CARGAN LAS RUTAS DONDE SE ALOJAN LOS FILES EN UPLOAD, SE TOMAN DE LA TABLA ruta_documentos */
        const uploadFiles = await uploadFilesroutes(id_historial, id_liquidacion)


        /* ACTUALIZAR LOS DATOS EN LA TABLA LIQUIDACION CON DATA (ENCAPSULAMIENTO) */
        const updateResult = await updateLiquidacoinTableIncapacity(data);
        if (updateResult.affectedRows > 0) {
            return res.status(200).json({ message: "Información actualizada correctamente." });
        }



        /* FILTRO PARA CARGAR LA POLITCA SUGERIDA A LA NUEVA INCAPACIDAD*/
        const parametros = transformarParametrosPolitica(data);

        /* CONSTANTES PARA VALIDAR POLITICAS  EN LOS DIFERENTES CASOS*/
        const prorroga_conversion = parametros.prorroga;

        const dias_laborados_conversion = parametros.dias_laborados_conversion;
        const dias_laborados = parametros.dias_laborados

        const salario_conversion = parametros.salario;

        const tipo_incapacidad = parametros.tipo_incapacidad;

        const cantidad_dias = parametros.dias_incapacidad;
        const cantidad_dias_conversion = parametros.dias_incapacidad_conversion;


        console.log(" parametros: ", parametros)
        console.log(" prorroga_conversion: ", prorroga_conversion)
        console.log("dias_laborados_conversion:  ", dias_laborados_conversion )
        console.log("dias_laborados: ", dias_laborados )
        console.log(" salario_conversion: ", salario_conversion )
        console.log("tipo_incapacidad:  ", tipo_incapacidad )
        console.log("cantidad_dias:  ", cantidad_dias )
        console.log(" cantidad_dias_conversion: ", cantidad_dias_conversion )



        /* TRAER POLITICA CON LOS DATOS INGRESADOS  */
        const politicaAplicada = await getPoliticaByParametros(
            prorroga_conversion,
            dias_laborados_conversion,
            salario_conversion,
            tipo_incapacidad,
            cantidad_dias_conversion
        );


        /* VALIDACION DE LA POLITICA */
        if (!politicaAplicada) {
            return res.status(404).json({ message: "No se encontró ninguna política para liquidar la incapacidad." });
        }

        console.log("📜 Política encontrada:", politicaAplicada);


        /* VALDIAMOS SI CUMPLE CON ALGUN APOLITICA INICIALMENTE */
        const Liq_cumplimiento = politicaAplicada.cumplimiento;
        const liq_prorroga = parametros.prorroga.toUpperCase();



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


        //parametros.tipo_incapacidad

        /* VALIDACION DE CUMPLEIMIENTO */
        if(Liq_cumplimiento === 'SI'){
                    /* SELECCION DEL CASO */
            switch (parametros.tipo_incapacidad) {

                /* EPS */
                case 'EPS':


                    /* VALIDACION PRORROGA == SI */
                    if (liq_prorroga === 'SI') {


                        let sumatoria_incapacidades = 0

                        /* TRAEMOS EL ID DE LA INCAPACIDAD EXTENSION QUE NOS DA LA TABLAHISTORIAL */
                        const id_incapacidad_prorroga = data.id_incapacidad_extension
                        console.log("ID INCAPACIDAD EXTENSION: ", id_incapacidad_prorroga)


                        /* SE GENERA LA CONSULTA A LA BASE DE DATOS PARA TRAER DATOS DE LA INCAPACIDAD PRORROGA */
                        const datosIncapacidadProrroga = await getDatosIncapacidadProrroga (id_incapacidad_prorroga)
                        console.log("DATOS DE LA INCAPACIDAD PRORROGA: ", datosIncapacidadProrroga)


                        /* FORMATEAMOS FECHAS */
                        const fecha_inicio_incapacidad_anterior = formatDate2(datosIncapacidadProrroga.fecha_inicio_incapacidad)
                        const fecha_final_incapacidad_anterior = formatDate2(datosIncapacidadProrroga.fecha_final_incapacidad)
                        const fecha_inicial_incapacidad_liquidar = formatDate2(data.fecha_inicio_incapacidad);
                        const fecha_final_incapacidad_liquidar = formatDate2(data.fecha_final_incapacidad);
                       
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
                        const parametroGrupoA = transformarParametrosPolitica(data);
                        

                        /* VARIABLES PARA CONSULTAR POLITICAS */
                        let cumplimiento_politica = 'SI'
                        let prorroga = 'SI'
                        let dias_laborados_conversion_grupoA = parametroGrupoA.dias_laborados_conversion
                        let salario_conversion_grupoA = parametroGrupoA.salario
                        let liquidacion_dias_grupoA  = 0
                        let tipo_incapacidad_grupoA = parametroGrupoA.tipo_incapacidad


                        /* FILTRO PARA CARGAR LA POLITCA SUGERIDA A LA NUEVA INCAPACIDAD GRUPO B*/
                        const parametroGrupoB = transformarParametrosPolitica(data);

                        let cumplimiento_politica_grupoB = 'SI'
                        let prorroga_grupoB = 'SI'
                        let dias_laborados_conversion_grupoB = parametroGrupoB.dias_laborados_conversion
                        let salario_conversion_grupoB = parametroGrupoB.salario
                        let liquidacion_dias_grupoB  = 0
                        let tipo_incapacidad_grupoB = parametroGrupoB.tipo_incapacidad

                        /* FILTRO PARA CARGAR LA POLITCA SUGERIDA A LA NUEVA INCAPACIDAD GRUPO B*/
                        const parametroGrupoC = transformarParametrosPolitica(data);

                        let cumplimiento_politica_grupoC = 'SI'
                        let prorroga_grupoC = 'SI'
                        let dias_laborados_conversion_grupoC = parametroGrupoC.dias_laborados_conversion
                        let salario_conversion_grupoC = parametroGrupoC.salario
                        let liquidacion_dias_grupoC  = 0
                        let tipo_incapacidad_grupoC = parametroGrupoC.tipo_incapacidad


                        /* FILTRO PARA CARGAR LA POLITCA SUGERIDA A LA NUEVA INCAPACIDAD GRUPO B*/
                        const parametroGrupoD = transformarParametrosPolitica(data);

                        let cumplimiento_politica_grupoD = 'SI'
                        let prorroga_grupoD = 'SI'
                        let dias_laborados_conversion_grupoD = parametroGrupoD.dias_laborados_conversion
                        let salario_conversion_grupoD = parametroGrupoD.salario
                        let liquidacion_dias_grupoD  = 0
                        let tipo_incapacidad_grupoD = parametroGrupoD.tipo_incapacidad





                        /* VALIDACION PARA VERIFICAR SI HAY PRORROGA CONTINUA, EN CASO DE HABER PRORROGA TRAER LOS DATOS Y PROCESARLOS. */
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




                            /* VARIABLES PARA EJECUTAR EL RESULTRADO FINAL */
                            let liquidacion_dias_grupo_menor_90 = 0
                            let Liq_porcentaje_liquidacion_eps_grupoA = 0
                            let liq_valor_eps_grupoA = 0
                            let PoliticaGrupoA = 0

                            /* GRUPO A -  3 - 90  EPS 66.67%*/
                            if(resultado.diasTramo_1a90 > 0 ){

                                /* POLITICA PARA APLICAR A MENOR 90 */ 
                                liquidacion_dias_grupo_menor_90 = resultado.diasTramo_1a90   // CONST que guarda los días reales a liquidar al 66%  
                                console.log("DIAS A LIQUIDAR CON EL 66.66 %: ", liquidacion_dias_grupo_menor_90)



                                /* TRAER POLITICA CON LOS DATOS INGRESADOS  */
                                PoliticaGrupoA = await getPoliticaGrupoA(
                                    prorroga,
                                    dias_laborados_conversion_grupoA,
                                    salario_conversion_grupoA,
                                    liquidacion_dias_grupoA = resultado.diasTramo_1a90,
                                    tipo_incapacidad
                                );


                                console.log("cumplimiento_politica", cumplimiento_politica )
                                console.log("prorroga", prorroga)
                                console.log("dias_laborados_conversion_grupoA",dias_laborados_conversion_grupoA )
                                console.log("salario_conversion_grupoA",salario_conversion_grupoA )
                                console.log("liquidacion_dias_grupoA", liquidacion_dias_grupoA)
                                console.log("tipo_incapacidad", tipo_incapacidad)
                                console.log("RESULTADO DE LA CONSULTA A LA BASE DE LA POLITICA: ", PoliticaGrupoA)


                                /* CALCULOS PARA LA LIQUIDACION CORRESPONDIENTE DE GRUPO A */

                                /* TRAER PORCENTAJE A LIQUIDAR POR PARTE DE EPS */
                                Liq_porcentaje_liquidacion_eps_grupoA = parseFloat( PoliticaGrupoA.porcentaje_liquidacion_eps  ) || 0;
                                console.log("Liq_porcentaje_liquidacion_eps", Liq_porcentaje_liquidacion_eps);


                                /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE EPS  */
                                liq_valor_eps_grupoA = entityLiquidation(
                                    data.salario_empleado,
                                    Liq_porcentaje_liquidacion_eps_grupoA,
                                    liquidacion_dias_grupo_menor_90
                                );
                                console.log("VALOR A LIQUIDAR POR PARTE DE EPS: ", liq_valor_eps_grupoA);


                            }


                            /* VARIABLES PARA EJECUTAR EL RESULTRADO FINAL */
                            let dias_grupo_91a180  = 0
                            let Liq_porcentaje_liquidacion_eps_grupoB = 0
                            let liq_valor_eps_grupoB = 0
                            let PoliticaGrupoB = 0

                            /* GRUPO B -  91 - 180 EPS 50% */
                            if(resultado.diasTramo_91a180 > 0){
                                
                                /* POLITICA PARA APLICAR A MAYOR 90 */ 
                                dias_grupo_91a180 = resultado.diasTramo_91a180   // CONST que guarda los días reales a liquidar al 50%  
                                console.log("DIAS A LIQUIDAR CON EL 50.00 %: ", dias_grupo_91a180)


                                /* CALCULAR DIAS PARA VERIFICAR POLITICAS CON MÁS PRECISION */
                                liquidacion_dias_grupoB = resultado.sumatoriaPrevia + resultado.diasTramo_1a90


                                /* TRAER POLITICA CON LOS DATOS INGRESADOS  */
                                PoliticaGrupoB = await getPoliticaGrupoB(
                                    prorroga_grupoB,
                                    dias_laborados_conversion_grupoB,
                                    salario_conversion_grupoB,
                                    liquidacion_dias_grupoB,
                                    tipo_incapacidad_grupoB
                                );

                                console.log("POLITICA SELECCIONADA  ---------> :" ,PoliticaGrupoB )
                                console.log("cumplimiento_politica_grupoB", cumplimiento_politica_grupoB )
                                console.log("prorroga_grupoB", prorroga_grupoB)
                                console.log("dias_laborados_conversion_grupoB",dias_laborados_conversion_grupoB )
                                console.log("salario_conversion_grupoB",salario_conversion_grupoB )
                                console.log("liquidacion_dias_grupoB", liquidacion_dias_grupoB)
                                console.log("tipo_incapacidad_grupoB", tipo_incapacidad_grupoB)
                                console.log("PoliticaGrupoB.entidad_liquidadora", PoliticaGrupoB.entidad_liquidadora)
                                console.log("RESULTADO DE LA CONSULTA A LA BASE DE LA POLITICA GRUPO B: ", PoliticaGrupoB)


                                /* TRAER PORCENTAJE A LIQUIDAR POR PARTE DE EPS */
                                Liq_porcentaje_liquidacion_eps_grupoB = parseFloat( PoliticaGrupoB.porcentaje_liquidacion_eps  ) || 0;
                                console.log("Liq_porcentaje_liquidacion_eps_grupoB", Liq_porcentaje_liquidacion_eps_grupoB);


                                /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE EPS  */
                                liq_valor_eps_grupoB = entityLiquidation(
                                    data.salario_empleado,
                                    Liq_porcentaje_liquidacion_eps_grupoB,
                                    dias_grupo_91a180
                                );
                                console.log("VALOR A LIQUIDAR POR PARTE DE EPS 50%: ", liq_valor_eps_grupoB);


                                const sumaTotalLiquidacionEntidadLiquidadora = 0
                                
                                
                            }


                            /* VARIABLES PARA EJECUTAR EL RESULTRADO FINAL */
                            let dias_grupo_181a540 = 0
                            let Liq_porcentaje_liquidacion_f_pension_grupoC = 0
                            let liq_valor_eps_grupoC = 0
                            let PoliticaGrupoC = 0  


                            /* GRUPO C - 181 - 540 FONDO DE PENSION 50% */
                            if(resultado.diasTramo_181a540 > 0){

                                
                                /* POLITICA PARA APLICAR A MAYOR 90 */ 
                                dias_grupo_181a540 = resultado.diasTramo_181a540   // CONST que guarda los días reales a liquidar al 50%  
                                console.log("DIAS A LIQUIDAR CON EL 50.00 %: ", dias_grupo_181a540)


                                /* CALCULAR DIAS PARA VERIFICAR POLITICAS CON MÁS PRECISION */
                                liquidacion_dias_grupoC = resultado.sumatoriaPrevia + resultado.diasTramo_1a90 + resultado.diasTramo_91a180 + resultado.diasTramo_181a540
                                console.log("LIQUIDACION DIAS GRUPO C: ", liquidacion_dias_grupoC)


                                /* TRAER POLITICA CON LOS DATOS INGRESADOS  */
                                PoliticaGrupoC = await getPoliticaGrupoC(
                                    prorroga_grupoC,
                                    dias_laborados_conversion_grupoC,
                                    salario_conversion_grupoC,
                                    liquidacion_dias_grupoC,
                                    tipo_incapacidad_grupoC
                                );


                                console.log("PoliticaGrupoC: ", PoliticaGrupoC)
                                
                                /* TRAER PORCENTAJE A LIQUIDAR POR PARTE DE FONDO DE PENSIONES */
                                Liq_porcentaje_liquidacion_f_pension_grupoC = parseFloat( PoliticaGrupoC.porcentaje_liquidacion_fondo_pensiones  ) || 0;
                                console.log("Liq_porcentaje_liquidacion_eps_grupoC", Liq_porcentaje_liquidacion_f_pension_grupoC);


                                /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE FONDO DE PENSIONES  */
                                liq_valor_eps_grupoC = entityLiquidation(
                                    data.salario_empleado,
                                    Liq_porcentaje_liquidacion_f_pension_grupoC,
                                    dias_grupo_181a540
                                );
                                console.log("VALOR A LIQUIDAR POR PARTE DE FONDO DE PENSION: ", liq_valor_eps_grupoC);

                            }


                            let dias_grupo_541 = 0
                            let Liq_porcentaje_liquidacion_eps_grupoD = 0
                            let liq_valor_eps_grupoD = 0
                            let PoliticaGrupoD = 0  

                            /* GRUPO D - 541 +  50%*/
                            if(resultado.diasTramo_541plus > 0){


                                /* POLITICA PARA APLICAR A MAYOR 90 */ 
                                dias_grupo_541 = resultado.diasTramo_541plus   // CONST que guarda los días reales a liquidar al 50%  
                                console.log("DIAS A LIQUIDAR CON EL 50.00 %: ", dias_grupo_541)


                                /* CALCULAR DIAS PARA VERIFICAR POLITICAS CON MÁS PRECISION */
                                liquidacion_dias_grupoD = resultado.sumatoriaPrevia + resultado.diasTramo_1a90 + resultado.diasTramo_91a180 + resultado.diasTramo_181a540 + resultado.diasTramo_541plus
                                console.log("LIQUIDACION DIAS GRUPO D: ", liquidacion_dias_grupoD)


                                /* TRAER POLITICA CON LOS DATOS INGRESADOS  */
                                PoliticaGrupoD = await getPoliticaGrupoD(
                                    prorroga_grupoD,
                                    dias_laborados_conversion_grupoD,
                                    salario_conversion_grupoD,
                                    liquidacion_dias_grupoD,
                                    tipo_incapacidad_grupoD
                                );


                                console.log("PoliticaGrupoD: ", PoliticaGrupoD)


                                /* TRAER PORCENTAJE A LIQUIDAR POR PARTE DE EPS */
                                Liq_porcentaje_liquidacion_eps_grupoD = parseFloat( PoliticaGrupoD.porcentaje_liquidacion_eps_fondo_pensiones  ) || 0;
                                console.log("Liq_porcentaje_liquidacion_eps_grupoD", Liq_porcentaje_liquidacion_eps_grupoD);


                                /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE FONDO DE PENSIONES  */
                                liq_valor_eps_grupoD = entityLiquidation(
                                    data.salario_empleado,
                                    Liq_porcentaje_liquidacion_eps_grupoD,
                                    dias_grupo_541
                                );
                                console.log("VALOR A LIQUIDAR POR PARTE DE EPS + 540: ", liq_valor_eps_grupoD);

                            }


                            console.log("TOTAL DIAS A LIQUIDAR GRUPO A: ", liquidacion_dias_grupo_menor_90)
                            console.log("PORCENTAJE A LIQUIDAR GRUPO A: ", Liq_porcentaje_liquidacion_eps_grupoA)
                            console.log("VALOR TOTAL A LIQUIDAR GRUPO A: ", liq_valor_eps_grupoA)
                            console.log("ENTIDAD LIQUIDADORA: ", PoliticaGrupoA.entidad_liquidadora)

                            console.log("TOTAL DIAS A LIQUIDAR GRUPO B: ", dias_grupo_91a180)
                            console.log("PORCENTAJE A LIQUIDAR GRUPO B: ", Liq_porcentaje_liquidacion_eps_grupoB)
                            console.log("VALOR TOTAL A LIQUIDAR GRUPO B: ", liq_valor_eps_grupoB)
                            console.log("ENTIDAD LIQUIDADORA: ", PoliticaGrupoB.entidad_liquidadora)


                            console.log("TOTAL DIAS A LIQUIDAR GRUPO C: ", dias_grupo_181a540)
                            console.log("PORCENTAJE A LIQUIDAR GRUPO C: ", Liq_porcentaje_liquidacion_f_pension_grupoC)
                            console.log("VALOR TOTAL A LIQUIDAR GRUPO C: ", liq_valor_eps_grupoC)
                            console.log("ENTIDAD LIQUIDADORA: ", PoliticaGrupoC.entidad_liquidadora)


                            console.log("TOTAL DIAS A LIQUIDAR GRUPO D: ", dias_grupo_541)
                            console.log("PORCENTAJE A LIQUIDAR GRUPO D: ", Liq_porcentaje_liquidacion_eps_grupoD)
                            console.log("VALOR TOTAL A LIQUIDAR GRUPO D: ", liq_valor_eps_grupoD)
                            console.log("ENTIDAD LIQUIDADORA: ", PoliticaGrupoD.entidad_liquidadora)



                            /* GUARDAR LOS DATOS EN LA BASE DE DATOS VTABLA LIQUIDACION */
                            /* SE MONTAN CONST PARA QUE NO VARIE LA INFORMACION Y SE ENVIA A UNA FUNCION PARA ACTUALIZAR LA INFORMACION */
                            const upd_liq_dias_empleador = 0;
                            const upd_liq_dias_eps = liquidacion_dias_grupo_menor_90 + dias_grupo_91a180;
                            const upd_liq_dias_arl = 0;
                            const upd_liq_dias_fondo_pensiones = dias_grupo_181a540;
                            const upd_liq_dias_eps_fondo_pensiones = dias_grupo_541;

                            const upd_Liq_porcentaje_liquidacion_empleador = 0;
                            const upd_Liq_porcentaje_liquidacion_eps = Liq_porcentaje_liquidacion_eps_grupoA || 50;
                            const upd_Liq_porcentaje_liquidacion_arl = 0;
                            const upd_Liq_porcentaje_liquidacion_fondo_pensiones = Liq_porcentaje_liquidacion_f_pension_grupoC;
                            const upd_Liq_porcentaje_liquidacion_eps_fondo_pensiones = Liq_porcentaje_liquidacion_eps_grupoD;

                            const upd_liq_valor_empleador = 0;
                            const upd_liq_valor_eps = liq_valor_eps_grupoA +liq_valor_eps_grupoB;
                            const upd_liq_valor_arl = 0;
                            const upd_liq_valor_fondo_pensiones = liq_valor_eps_grupoC;
                            const upd_liq_valor_eps_fondo_pensiones = liq_valor_eps_grupoD;

                            const upd_dias_Laborados = parametroGrupoA.dias_laborados;
                            const upd_id_liquidacion = id_liquidacion;
                            const upd_dias_liquidables_totales = diasNoRepetidos.length;



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
                                upd_dias_liquidables_totales
                            );
                            console.log("DATOS ACTUALIZADOS, INCAPACIDAD LIQUIDADA CON PRORROGA:", updateSettlementTableLiq);


                            /* DATOS PARA ACTUALIZAR TABLA PRORROGA */
                            const up_T_prorroga_id_empleado = id_empleado
                            const up_T_prorroga_id_incapacidad_prorroga = id_incapacidad_prorroga
                            const up_T_prorroga_tipo_incapacidad_prorroga = validacioTablaProrroga.tipo_incapacidad
                            const up_T_prorroga_fecha_inicio_incapacidad = validacioTablaProrroga.fecha_inicio_incapacidad
                            const up_T_prorroga_fecha_final_incapacidad = validacioTablaProrroga.fecha_final_incapacidad
                            const up_T_prorroga_dias_incapacidad_prorroga = validacioTablaProrroga.cantidad_dias
                            const up_T_prorroga_dias_liquidables_totales_prorroga = validacioTablaProrroga.dias_liquidables_totales
                            const up_T_prorroga_id_incapacidad_liquidacion = id_liquidacion
                            const up_T_prorroga_tipo_incapcidad = data.tipo_incapacidad
                            const up_T_prorroga_fehca_inicio = data.fecha_inicio_incapacidad
                            const up_T_prorroga_fecha_final = data.fecha_final_incapacidad
                            const up_T_prorroga_dias_incapacidad = data.cantidad_dias
                            const up_T_prorroga_dias_liquidados = total_dias_liquidar
                            const up_T_prorroga_sumatoria_acomulada = sumatoria_incapacidades

                            console.log("DATOS DE LA PRO")

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


                            return res.json({
                                message: `Actualización realizada: incapacidad con prórroga EPS sin prorroga continua .`
                            });


                            //console.log("resultado:", resultado);
                        }else{

                            /* SE REALIZA LA SUMATORIA DE LOS DIAS LIQUIDADOS DE LA INCAPACIDAD ANTERIOR CON LOS DÍAS LIQUIDABLE DE LA NUEVA INCAPACIDAD */
                            sumatoria_incapacidades = total_dias_liquidar + datosIncapacidadProrroga.dias_liquidables_totales
                            console.log("ESTA ES LA SUMATORIA TOTAL DE LAS INCAPACIDADES ANTERIROR Y POSTERIROR ->:  ", sumatoria_incapacidades)

                        }



                        /* CATOS PARA TRAER LA POLITICA ADECUADA AL PROCESO, APLICA UNCAMENTE PARA EL GRUPO MENOR A 90 DIAS */

                        sumatoria_incapacidades

                        /* VALIDAR POLITICAS */
                        /* FILTRO PARA CARGAR LA POLITCA SUGERIDA A LA NUEVA INCAPACIDAD*/
                        const parametros = transformarParametrosPolitica(data);

                        /* CONSTANTES PARA VALIDAR POLITICAS  EN LOS DIFERENTES CASOS*/
                        const prorroga_conversion = parametros.prorroga;

                        const dias_laborados_conversion = parametros.dias_laborados_conversion;
                        const dias_laborados = parametros.dias_laborados

                        const salario_conversion = parametros.salario;

                        //const tipo_incapacidad = "EPS";

                        //const cantidad_dias = parametros.dias_incapacidad;
                        const cantidad_dias_conversion = parametros.dias_incapacidad_conversion;



                        /* TRAER POLITICA CON LOS DATOS INGRESADOS  */
                        const politicaAplicada = await getPoliticaByParametrosProrroga(
                            prorroga_conversion,
                            dias_laborados_conversion,
                            salario_conversion,
                            sumatoria_incapacidades // Este es el total de días que ya tenés calculado
                        );
                        
                        console.log("PARAMETROS: ",parametros )
                        console.log("prorroga_conversion: ",prorroga_conversion )
                        console.log("dias_laborados_conversion: ",dias_laborados_conversion )
                        console.log("dias_laborados: ", dias_laborados)
                        console.log("salario_conversion: ",salario_conversion )
                        console.log("sumatoria_incapacidades: ",sumatoria_incapacidades )
                        console.log("tipo_incapacidad: ", tipo_incapacidad )
                        console.log("cantidad_dias: ",cantidad_dias )
                        console.log("cantidad_dias_conversion: ", cantidad_dias_conversion )
                        console.log("politicaAplicada: ", politicaAplicada)




                    }


                    /* LIQUIDACION SIN PRORROGA */
                    if (liq_prorroga === 'NO') {


                        /* PORCENTAJE A LIQUIDAR DEL EMPLEADOR SEGUN POLITICAS */
                        Liq_porcentaje_liquidacion_empleador = parseFloat(politicaAplicada.porcentaje_liquidacion_empleador) || 0;

                        console.log("Liq_porcentaje_liquidacion_empleador", Liq_porcentaje_liquidacion_empleador);


                        /* FUNCION QUE TRAAE LA ULTIMA INCAPACIDAD DEL EMPLEADO */
                        const data_incapacidades_liquidadas = await getUltimasIncapacidadesIdEmpleado(id_empleado);
                        console.log("data_incapacidades_liquidadas", data_incapacidades_liquidadas);


                        /* TRAER LAS FECHAS DE LA INCAPACIDAD ANTERIOR Y LA NUEVA INCAPACIDAD */
                        const fecha_inicio_incapacidad_anterior = data_incapacidades_liquidadas?.fecha_inicio_incapacidad;
                        const fecha_final_incapacidad_anterior = data_incapacidades_liquidadas?.fecha_final_incapacidad;
                        const fecha_inicial_incapacidad_liquidar = formatDate2(data.fecha_inicio_incapacidad);
                        const fecha_final_incapacidad_liquidar = formatDate2(data.fecha_final_incapacidad);

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
                        console.log("FUNCION DIAS NO REPETIDOS:", diasNoRepetidos);


                        /* CALCULA EL NUMERO DE DÁIS ALIQUIDAR POR PARTE DEL EMPLEADOR */
                        const liq_dias_empleador = Math.min(diasNoRepetidos.length, 2);
                        console.log("liq_dias_empleador", liq_dias_empleador);


                        /* CALCULA EL NUMERO DE DIAS A LIQUIDAR POR PARTE DE LA EPS SIN DÍAS NEGATIVOS */
                        const liq_dias_eps = Math.max(0, diasNoRepetidos.length - liq_dias_empleador);
                        console.log("liq_dias_eps", liq_dias_eps);

                        
                        /* TRAER PORCENTAJE A LIQUIDAR POR PARTE DE EPS */
                        Liq_porcentaje_liquidacion_eps = parseFloat( politicaAplicada.porcentaje_liquidacion_eps  ) || 0;
                        console.log("Liq_porcentaje_liquidacion_eps", Liq_porcentaje_liquidacion_eps);


                        /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE EMPLEADOR */
                        const liq_valor_empleador = entityLiquidationEmpleador(
                            data.salario_empleado,
                            Liq_porcentaje_liquidacion_empleador,
                            liq_dias_empleador
                        );
                        console.log("liq_valor_empleador", liq_valor_empleador);


                        /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE EPS  */
                        const liq_valor_eps = entityLiquidation(
                            data.salario_empleado,
                            Liq_porcentaje_liquidacion_eps,
                            liq_dias_eps
                        );
                        console.log("liq_valor_eps", liq_valor_eps);

                        total_dias_liquidar = liq_dias_empleador + liq_dias_eps
                        console.log("LOS DÍAS TOTALES A LIQUIDAR SON: ", total_dias_liquidar)

                        /* SE RECUPERAN DATOS PARA INGRESAR A LA EPS */
                        const upd_liq_dias_empleador = liq_dias_empleador;
                        const upd_liq_dias_eps = liq_dias_eps;
                        const upd_liq_dias_arl = liq_dias_arl;
                        const upd_liq_dias_fondo_pensiones = liq_dias_fondo;
                        const upd_liq_dias_eps_fondo_pensiones = liq_dias_eps_fondo;
                        const upd_Liq_porcentaje_liquidacion_empleador = Liq_porcentaje_liquidacion_empleador;
                        const upd_Liq_porcentaje_liquidacion_eps = Liq_porcentaje_liquidacion_eps;
                        const upd_Liq_porcentaje_liquidacion_arl = Liq_porcentaje_liquidacion_arl;
                        const upd_Liq_porcentaje_liquidacion_fondo_pensiones = Liq_porcentaje_liquidacion_fondo_pensiones;
                        const upd_Liq_porcentaje_liquidacion_eps_fondo_pensiones = Liq_porcentaje_liquidacion_eps_fondo_pensiones;
                        const upd_liq_valor_empleador = liq_valor_empleador;
                        const upd_liq_valor_eps = liq_valor_eps;
                        const upd_liq_valor_arl = liq_valor_arl;
                        const upd_liq_valor_fondo_pensiones = liq_valor_fondo_pensiones;
                        const upd_liq_valor_eps_fondo_pensiones = liq_valor_eps_fondo_pensiones;
                        const upd_dias_Laborados = dias_laborados;
                        const upd_id_liquidacion = id_liquidacion;
                        const upd_dias_liquidables_totales = total_dias_liquidar

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
                            upd_dias_liquidables_totales
                        );
                        console.log("DATOS ACTUALIZADOS, INCAPACIDAD LIQUIDADA:", updateSettlementTableLiq);

                        await updateDownloadStatus(id_historial);
                        console.log("ACTUALIZADO, SIN PRORROGA");

                        return res.json({
                            message: `Actualización realizada: incapacidad sin prórroga. Total de días a liquidar por parte del empleador: ${liq_dias_empleador}. Días a liquidar por parte de EPS: ${liq_dias_eps}`
                        });
                        

                    }


                break;


                /* ARL */
                case 'ARL':
                    
                    let sumatoria_incapacidades = 0

                    /* INCAPACIDAD ARL SIN PRORROGA */
                    if(liq_prorroga === 'NO'){

                        /* SE CALCULA LA CANTIDAD DE DIAS A LIQUIDAR POR PARTE DE ARL */
                        liq_dias_arl = cantidad_dias
                        console.log("DIAS A LIQUIDAR ARL: ", liq_dias_arl)


                        /* CALCULAR EL PORCENTAJE A LIQUIDAR */
                        Liq_porcentaje_liquidacion_arl = parseFloat(politicaAplicada.porcentaje_liquidacion_arl) || 0;
                        console.log("PORCENTAJE A LIQUIDAR ARL: ", Liq_porcentaje_liquidacion_arl)


                        /* CALCULAR VALOR TOTAL A LIQUIDAR ARL */
                        liq_valor_arl = entityLiquidationEmpleador(data.salario_empleado, Liq_porcentaje_liquidacion_arl, liq_dias_arl);


                        /* ACTUALIZAR TABLA LIQUIDACION */
                        const updateSettlementTableLiqEmpleador = await updateSettlementTableARL(
                            liq_dias_empleador,
                            liq_dias_eps,
                            liq_dias_arl,
                            liq_dias_fondo,
                            liq_dias_eps_fondo,
                            Liq_porcentaje_liquidacion_empleador,
                            Liq_porcentaje_liquidacion_eps,
                            Liq_porcentaje_liquidacion_arl,
                            Liq_porcentaje_liquidacion_fondo_pensiones,
                            Liq_porcentaje_liquidacion_eps_fondo_pensiones,
                            liq_valor_empleador,
                            liq_valor_eps,
                            liq_valor_arl,
                            liq_valor_fondo_pensiones,
                            liq_valor_eps_fondo_pensiones,
                            dias_laborados,
                            id_liquidacion
                                                      
                        );


                        console.log("SALARIO:  ", data.salario_empleado)
                        console.log("NUMERO DE DÍAS A LIQUIDAR ARL: ", liq_dias_arl)
                        console.log("PORCENTAJE A LIQUIDAR ARL: ", Liq_porcentaje_liquidacion_arl)
                        console.log("VALOR TOTAL A LIQUIDAR ARL: ", liq_valor_arl)
                        console.log("INCAPACIDAD ACTUALIZADA: ", updateSettlementTableLiqEmpleador)

                    
                        const updateDownloadStatusLiq = await updateDownloadStatus(id_historial);   //Actualiza downloaded = 1, en la tabla liquidacion

                        console.log("ACTUALIZADO, SIN PRORROGA");

                        return res.json({
                             message: `Actualización realizada: incapacidad sin prórroga. Total de días a liquidar por parte de ARL : ${liq_dias_arl}.` 
                        });

                    }


                    if(liq_prorroga === 'SI'){

                        /* TRAEMOS EL ID DE LA INCAPACIDAD EXTENSION QUE NOS DA LA TABLAHISTORIAL */
                        const id_incapacidad_prorroga = data.id_incapacidad_extension
                        console.log("ID INCAPACIDAD EXTENSION: ", id_incapacidad_prorroga)

                        console.log("ARL PRORROGA, VALIDACION -----> 1")


                        /* SE GENERA LA CONSULTA A LA BASE DE DATOS LIQUIDACION PARA TRAER DATOS DE LA INCAPACIDAD PRORROGA */
                        const datosIncapacidadProrrogaARL = await getDatosIncapacidadProrrogaARL (id_incapacidad_prorroga)
                        console.log("DATOS DE LA INCAPACIDAD PRORROGA, getDatosIncapacidadProrrogaARL: ", datosIncapacidadProrrogaARL)


                        /* INCAPACIDAD CON PRORROGA*/
                        if(datosIncapacidadProrrogaARL){

                            console.log("---> datos ProrrogaARL: ", datosIncapacidadProrrogaARL)
                            
                            /* FORMATEAMOS FECHAS */
                            const fecha_inicio_incapacidad_anterior = formatDate2(datosIncapacidadProrrogaARL.fecha_inicio_incapacidad)
                            const fecha_final_incapacidad_anterior = formatDate2(datosIncapacidadProrrogaARL.fecha_final_incapacidad)
                            const fecha_inicial_incapacidad_liquidar = formatDate2(data.fecha_inicio_incapacidad);
                            const fecha_final_incapacidad_liquidar = formatDate2(data.fecha_final_incapacidad);

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
                            const parametroGrupoARL = transformarParametrosPolitica(data);

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


                            /* VERIFICAR SI HAY ACOMULADO EN TABLA PRORROGA PARA SUMAR EL TOTAL */
                            if(validacioTablaProrroga){
                                
                                /* SE DA LA SUMATORIA ACOMULADA CON LA TABLA PRORROGA Y SE PAGA AL 100% AL SER ARL */
                                const sumatoria_incapacidadesARL = validacioTablaProrroga.sumatoria_incapacidades + diasNoRepetidosALiquidarARL
                                console.log("SUMATORIA TOTAL CON INCAPACIDAD ACOMULADA: ", sumatoria_incapacidadesARL)

                                
                                /* TRAER PORCENTAJE A LIQUIDAR POR PARTE DE EPS */
                                let Liq_porcentaje_liquidacion_ARL = parseFloat( parametroGrupoARL.porcentaje_liquidacion_arl  ) || 100;
                                console.log("Liq_porcentaje_liquidacion_eps_grupoD", Liq_porcentaje_liquidacion_ARL);


                                /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE ARL  */
                                let liq_valor_ARL = entityLiquidation(
                                    data.salario_empleado,
                                    Liq_porcentaje_liquidacion_ARL,
                                    total_dias_liquidar
                                );
                                console.log("VALOR A LIQUIDAR POR PARTE DE ARL: ", liq_valor_ARL);

                                
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
                                    upd_dias_liquidables_totales
                                );
                                console.log("DATOS ACTUALIZADOS, INCAPACIDAD LIQUIDADA CON PRORROGA ARL:", updateSettlementTableLiq);


                                /* DATOS PARA ACTUALIZAR TABLA PRORROGA */
                                const up_T_prorroga_id_empleado = id_empleado
                                const up_T_prorroga_id_incapacidad_prorroga = id_incapacidad_prorroga
                                const up_T_prorroga_tipo_incapacidad_prorroga = datosIncapacidadProrrogaARL.tipo_incapacidad
                                const up_T_prorroga_fecha_inicio_incapacidad = datosIncapacidadProrrogaARL.fecha_inicio_incapacidad
                                const up_T_prorroga_fecha_final_incapacidad = datosIncapacidadProrrogaARL.fecha_final_incapacidad
                                const up_T_prorroga_dias_incapacidad_prorroga = datosIncapacidadProrrogaARL.cantidad_dias
                                const up_T_prorroga_dias_liquidables_totales_prorroga = datosIncapacidadProrrogaARL.dias_liquidables_totales
                                const up_T_prorroga_id_incapacidad_liquidacion = id_liquidacion
                                const up_T_prorroga_tipo_incapcidad = data.tipo_incapacidad
                                const up_T_prorroga_fehca_inicio = data.fecha_inicio_incapacidad
                                const up_T_prorroga_fecha_final = data.fecha_final_incapacidad
                                const up_T_prorroga_dias_incapacidad = data.cantidad_dias
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


                                return res.json({
                                    message: `Actualización realizada: incapacidad con prórroga.`
                                });

                            }    
                            
                            
                            /* SIN DATOS EN TABLA PRORROGA PARA SUMATORIA ACOMULADA */
                            if(!validacioTablaProrroga){
                                
                                console.log("VALIDACION 2, NO SE ENCUENTRA DATOS EN LA TABLA PRORROGA, SE DA SUMATORIA ENTRE LAS DOS INCAPACIDADES VINCULADAS: -----------------> validacioTablaProrroga", validacioTablaProrroga)

                                const sumatoria_incapacidadesARL = total_dias_liquidar + datosIncapacidadProrrogaARL.dias_liquidables_totales

                                console.log("SUMATORIA ENTRE LAS DOS INCAPACIDADES VINCULADAS, SIN SUMATORIA ACOMULADA YA QUE NO HAY REGISTRO EN TABLA PRORROGA: ", sumatoria_incapacidades)


                                /* TRAER PORCENTAJE A LIQUIDAR POR PARTE DE EPS */
                                let Liq_porcentaje_liquidacion_ARL = parseFloat( parametroGrupoARL.porcentaje_liquidacion_arl  ) || 100;
                                console.log("Liq_porcentaje_liquidacion_eps_grupoD", Liq_porcentaje_liquidacion_ARL);


                                
                                /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE FARL  */
                                let liq_valor_ARL = entityLiquidation(
                                    data.salario_empleado,
                                    Liq_porcentaje_liquidacion_ARL,
                                    total_dias_liquidar
                                );
                                console.log("VALOR A LIQUIDAR POR PARTE DE ARL: ", liq_valor_ARL);



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
                                    upd_dias_liquidables_totales
                                );
                                console.log("DATOS ACTUALIZADOS, INCAPACIDAD LIQUIDADA CON PRORROGA ARL:", updateSettlementTableLiq);


                                /* DATOS PARA ACTUALIZAR TABLA PRORROGA */
                                const up_T_prorroga_id_empleado = id_empleado
                                const up_T_prorroga_id_incapacidad_prorroga = id_incapacidad_prorroga
                                const up_T_prorroga_tipo_incapacidad_prorroga = datosIncapacidadProrrogaARL.tipo_incapacidad
                                const up_T_prorroga_fecha_inicio_incapacidad = datosIncapacidadProrrogaARL.fecha_inicio_incapacidad
                                const up_T_prorroga_fecha_final_incapacidad = datosIncapacidadProrrogaARL.fecha_final_incapacidad
                                const up_T_prorroga_dias_incapacidad_prorroga = datosIncapacidadProrrogaARL.cantidad_dias
                                const up_T_prorroga_dias_liquidables_totales_prorroga = datosIncapacidadProrrogaARL.dias_liquidables_totales
                                const up_T_prorroga_id_incapacidad_liquidacion = id_liquidacion
                                const up_T_prorroga_tipo_incapcidad = data.tipo_incapacidad
                                const up_T_prorroga_fehca_inicio = data.fecha_inicio_incapacidad
                                const up_T_prorroga_fecha_final = data.fecha_final_incapacidad
                                const up_T_prorroga_dias_incapacidad = data.cantidad_dias
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


                                return res.json({
                                    message: `Actualización realizada: incapacidad con prórroga ARL. No cuenta con Prorroga acomulativa.`
                                });

                            }

                        }


                        /* CONDICIONAL SI NO HAY INCAPACIDAD CON PRORROGA */
                        if(!datosIncapacidadProrrogaARL){

                            console.log("NO SE ENCONTRO DATOS DE LA PRORROGA DE ARL SOBRE LA INCAPACIDAD SELECCIONADA, DE ACTUALIZA PRORROGA A 'NO' ")
                            
                            const actuaizarProrrogaTabHistorial = await updateDisabilitySettlementExtensionHis(id_historial)
                            console.log("SE ACTUALIZA PRORROGA A NO: ", actuaizarProrrogaTabHistorial)

                            // Reejecuta el proceso desde el inicio
                            return await processDownloadUserDisability(id_liquidacion, id_historial, res);

                        }



                    }

                    
                break;


                default:
                    // otros casos
                    break;
            }
        }





    } catch (error) {
        console.error("Error en processDownloadUserDisability:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};
