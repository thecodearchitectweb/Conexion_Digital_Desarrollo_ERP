// IMPORTACIONES NECESARIAS
import { pool } from "../../../models/db.js";
import express from 'express';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { getUltimasIncapacidades, getUltimasIncapacidadesIdEmpleado } from '../repositories/api-download-user-disability/incapacidadesHelpers.js';
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
import { transformarParametrosPolitica } from '../utils/api-download-user-disability/transformPolicyParameters.js'
import { uploadFilesroutes } from '../repositories/api-download-user-disability/uploadFilesroutes.js'
import { obtenerDiasNoRepetidos, obtenerDiasEntreFechas } from '../utils/api-download-user-disability/calcularDiasLiquidar.js'
import { getDatosIncapacidadProrroga } from '../repositories/api-download-user-disability/get_incapacidad_prorroga.js'
import { obtenerDiasNoRepetidosProrroga } from '../services/api-download-user-disability/obtenerDiasNoRepetidos.js'

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
                        console.log("Días no repetidos a liquidar por prórroga:", diasNoRepetidos.length);
                    

                        /* SE GUARDA LOS DÍAS REALES A LIQUIDAR */
                        total_dias_liquidar = diasNoRepetidos.length
                        console.log("DÍAS REALES A LIQUIDAR: ", total_dias_liquidar)

                        
                        /* DIAS LIQUIDADOS DE LA INCAPACIDAD ANTERIROR */
                        console.log("DIAS LIQUIDADOS DE LA INCAPACIDAD ANTERIROR", datosIncapacidadProrroga.dias_liquidables_totales)

                        /* SE REALIZA LA SUMATORIA DE LOS DIAS LIQUIDADOS DE LA INCAPACIDAD ANTERIOR CON LOS DÍAS LIQUIDABLE DE LA NUEVA INCAPACIDAD */
                        const sumatoria_incapacidades = total_dias_liquidar + datosIncapacidadProrroga.dias_liquidables_totales
                        console.log("ESTA ES LA SUMATORIA TOTAL DE LAS INCAPACIDADES ANTERIROR Y POSTERIROR:  ", sumatoria_incapacidades)

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
                        return res.json({ message: `Actualización realizada: incapacidad sin prórroga. Total de días a liquidar por parte de ARL : ${liq_dias_arl}.` });

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
