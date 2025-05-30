import { getIdEmpleadoByHistorial } from "../../repositories/api-download-user-disability/getIdEmpleadoByHistorial.js";
import { getDisabilityDischargeHistory } from "../../repositories/api-download-user-disability/getDisabilityDischargeHistory.js";
import { uploadFilesroutes } from "../../repositories/api-download-user-disability/uploadFilesroutes.js";
import { updateLiquidacoinTableIncapacity } from "../../repositories/api-download-user-disability/updateLiquidacoinTableIncapacity.js";
import { transformarParametrosPolitica } from '../../utils/api-download-user-disability/transformPolicyParameters.js'
import { getPoliticaByParametros } from "../../repositories/api-download-user-disability/getPoliticaByParametros.js";
 



export async function dataPrincipalLiquidacion(id_liquidacion, id_historial) {
  try {


    /* TARER ID DEL EMPLEADO */
    const id_empleado = await getIdEmpleadoByHistorial(id_historial);


    if (!id_liquidacion || !id_historial || !id_empleado) {
      throw new Error("Faltan parámetros en la solicitud.");
    }


    /* TRAER LA ULTIMA INCAPACIDAD DE TABLA HISTORIAL  PARA ACTUALIZAR TABLA LIQUIDACION*/
    const disabilityDischargeHistory = await getDisabilityDischargeHistory(
      id_empleado,
      id_historial
    );
    if (!disabilityDischargeHistory) {
      throw new Error(
        "No se encontró la incapacidad con los datos proporcionados."
      );
    }


    /* DATA - GUARDA LOS DATOS DE LA TABLA HISTORIAL PARA ACTUALIZAR DATOS EN LA TABLA LIQUIDACION */
    const data = disabilityDischargeHistory;
    console.log("🧾 Datos encontrados TABLA HISTORIAL:", data);


    /* SE CARGAN LAS RUTAS DONDE SE ALOJAN LOS FILES EN UPLOAD, SE TOMAN DE LA TABLA ruta_documentos */
    const uploadFiles = await uploadFilesroutes(id_historial, id_liquidacion);


    /* ACTUALIZAR LOS DATOS EN LA TABLA LIQUIDACION CON DATA (ENCAPSULAMIENTO) */
    const updateResult = await updateLiquidacoinTableIncapacity(data);
    if (updateResult.affectedRows === 0) {
        throw new Error('No se pudo actualizar la liquidación.');
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
        throw new Error('No se encontró ninguna política para liquidar la incapacidad.');
    }


    /* VALDIAMOS SI CUMPLE CON ALGUN APOLITICA INICIALMENTE */
    const Liq_cumplimiento = politicaAplicada.cumplimiento;
    const liq_prorroga = parametros.prorroga.toUpperCase();


    return{
        id_empleado,
        parametros,
        politicaAplicada,
        Liq_cumplimiento,
        liq_prorroga,
        data
    }


  } catch (error) {

     throw new Error('Error al traer ');
  }
}
