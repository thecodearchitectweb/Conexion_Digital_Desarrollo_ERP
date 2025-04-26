import { pool } from "../../../models/db.js";
import express from 'express';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { json } from "stream/consumers";
import {getUltimasIncapacidades } from '../utils/api-download-user-disability/incapacidadesHelpers.js'



const app = express();

export const api_download_user_disability = async (req, res) => {
    try {
        const { id_liquidacion, id_historial } = req.params;

        console.log(id_liquidacion, id_historial)


        /* TRAER ID DEL EMPLEADO */
        const [rows] = await pool.query(`
            SELECT id_empleado
            FROM incapacidades_historial
            WHERE id_incapacidades_historial = ?
        `, [id_historial]);
        

        /* OBTENER UNICAMENTE EL NUMERO ID */
        const id_empleado = rows[0]?.id_empleado;
        

        /* VALIDACION SI HACE FALTA ALGUNO DE LOS DATOS */
        if (!id_liquidacion || !id_historial  || !id_empleado) {
            return res.status(400).json({ message: "Faltan parámetros en la solicitud." });
        }


        /* OBTENER LOS ULTIMOS DATOS ACTUALIZADOS DE LA INCAPACIDAD */
        const [disabilityDischargeHistory] = await pool.query(
            `SELECT 
                e.nombres, 
                e.apellidos, 
                e.documento, 
                e.contacto, 
                e.tipo_contrato, 
                e.cargo, 
                e.lider, 
                e.salario AS salario_empleado, 
                e.valor_dia AS valor_dia_empleado, 
                e.fecha_contratacion,
                ih.fecha_registro AS fecha_registro_incapacidad, 
                ih.tipo_incapacidad, 
                ih.subtipo_incapacidad,
                ih.fecha_inicio_incapacidad, 
                ih.fecha_final_incapacidad, 
                ih.cantidad_dias, 
                ih.codigo_categoria, 
                ih.descripcion_categoria, 
                ih.codigo_subcategoria, 
                ih.descripcion_subcategoria,
                ih.prorroga, 
                ih.id_incapacidades_historial,
                iseg.estado_incapacidad, 
                iseg.observaciones
            FROM incapacidades_historial ih
            INNER JOIN empleado e ON ih.id_empleado = e.id_empleado
            LEFT JOIN (
                SELECT is1.*
                FROM incapacidades_seguimiento is1
                INNER JOIN (
                    SELECT id_incapacidades_historial, MAX(fecha_registro) AS max_fecha
                    FROM incapacidades_seguimiento
                    GROUP BY id_incapacidades_historial
                ) is2 ON is1.id_incapacidades_historial = is2.id_incapacidades_historial
                    AND is1.fecha_registro = is2.max_fecha
            ) iseg ON ih.id_incapacidades_historial = iseg.id_incapacidades_historial
            WHERE ih.id_empleado = ? AND ih.id_incapacidades_historial = ?`,
            [id_empleado, id_historial] 
        );


        /* VALIDACION SI LA CONSULTA ESTA VACIA */
        if (!disabilityDischargeHistory.length) {
            return res.status(404).json({ message: "No se encontró la incapacidad con los datos proporcionados." });
        }


        /* AGREGAMOS LOS DATOS RECIBIDOS A UN ARREGLO EN LA CONSTA DATA */
        const data = disabilityDischargeHistory[0];
        console.log("🧾 Datos encontrados:", data);



        /* ACTUALIZA LA INFORMACION A LA MAS ACTUAL */
        if (disabilityDischargeHistory.length) {

            const updateValues = [
                data.nombres, data.apellidos, data.documento, data.contacto, data.tipo_contrato,
                data.cargo, data.lider, data.fecha_registro_incapacidad, data.tipo_incapacidad, data.subtipo_incapacidad,
                data.fecha_inicio_incapacidad, data.fecha_final_incapacidad, data.cantidad_dias,
                data.codigo_categoria, data.descripcion_categoria, data.codigo_subcategoria, data.descripcion_subcategoria,
                data.prorroga, data.salario_empleado, data.valor_dia_empleado, data.fecha_contratacion, data.estado_incapacidad,
                1, // downloaded
                data.id_incapacidades_historial // para el WHERE
            ];

            await pool.query(
                `UPDATE incapacidades_liquidacion SET
                    nombres = ?, apellidos = ?, documento = ?, contacto = ?, tipo_contrato = ?,
                    cargo = ?, lider = ?, fecha_registro_incapacidad = ?, tipo_incapacidad = ?, subtipo_incapacidad = ?,
                    fecha_inicio_incapacidad = ?, fecha_final_incapacidad = ?, cantidad_dias = ?,
                    codigo_categoria = ?, descripcion_categoria = ?, codigo_subcategoria = ?, descripcion_subcategoria = ?,
                    prorroga = ?, salario_empleado = ?, valor_dia_empleado = ?, fecha_contratacion = ?, estado_incapacidad = ?,
                    downloaded = ?
                WHERE id_incapacidades_historial = ?`,
                updateValues
            );
        }


/* ------------------------------------------------------------------------------------------------------------------------- */

        /* CALCULAR CANTIDAD DE DÍAS LABORADOS DEL EMPLEADO */
        const fechaContratacionRaw = new Date(data.fecha_contratacion);
        const hoy = new Date();
        
        const fechaContratacion = format(fechaContratacionRaw, 'yyyy-MM-dd', { locale: es });
        const fechaHoy = format(hoy, 'yyyy-MM-dd', { locale: es });
        
        const diasLaborados = differenceInDays(hoy, fechaContratacionRaw) + 1 
        const diasLaborados_conversion = differenceInDays(hoy, fechaContratacionRaw) + 1 >= 30 ? ">30" : "<30";
        
        console.log(`📅 Días laborados: ${diasLaborados}`);
        console.log("📆 FECHA CONTRATACION:", fechaContratacion);
        console.log("📆 HOY:", fechaHoy);

/* ------------------------------------------------------------------------------------------------------------------------ */




/* ------------------------------------------------------------------------------------------------------------------------ */

        /* TRAER DATOS NECESARIOS PARA EJECUTAR CONSULTA EN LA BASE DE DATOS POLITICAS */

        const SMMLV =  1423500 

        const P_salario = data.salario_empleado
        const P_salario_conversion = data.salario_empleado > SMMLV ? ">SMLV" : "SMLV"

        const P_tipo_incapacidad = data.tipo_incapacidad

        const P_N_dias_incapacidad = data.cantidad_dias
        const P_N_dias_incapacidad_conversion = data.cantidad_dias > 2 ? ">2" : "<3"

        const P_prorroga_texto = data.prorroga
        const P_prorroga_texto_conversion = data.prorroga === 1 ? "SI" : "NO";


        console.log(P_salario, P_salario_conversion)
        console.log(P_tipo_incapacidad)
        console.log(P_N_dias_incapacidad, P_N_dias_incapacidad_conversion)
        console.log(P_prorroga_texto, P_prorroga_texto_conversion)

/* ------------------------------------------------------------------------------------------------------------------------ */




/* ------------------------------------------------------------------------------------------------------------------------ */

        /* TRAER LA POLITICA SEGUN PARAMETROS REGISTRADOS */
        const [calcular_politicas] = await pool.query(
            `
            SELECT * FROM 
                politicas_incapacidades
            WHERE 
                TRIM(LOWER(prorroga)) = TRIM(LOWER(?))
                AND TRIM(LOWER(dias_laborados)) = TRIM(LOWER(?))
                AND TRIM(LOWER(salario)) = TRIM(LOWER(?))
                AND TRIM(LOWER(tipo_incapacidad)) = TRIM(LOWER(?))
                AND TRIM(LOWER(dias_incapacidad)) = TRIM(LOWER(?))
            `,
            [
                P_prorroga_texto_conversion,       // "SI" o "NO"
                diasLaborados_conversion,          // ">30" o "<30"
                P_salario_conversion,              // salario (string)
                P_tipo_incapacidad,      // tipo de incapacidad (string)<
                P_N_dias_incapacidad_conversion      // tipo de incapacidad (string)
            ]
        );

        console.log("politica que aplica: ", calcular_politicas)
        
        console.log("DATOS DEL FILTRO EN CONSULTA PRORROGA: ", P_prorroga_texto_conversion, P_prorroga_texto )
        console.log("DATOS DEL FILTRO EN CONSULTA DIAS LABORADOS: ", diasLaborados_conversion, diasLaborados )
        console.log("DATOS DEL FILTRO EN CONSULTA SALARIO: ", P_salario_conversion, P_salario )
        console.log("DATOS DEL FILTRO EN CONSULTA N_INCAPACIDAD: ", P_N_dias_incapacidad_conversion, P_N_dias_incapacidad      // tipo de incapacidad (string)
        )


        /* SE REALIZA VALIDACION DE LA CONSULTA */
        if(!calcular_politicas.length){
            return res.status(404),json({message: "No sé encontro ninguna politica para liquidar la incapacidad"})
        }


        /* AGREGAMOS LOS DATOS EN UNA VARIABLE PARA LLAMAR LUEGO CADA DATO */
        const data_politica = calcular_politicas[0]
        
/* ------------------------------------------------------------------------------------------------------------------------ */




/* ------------------------------------------------------------------------------------------------------------------------ */

        /* VARIABLES PARA LA LIQUIDACION  */
        //const Liq_empleador = data_politica
        const Liq_entidad =   P_tipo_incapacidad
        const Liq_cumplimiento = data_politica.cumplimiento
        const Liq_porcentaje_liquidacion_empleador = parseFloat(data_politica.porcentaje_liquidacion_empleador) || 0

        const Liq_porcentaje_liquidacion_eps = parseFloat(data_politica.porcentaje_liquidacion_eps) || 0
        const Liq_porcentaje_liquidacion_arl = parseFloat(data_politica.porcentaje_liquidacion_arl) || 0
        const Liq_porcentaje_liquidacion_fondo_pensiones = parseFloat(data_politica.porcentaje_liquidacion_fondo_pensiones) || 0
        const Liq_porcentaje_liquidacion_eps_fondo_pensiones = parseFloat(data_politica.porcentaje_liquidacion_eps_fondo_pensiones) || 0

        //console.log("EMPLEADOR Liq_empleador: ", Liq_empleador)
        console.log("ENTIDAD: ", Liq_entidad)
        console.log("ENTICUMPLIMIENTO: ", Liq_cumplimiento)
        console.log("PORCENTAJE A LIQUIDAR EMPLEADOR: ", Liq_porcentaje_liquidacion_empleador)
        console.log("PORCENTAJE A LIQUIDAR EPS: ", Liq_porcentaje_liquidacion_eps)
        console.log("PORCENTAJE A LIQUIDAR ARL: ", Liq_porcentaje_liquidacion_arl)
        console.log("PORCENTAJE A LIQUIDAR F.PENSIONES: ", Liq_porcentaje_liquidacion_fondo_pensiones)
        console.log("PORCENTAJE A LIQUIDAR F.PENSIONES Y EPS: ", Liq_porcentaje_liquidacion_eps_fondo_pensiones)



        /* VARIABLE DE DÍAS A LIQUIDAR POR CADA ENTIDAD */

        /* VARIABLE DE DÍAS A LIQUIDAR POR CADA ENTIDAD */

/* VARIABLE DE DÍAS A LIQUIDAR POR CADA ENTIDAD */

    const liq_dias_Incapacidad = parseInt(data.cantidad_dias); // total días de la incapacidad
    const liq_tipo_Incapacidad = P_tipo_incapacidad.toUpperCase();  // tipo de incapacidad
    const liq_prorroga = P_prorroga_texto_conversion.toUpperCase(); // "SI" o "NO"

    let liq_dias_empleador = 0;
    let liq_dias_eps = 0;
    let liq_dias_arl = 0;
    let liq_dias_fondo = 0;
    let liq_dias_eps_fondo = 0;




    /* VALDIACION PARA EJECUTAR CONSULTAS Y LIQUIDACION CORRECTA DE ENTIDADES */
    if (Liq_cumplimiento === 'SI') {

        if (liq_prorroga === 'SI') {
    
            /* SE LLAMA FUNCION PARA TRAER LAS ULTIMAS INCAPACIDADES DEL USER */
            const data_incapacidades_liquidadas = await getUltimasIncapacidades(id_empleado);
            const fecha_final_incapacidad_anterior = data_incapacidades_liquidadas.fecha_final_incapacidad  /* TRAER FECHA FINAL DE LA ULTIMA INCAPACIDAD Y FECHA INICIAL DE LA INCAPACIDAD A LIQUIDAR */
            
            
            const fecha_inicial_incapacidad_liquidar = data.fecha_inicio_incapacidad  /* FECHA INICIAL DE INCAPAVCIDAD A LIQUIDAR */
            
console.log(fecha_final_incapacidad_anterior, fecha_inicial_incapacidad_liquidar)


            switch (liq_tipo_Incapacidad) {
                case 'EPS':

                    liq_dias_empleador = 0;
                    liq_dias_eps = liq_dias_Incapacidad;
                    break;

                case 'ARL':
                    liq_dias_arl = liq_dias_Incapacidad;
                    break;
                default:
                    console.log(`Tipo de incapacidad con prórroga no reconocido: ${liq_tipo_Incapacidad}`);
            }
    
        } else if (liq_prorroga === 'NO') {
    
            switch (liq_tipo_Incapacidad) {
                case 'EPS':
                    liq_dias_empleador = liq_dias_Incapacidad >= 2 ? 2 : liq_dias_Incapacidad;
                    liq_dias_eps = Math.max(liq_dias_Incapacidad - 2, 0);
                    break;
                case 'ARL':
                    liq_dias_arl = liq_dias_Incapacidad;
                    break;
                case 'FONDO':
                    liq_dias_fondo = liq_dias_Incapacidad;
                    break;
                case 'EPS+FONDO':
                    liq_dias_eps_fondo = liq_dias_Incapacidad;
                    break;
                default:
                    console.log(`Tipo de incapacidad sin prórroga no reconocido: ${liq_tipo_Incapacidad}`);
            }
    
        } else {
            console.error(`Valor inesperado de prórroga: ${liq_prorroga}`);
        }
    
    } else {
        console.error(`Cumplimiento no aprobado: ${liq_cumplimiento}`);
    }
    

console.log({
    liq_dias_Incapacidad,
    liq_tipo_Incapacidad,
    liq_prorroga,
    liq_dias_empleador,
    liq_dias_eps,
    liq_dias_arl,
    liq_dias_fondo,
    liq_dias_eps_fondo
});



/* ------------------------------------------------------------------------------------------------------------------------ */


/* 
[
  {
    id_politicas_incapacidades: 11,
    cumplimiento: 'SI',
    prorroga: 'SI',
    dias_laborados: '>30',
    salario: '>SMLV',
    tipo_incapacidad: 'EPS',
    dias_incapacidad: '<3',
    porcentaje_liquidacion_empleador: '0.00',
    porcentaje_liquidacion_eps: '66.67',
    porcentaje_liquidacion_arl: '0.00',
    porcentaje_liquidacion_fondo_pensiones: '0.00',
    porcentaje_liquidacion_eps_fondo_pensiones: '0.00',
    fecha_registro: 2025-04-25T15:45:56.000Z,
    fecha_actualizacion: 2025-04-25T16:14:47.000Z
  }
]
*/

/* ------------------------------------------------------------------------------------------------------------------------ */

        /* CALCULAR DIAS */


/* ------------------------------------------------------------------------------------------------------------------------ */


/* ------------------------------------------------------------------------------------------------------------------------ */

        /* CALCULAR LIQUIDACION DE EMPLEADOR */


/* ------------------------------------------------------------------------------------------------------------------------ */







        /* SE ENVIA A LA API LA RESPUESTA DE LA ACTUALIZACION */
        return res.json({
            ok: true,
            message: "Incapacidad actualizada correctamente",
        });


    } catch (error) {
        console.error("🔥 Error en la API de liquidación:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};
