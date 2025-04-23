import { pool } from "../../../models/db.js";
//import bcrypt from "bcryptjs";


import express from 'express';

const app = express();


export const UserDisabilityTable = async (req, res) => {


    /* ID TRAIDOS DEL BODY */
    const { id_empleado, id_incapacidad } = req.params;
    console.log(id_empleado, id_incapacidad);




    /* CONSULTA DATOS COMPLETOS DE LA TABLA QUE CONCUERDE CON id_empleado, id_incapacidad */
    const [disabilityDischargeHistory] = await pool.query(
        `
           SELECT 
                ih.fecha_registro AS 'FECHA DE REGISTRO',
                e.nombres AS 'NOMBRES',
                e.apellidos AS 'APELLIDOS',
                e.documento AS 'DOCUMENTO',
                e.contacto AS 'CONTACTO',
                e.salario AS 'SALARIO',
                e.valor_dia AS 'VALOR DÍA',
                ih.tipo_incapacidad AS 'TIPO DE INCAPACIDAD',
                ih.subtipo_incapacidad AS 'SUBTIPO DE INCAPACIDAD',
                ih.fecha_inicio_incapacidad AS 'FECHA INICIO INCAPACIDAD',
                ih.fecha_final_incapacidad AS 'FECHA FIN INCAPACIDAD',
                ih.cantidad_dias AS 'N. DÍAS',
                ih.codigo_categoria AS 'CODIGO CATEGORIA',
                ih.descripcion_categoria AS 'DESCRIPCION CATEGORIA',
                ih.codigo_subcategoria AS 'CODIGO SUBCATEGORIA',
                ih.descripcion_subcategoria AS 'DESCRIPCION SUBCATEGORIA',
                ih.prorroga AS 'PRORROGA',
                il.dias_liquidacion_empleador AS 'CANT. DÍAS EMPLEADOR',
                il.liquidacion_empleador AS 'VALOR EMPLEADOR',
                il.dias_liquidacion_eps AS 'CANT. DÍAS EPS',
                il.liquidacion_eps AS 'VALOR EPS',
                il.dias_liquidacion_arl AS 'CANT. DÍAS ARL',
                il.liquidacion_arl AS 'VALOR ARL',
                il.dias_liquidacion_fondo_pensiones AS 'CANTI. DÍAS FONDO DE PENSIONES',
                il.liquidacion_fondo_pensiones AS 'VALOR FONDO DE PENSIONES',
                il.dias_liquidacion_eps_fondo_pensiones AS 'CANTI. DÍAS FONDO DE PENSIONES Y EPS',
                il.liquidacion_eps_fondo_pensiones AS 'VALOR FONDO DE PENSIONES Y EPS',
                iseg.estado_incapacidad AS 'ESTADO INCAPACIDAD'
            FROM incapacidades_historial ih
            INNER JOIN empleado e ON ih.id_empleado = e.id_empleado
            LEFT JOIN incapacidades_liquidacion il ON ih.id_incapacidades_historial = il.id_incapacidades_historial
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
            WHERE ih.id_empleado = ? AND ih.id_incapacidades_historial = ?;
        `,
        [id_empleado, id_incapacidad]
    );

    console.log("Incapacidad descargada HISTORIAL", disabilityDischargeHistory)



    

    // CONSULTAR SI LA INCAPACIDAD SE DESCARGÓ EN INCAPACIDADES_LIQUIDACION
    const [dischargeDisabilitySettlement] = await pool.query(
        `
        SELECT 
        downloaded
        FROM 
        incapacidades_liquidacion
        WHERE 
        id_incapacidades_historial = ?
    `,
        [id_incapacidad]
    );

    console.log("Incapacidad descargada LIQUIDACION", dischargeDisabilitySettlement);


    // Verificar si NO se obtuvo ningún resultado
    if (dischargeDisabilitySettlement.length === 0) {
        await pool.query(
            `
                INSERT INTO incapacidades_liquidacion 
                    (
                        downloaded, 
                        id_incapacidades_historial
                    )
                VALUES 
                    (?, ?)
            `,
                [
                    0, 
                    id_incapacidad
                ]
        );

        console.log("✅ Inserción realizada en incapacidades_liquidacion");
    } else {
        console.log("🔁 Ya existe un registro en incapacidades_liquidacion");
    }
    





    return res.render('user_disability_table')
}