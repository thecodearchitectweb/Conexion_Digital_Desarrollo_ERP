import { transformarParametrosPolitica } from "../../../../utils/api-download-user-disability/transformPolicyParameters.js";

export async function epsLicencias(id_liquidacion, id_historial,  proceso_1) {
    try {

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


        /* TRAER POLITICA CON LOS DATOS INGRESADOS  */
        const politica = await getPoliticaLicencia(
            prorroga,
            dias_laborados_conversion,
            salario_conversion,
            tipo_incapacidad,
            origen_incapacidad
        );




    } catch (error) {
        
    }
}



/* 


Procesando liquidacion para licencia de maternidad o paternidad
Estos son los datos de parametros en las licencias {
  prorroga: 'NO',
  dias_laborados_conversion: '>30',
  dias_laborados: 742,
  salario: '>SMLV',
  tipo_incapacidad: 'EPS',
  dias_incapacidad_conversion: '>2',
  dias_incapacidad: 3
}
  


*/