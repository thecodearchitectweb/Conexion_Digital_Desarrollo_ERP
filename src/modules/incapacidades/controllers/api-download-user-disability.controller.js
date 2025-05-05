// IMPORTACIONES NECESARIAS
import { pool } from "../../../models/db.js";
import express from 'express';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { getUltimasIncapacidades } from '../repositories/api-download-user-disability/incapacidadesHelpers.js';
import { getIdEmpleadoByHistorial } from '../repositories/api-download-user-disability/getIdEmpleadoByHistorial.js';
import { getDisabilityDischargeHistory } from '../repositories/api-download-user-disability/getDisabilityDischargeHistory.js';
import { updateLiquidacoinTableIncapacity, updateDownloadStatus } from '../repositories/api-download-user-disability/updateLiquidacoinTableIncapacity.js';
import { getPoliticaByParametros } from '../repositories/api-download-user-disability/getPoliticaByParametros.js';
import { formatDate, formatDate2 } from '../utils/formatDate/formatDate.js';
import { validarProrroga } from '../utils/api-download-user-disability/validarProrroga.js';
import { updateDisabilitySettlementExtensionLiq, updateDisabilitySettlementExtensionHis } from '../repositories/api-download-user-disability/updateDisabilitySettlementExtension.js';
import { calculateDaysEps } from '../utils/api-download-user-disability/calculateDaysEps.js'
import { entityLiquidation, entityLiquidationEmpleador } from '../utils/api-download-user-disability/entityLiquidation.js'
import { updateSettlementTable, updateSettlementTableEmpleador } from '../repositories/api-download-user-disability/updateSettlementTable.js'
import { calcularDiasLiquidar } from '../utils/api-download-user-disability/calcularDiasLiquidarSinProrroga.js'

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


        /* TRAER LA ULTIMA INCAPACIDAD DE TABLA HISTORIAL */
        const disabilityDischargeHistory = await getDisabilityDischargeHistory(id_empleado, id_historial);
        if (!disabilityDischargeHistory) {
            return res.status(404).json({ message: "No se encontró la incapacidad con los datos proporcionados." });
        }


        /* DATA - PARA DATOS DE LA TABLA HISTORIAL */
        const data = disabilityDischargeHistory;
        console.log("🧾 Datos encontrados:", data);


        /* ACTUALIZAR LOS DATOS EN LA TABLA LIQUIDACION */
        const updateResult = await updateLiquidacoinTableIncapacity(data);
        if (updateResult.affectedRows > 0) {
            return res.status(200).json({ message: "Información actualizada correctamente." });
        }




        /* FILTRO PARA CARGAR INCAPACIDAD */
        const fechaContratacionRaw = new Date(data.fecha_contratacion);
        const hoy = new Date();
        const diasLaborados = differenceInDays(hoy, fechaContratacionRaw) + 1;
        const diasLaborados_conversion = diasLaborados >= 30 ? ">30" : "<30";

        const SMMLV = 1423500;
        const P_salario_conversion = data.salario_empleado > SMMLV ? ">SMLV" : "SMLV";
        const P_tipo_incapacidad = data.tipo_incapacidad;
        const P_N_dias_incapacidad = data.cantidad_dias
        const P_N_dias_incapacidad_conversion = data.cantidad_dias > 2 ? ">2" : "<3";
        const P_prorroga_texto_conversion = data.prorroga === 1 ? "SI" : "NO";


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

        const Liq_cumplimiento = politicaAplicada.cumplimiento;
        const liq_prorroga = P_prorroga_texto_conversion.toUpperCase();


        /* DIAS A LIQUIDAR */
        let liq_dias_empleador = 0;
        let liq_dias_eps = 0;
        let liq_dias_arl = 0;
        let liq_dias_fondo = 0;
        let liq_dias_eps_fondo = 0;


        /* VALOR TOTAL A LIQUIDAR POR ENTIDAD */
        let liq_valor_empleador = 0;
        let liq_valor_eps = 0;
        let liq_valor_arl = 0;
        let liq_valor_fondo_pensiones = 0;
        let liq_valor_eps_fondo_pensiones = 0; // <- CAMBIAR DE const A let

        
        /* PORCENTAJE A LIQUIDAR EMPLEADOR, EPS, ARL, FONDO DE PENSIONES, EPS - FONDO DE PENSIONES */
        let Liq_porcentaje_liquidacion_empleador =  0;
        let Liq_porcentaje_liquidacion_eps = 0;
        let Liq_porcentaje_liquidacion_arl = 0;
        let Liq_porcentaje_liquidacion_fondo_pensiones =  0;
        let Liq_porcentaje_liquidacion_eps_fondo_pensiones =  0;




        /* SELECCION DEL CASO */
        switch (P_tipo_incapacidad) {
            
            case 'EPS':
              
                if (Liq_cumplimiento === 'SI') {
                    
                    if (liq_prorroga === 'SI') {
                
                
                        /* SE LLAMA FUNCION PARA TRAER LAS ULTIMAS INCAPACIDADES DEL USER */
                        const data_incapacidades_liquidadas = await getUltimasIncapacidades(id_empleado);
                
                        
                        /* FECHA DE LA INCAPACIDAD ANTERIOR Y LA QUE ESTA LISTA PARA LIQUIDAR */
                        const fecha_inicio_incapacidad_anterior = formatDate2(data_incapacidades_liquidadas.fecha_inicio_incapacidad);
                        const fecha_final_incapacidad_anterior = formatDate2(data_incapacidades_liquidadas.fecha_final_incapacidad);
                        const fecha_inicial_incapacidad_liquidar = formatDate2(data.fecha_inicio_incapacidad);
                        const fecha_final_incapacidad_liquidar = formatDate2(data.fecha_final_incapacidad);
                
                        
                        /* CODIGO DE CATEGORIA INCAPACIDAD ANTERIOR - INCAPACIDAD A LIQUIDAR */
                        const codigo_categoria_liquidar = data_incapacidades_liquidadas.codigo_categoria;
                        const codigo_categoria_anterior = data.codigo_categoria;
                
                
                        /* FUNCION PARA VALIDAR SI APLICA LA PRORROGA - VALIDACION DE FECHAS */
                        const prorrogaValida = validarProrroga(
                            fecha_inicio_incapacidad_anterior,
                            fecha_final_incapacidad_anterior,
                            fecha_inicial_incapacidad_liquidar,
                            fecha_final_incapacidad_liquidar
                        );
                
                
                        // 🔸 Validar si el código de categoría coincide también
                        const mismaCategoria = codigo_categoria_liquidar === codigo_categoria_anterior;
                
                
                            // LOGICA PARA ACTUALIZAR TABLAS Y EJECUTAR LOS CALCULOS SI SE CUMPLEN
                            if (prorrogaValida && mismaCategoria) {
                    
                                
                                /* DIAS A LIQUIDAR EMPLEADOR, ARL, FONDO DE PENSIONES, EPS - FONDO DE PENSIONES */
                                liq_dias_empleador = 0;
                                liq_dias_arl = 0;
                                liq_dias_fondo = 0;
                                liq_dias_eps_fondo = 0;
                    
                                
                                /* DIAS A LIQUIDAR LA EPS - FUNCION QUE CALCULA LIQUIDACION */
                                liq_dias_eps = calculateDaysEps(fecha_final_incapacidad_anterior, fecha_final_incapacidad_liquidar);
                    
                    
                                /* PORCENTAJE A LIQUIDAR EMPLEADOR, EPS, ARL, FONDO DE PENSIONES, EPS - FONDO DE PENSIONES */
                                Liq_porcentaje_liquidacion_empleador = parseFloat(politicaAplicada.porcentaje_liquidacion_empleador) || 0;
                                Liq_porcentaje_liquidacion_eps = parseFloat(politicaAplicada.porcentaje_liquidacion_eps) || 0;
                                Liq_porcentaje_liquidacion_arl = parseFloat(politicaAplicada.porcentaje_liquidacion_arl) || 0;
                                Liq_porcentaje_liquidacion_fondo_pensiones = parseFloat(politicaAplicada.porcentaje_liquidacion_fondo_pensiones) || 0;
                                Liq_porcentaje_liquidacion_eps_fondo_pensiones = parseFloat(politicaAplicada.porcentaje_liquidacion_eps_fondo_pensiones) || 0;
                    
                    
                                /* LIQUIDACION TOTAL EPS ARL, FONDO DE PENSIONES, EPS - FONDO DE PENSIONES*/
                                liq_valor_eps = entityLiquidation(data.salario_empleado, Liq_porcentaje_liquidacion_eps, liq_dias_eps);
                                liq_valor_empleador = 0;
                                liq_valor_arl = 0;
                                liq_valor_fondo_pensiones = 0;
                                liq_valor_eps_fondo_pensiones = 0;
                    
                    
                                /* RESULTADOS:  */
                                console.log(": ");
                                console.log("FECHA INICIO INCAPACIDAD ANTERIROR: ", fecha_inicio_incapacidad_anterior);
                                console.log("FECHA FINAL INCAPACIDAD ANTERIROR: ", fecha_final_incapacidad_anterior);
                                console.log("FECHA INICIAL INCAPACIDAD A LIQUIDAR: ", fecha_inicial_incapacidad_liquidar);
                                console.log("FECHA FINAL INCAPACIDAD A LIQUIDAR: ", fecha_final_incapacidad_liquidar);
                                console.log("CATEGORIA INCAPACIDAD ANTERIOR: ", codigo_categoria_anterior);
                                console.log("CATEGORIA INCAPACIDAD A LIQUIDAR: ", codigo_categoria_liquidar);
                                console.log("¿APLICA PRORROGA? - FUNCION: ", prorrogaValida);
                                console.log("COINCIDENCIA EN CATEGORIA?: ", mismaCategoria);
                                console.log("CANTIDAD DE DIAS A LIQUIDAR EPS: ", liq_dias_eps);
                                console.log("PORCENTAJE A LIQUIDAR EMPLEADOR: ", Liq_porcentaje_liquidacion_empleador);
                                console.log("PORCENTAJE A LIQUIDAR: EPS", Liq_porcentaje_liquidacion_eps);
                                console.log("PORCENTAJE A LIQUIDAR: ARL", Liq_porcentaje_liquidacion_arl);
                                console.log("PORCENTAJE A LIQUIDAR: FONDO PENSIONES", Liq_porcentaje_liquidacion_fondo_pensiones);
                                console.log("PORCENTAJE A LIQUIDAR: F.P Y EPS", Liq_porcentaje_liquidacion_eps_fondo_pensiones);
                                console.log("TOTAL LIQUIDACION:  ", liq_valor_eps);
                                console.log(": ");
                    
                    
                                /* ACTUALIZAR TABLA LIQUIDACION CON DATOS OBTENIDOS DE PRORROGA */
                                const updateSettlementTableLiq = await updateSettlementTable(
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
                                diasLaborados,
                                id_liquidacion
                                );
                    
                                console.log("DATOS ACTUALIZADOS, INCAPACIDAD LIQUIDADA: ", updateSettlementTableLiq);
                    
                    
                                /* ACTUALIZA LA TABLA LIQUIDACION EN downloaded = 1 */
                                const updateDownloadStatusLiq = await updateDownloadStatus(id_historial);
                                console.log("Prórroga aplicada correctamente, DOWNLOAD:", updateDownloadStatusLiq);
                                return res.json({ message: "ACTUALIZADO, PRORROGA APLICADA CORRECTAMENTE" });
                
                            } else {
                    
                                /* ACTUALIZA PRORROG A 0, Y LLAMA DE NUEVO LA FUNCION PARA EJECUTAR NUEVAMENTE EL ALGORITMO */
                                const updateDisabilityExtensionliq = await updateDisabilitySettlementExtensionLiq(id_historial);   //Actualiza prorroga de tabla liquidacion a 0
                                const updateDisabilityExtensionHis = await updateDisabilitySettlementExtensionHis(id_historial);   // Actualiza prorroga de tabla Historial a 0
                    
                    
                                // 🔵 IMPORTANTE: Volver a iniciar la función después de actualizar
                                console.log("Reiniciando proceso luego de actualizar prórroga y descarga...");
                    
                                
                                // ⚡ Llamada recursiva para reiniciar el proceso
                                return await processDownloadUserDisability(id_liquidacion, id_historial, res);
                            }
                    } 
                    
                    if (liq_prorroga === 'NO') {

                        /* validar N de dias de la incapacidad, si es menor a 3, unicamente paga el empleador */
                        if (P_N_dias_incapacidad  < 3) {

                            /* se calcula el numero de días que el empleador debe liquidar al empleado */
                            liq_dias_empleador = P_N_dias_incapacidad
                            

                            /* CALCULAR EL PORCENTAJE A LIQUIDAR POR EMPLEADOR */
                            Liq_porcentaje_liquidacion_empleador = parseFloat(politicaAplicada.porcentaje_liquidacion_empleador) || 0;                            


                            /* CALCULAR VALOR TOTAL A LIQUIDAR EMPLEADOR */
                            liq_valor_empleador = entityLiquidationEmpleador(data.salario_empleado, Liq_porcentaje_liquidacion_empleador, liq_dias_empleador);
                            

                            /* ACTUALIZAR TABLA LIQUIDACION */
                            const updateSettlementTableLiqEmpleador = await updateSettlementTableEmpleador(
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
                                    diasLaborados,
                                    id_liquidacion
                                );



                            console.log("SALARIO:  ", data.salario_empleado)
                            console.log("NUMERO DE DÍAS A LIQUIDAR: ", liq_dias_empleador)
                            console.log("PORCENTAJE A LIQUIDAR EMPLEADOR: ", Liq_porcentaje_liquidacion_empleador)
                            console.log("VALOR TOTAL A LIQUIDAR EMPLEADOR: ", liq_valor_empleador)
                            console.log("INCAPACIDAD ACTUALIZADA: ", updateSettlementTableLiqEmpleador)
                        }


                        if (P_N_dias_incapacidad > 2){


                            /* se calcula el numero de días que el empleador debe liquidar al empleado */
                            liq_dias_empleador = 2
                            console.log("liq_dias_empleador", liq_dias_empleador)


                            /* CALCULAR EL PORCENTAJE A LIQUIDAR POR EMPLEADOR */
                            Liq_porcentaje_liquidacion_empleador = parseFloat(politicaAplicada.porcentaje_liquidacion_empleador) || 0;   
                            console.log("Liq_porcentaje_liquidacion_empleador", Liq_porcentaje_liquidacion_empleador)


                            /* CALCULAR VALOR TOTAL A LIQUIDAR EMPLEADOR */
                            liq_valor_empleador = entityLiquidationEmpleador(data.salario_empleado, Liq_porcentaje_liquidacion_empleador, liq_dias_empleador);
                            console.log("liq_valor_empleador", liq_valor_empleador)


                            /* SE LLAMA FUNCION PARA TRAER LAS ULTIMAS INCAPACIDADES DEL USER */
                            const data_incapacidades_liquidadas = await getUltimasIncapacidades(id_empleado);
                            console.log("data_incapacidades_liquidadas", data_incapacidades_liquidadas)



                            const fecha_inicio_incapacidad_anterior = data_incapacidades_liquidadas?.fecha_inicio_incapacidad
                            const fecha_final_incapacidad_anterior =  data_incapacidades_liquidadas?.fecha_final_incapacidad 
                            const fecha_inicial_incapacidad_liquidar = formatDate2(data.fecha_inicio_incapacidad);
                            const fecha_final_incapacidad_liquidar = formatDate2(data.fecha_final_incapacidad);

                            console.log("fecha_inicio_incapacidad_anterior", fecha_inicio_incapacidad_anterior)
                            console.log("fecha_final_incapacidad_anterior", fecha_final_incapacidad_anterior)
                            console.log("fecha_inicial_incapacidad_liquidar", fecha_inicial_incapacidad_liquidar)
                            console.log("fecha_final_incapacidad_liquidar", fecha_final_incapacidad_liquidar)



                             /* FUNCION PARA  VALIDACION DE FECHAS - CALCULAR NUMERO DE DÍAS A LIQUIDAR */
                            const diasALiquidar = calcularDiasLiquidar(
                                fecha_inicio_incapacidad_anterior,
                                fecha_final_incapacidad_anterior,
                                fecha_inicial_incapacidad_liquidar,
                                fecha_final_incapacidad_liquidar
                            );

                            console.log("Calculo de dias a liquidar: ", diasALiquidar)
                


                            /* DIAS A LIQUIDAR EPS  */
                            liq_dias_eps = diasALiquidar - liq_dias_empleador
                            console.log("Días a liquidar EPS",liq_dias_eps )

                            console.log("LIQUIDACION PORCENTAJE LIQUIDACION EPS: ", Liq_porcentaje_liquidacion_eps)


                            /* CALCULAR VALOR TOTAL A LIQUIDAR EPS */
                            liq_valor_eps = entityLiquidation(data.salario_empleado, politicaAplicada.porcentaje_liquidacion_eps, liq_dias_eps);


                            /* CONSTANTES PARA ACTUALIZAR LA BASE DE DATOS */
                            const upd_liq_dias_empleador = liq_dias_empleador
                            const upd_liq_dias_eps = liq_dias_eps
                            const upd_liq_dias_arl = liq_dias_arl
                            const upd_liq_dias_fondo_pensiones = liq_dias_fondo
                            const upd_liq_dias_eps_fondo_pensiones = liq_dias_eps_fondo
                            const upd_Liq_porcentaje_liquidacion_empleador = Liq_porcentaje_liquidacion_empleador
                            const upd_Liq_porcentaje_liquidacion_eps = politicaAplicada.porcentaje_liquidacion_eps
                            const upd_Liq_porcentaje_liquidacion_arl = Liq_porcentaje_liquidacion_arl
                            const upd_Liq_porcentaje_liquidacion_fondo_pensiones = Liq_porcentaje_liquidacion_fondo_pensiones
                            const upd_Liq_porcentaje_liquidacion_eps_fondo_pensiones = Liq_porcentaje_liquidacion_eps_fondo_pensiones
                            const upd_liq_valor_empleador = liq_valor_empleador
                            const upd_liq_valor_eps = liq_valor_eps
                            const upd_liq_valor_arl = liq_valor_arl
                            const upd_liq_valor_fondo_pensiones = liq_valor_fondo_pensiones
                            const upd_liq_valor_eps_fondo_pensiones = liq_valor_eps_fondo_pensiones
                            const upd_dias_Laborados = diasLaborados
                            const upd_id_liquidacion = id_liquidacion


                            console.log("upd_liq_dias_empleador", upd_liq_dias_empleador)
                            console.log("upd_liq_dias_eps", upd_liq_dias_eps)
                            console.log("upd_liq_dias_arl", upd_liq_dias_arl)
                            console.log("upd_liq_dias_fondo_pensiones", upd_liq_dias_fondo_pensiones)
                            console.log("upd_liq_dias_eps_fondo_pensiones", upd_liq_dias_eps_fondo_pensiones)
                            console.log("upd_Liq_porcentaje_liquidacion_empleador", upd_Liq_porcentaje_liquidacion_empleador)
                            console.log("upd_Liq_porcentaje_liquidacion_eps", upd_Liq_porcentaje_liquidacion_eps)
                            console.log("upd_Liq_porcentaje_liquidacion_arl", upd_Liq_porcentaje_liquidacion_arl)
                            console.log("upd_Liq_porcentaje_liquidacion_fondo_pensiones", upd_Liq_porcentaje_liquidacion_fondo_pensiones)
                            console.log("upd_Liq_porcentaje_liquidacion_eps_fondo_pensiones", upd_Liq_porcentaje_liquidacion_eps_fondo_pensiones)
                            console.log("upd_liq_valor_empleador", upd_liq_valor_empleador)
                            console.log("upd_liq_valor_eps", upd_liq_valor_eps)
                            console.log("upd_liq_valor_arl", upd_liq_valor_arl)
                            console.log("upd_liq_valor_fondo_pensiones", upd_liq_valor_fondo_pensiones)
                            console.log("upd_liq_valor_eps_fondo_pensiones", upd_liq_valor_eps_fondo_pensiones)
                            console.log("upd_dias_Laborados", upd_dias_Laborados)
                            console.log("upd_id_liquidacion", upd_id_liquidacion)



                            /* ACTUALIZAR TABLA LIQUIDACION CON DATOS OBTENIDOS DE PRORROGA */
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
                                upd_id_liquidacion
                                );


                            console.log("DATOS ACTUALIZADOS, INCAPACIDAD LIQUIDADA: ", updateSettlementTableLiq);


                            
                        }


                        const updateDownloadStatusLiq = await updateDownloadStatus(id_historial);   //Actualiza downloaded = 1, en la tabla liquidacion
                        console.log("ACTUALIZADO, SIN PRORROGA");
                        return res.json({ message: "ACTUALIZADO, SIN PRORROGA" });
                    }
              }
              break;
          
            case 'ARL':
            // Podrías duplicar o ajustar el bloque según lo que cambie con ARL
            break;


            default:
              // otros casos
              break;
          }
          


    } catch (error) {
        console.error("Error en processDownloadUserDisability:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};
