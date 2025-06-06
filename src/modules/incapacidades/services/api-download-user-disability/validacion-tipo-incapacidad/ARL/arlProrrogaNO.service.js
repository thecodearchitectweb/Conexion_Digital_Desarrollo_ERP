
import { complementoIncapacidadARL } from "../../../../repositories/api-download-user-disability/complemento-incapacidad/complemento_incapacidad.js";
import { getPoliticaByParametros } from "../../../../repositories/api-download-user-disability/getPoliticaByParametros.js";
import { updateSettlementTableARL } from "../../../../repositories/api-download-user-disability/updateSettlementTable.js";
import { entityLiquidation } from "../../../../utils/api-download-user-disability/entityLiquidation.js";

import {transformarParametrosPolitica } from '../../../../utils/api-download-user-disability/transformPolicyParameters.js'
import { acomuladoDeuda } from "../../acomulado-deuda-incapacidad/acomulado.service.js";



export async function arlProrrogaNO(id_liquidacion, id_historial,  proceso_1, id_user_session){

    try {
        
        /* FILTRO PARA CARGAR LA POLITCA SUGERIDA A LA NUEVA INCAPACIDAD*/
        const parametros = transformarParametrosPolitica(proceso_1.data);
        console.log("PARAMETROS: ", parametros)

        
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
        



        /* CONSTANTES PARA VALIDAR POLITICAS  EN LOS DIFERENTES CASOS*/
        const prorroga_conversion = parametros.prorroga;
        const dias_laborados_conversion = parametros.dias_laborados_conversion;
        const dias_laborados = parametros.dias_laborados
        const salario_conversion = parametros.salario;
        const tipo_incapacidad = parametros.tipo_incapacidad;
        const cantidad_dias = parametros.dias_incapacidad;
        const cantidad_dias_conversion = parametros.dias_incapacidad_conversion;



        console.log(" :", )
        console.log("prorroga_conversion:", prorroga_conversion)
        console.log(" dias_laborados_conversion:", dias_laborados_conversion)
        console.log("dias_laborados :",dias_laborados )
        console.log(" salario_conversion:", salario_conversion)
        console.log(" tipo_incapacidad:",tipo_incapacidad )
        console.log("cantidad_dias :",cantidad_dias )
        console.log(" cantidad_dias_conversion:", cantidad_dias_conversion)
        console.log(" :", )
        console.log(" :", )



        /* TRAER POLITICA CON LOS DATOS INGRESADOS  */
        const politicaAplicada = await getPoliticaByParametros(
            prorroga_conversion,
            dias_laborados_conversion,
            salario_conversion,
            tipo_incapacidad,
            cantidad_dias_conversion
        );


        /* SE CALCULA LA CANTIDAD DE DIAS A LIQUIDAR POR PARTE DE ARL */
        liq_dias_arl = cantidad_dias
        console.log("DIAS A LIQUIDAR ARL: ", liq_dias_arl)      

        
        /* CALCULAR EL PORCENTAJE A LIQUIDAR */
        Liq_porcentaje_liquidacion_arl = parseFloat(politicaAplicada.porcentaje_liquidacion_arl) || 0;
        console.log("PORCENTAJE A LIQUIDAR ARL: ", Liq_porcentaje_liquidacion_arl)


        /* CALCULA EL VALOR TOTAL A LIQUIDAR POR PARTE DE EMPLEADOR */
        liq_valor_arl = entityLiquidation(
            proceso_1.data.salario_empleado,
            Liq_porcentaje_liquidacion_arl,
            liq_dias_arl
        );
        console.log("EPS, valor a liquidar", liq_valor_arl);
        


        /* CALCULAR EL ACOMULATIVO SI APLICA  EPS PARA QUE EL EMPLEADOR NIVELE*/
        let acomuladoDeudaGrupoA = acomuladoDeuda(proceso_1.data.salario_empleado, Liq_porcentaje_liquidacion_arl, liq_dias_arl, id_liquidacion)
        console.log("ACOMULADO DEUDA GRUPO ARL SIN PRORROGA: ", acomuladoDeudaGrupoA)


        /* GUARDAMOS EN LA BASE DE DATOS SI APLICA */
        if(acomuladoDeudaGrupoA > 0){


            console.log("Entramos al condicional")
            /* FUNCION PARA GUARDAR EN BASE DE DATOS */
            const complemento = await complementoIncapacidadARL(acomuladoDeudaGrupoA, id_liquidacion)
            console.log("COMPLEMENTO INCAPACIDAD GRUPO E: ", complemento)

        }   


        

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

        console.log("SALARIO:  ", proceso_1.data.salario_empleado)
        console.log("NUMERO DE DÍAS A LIQUIDAR ARL: ", liq_dias_arl)
        console.log("PORCENTAJE A LIQUIDAR ARL: ", Liq_porcentaje_liquidacion_arl)
        console.log("VALOR TOTAL A LIQUIDAR ARL: ", liq_valor_arl)
        console.log("INCAPACIDAD ACTUALIZADA: ", updateSettlementTableLiqEmpleador)


         // Devuelves directamente el objeto que vino de epsLicencias
        return {
            success: true,
            message: 'Liquidación de incapacidad ARL procesada'        
        };

    } catch (error) {

      console.error("Error en processDownloadUserDisability:", error);   
    }

}