import { pool } from "../../../models/db.js";
import express from 'express';
import { format } from "date-fns";
const app = express();

export const UserDisabilityTable = async (req, res) => {
    try {

        const { id_empleado, id_incapacidad } = req.params;
        console.log("➡️ Params recibidos:", { id_empleado, id_incapacidad });


        // Validación básica de IDs
        if (!id_empleado || !id_incapacidad) {
            return res.status(400).json({ message: "Faltan parámetros requeridos (id_empleado o id_incapacidad)." });
        }



        /* FORMATEO DE FECHAS CON DTAA Y DATATIME */
        const formatDate = (fecha) => {
            try {
                return fecha ? format(new Date(fecha), "dd/MM/yyyy") : "Fecha no disponible";
            } catch (e) {
                return "Fecha inválida";
            }
        };
        
        const formatDateTime = (fecha) => {
            try {
                return fecha ? format(new Date(fecha), "dd/MM/yyyy HH:mm:ss") : "Fecha y hora no disponibles";
            } catch (e) {
                return "Fecha y hora inválidas";
            }
        };



        // Consulta principal
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
            WHERE 
                ih.id_empleado = ? AND ih.id_incapacidades_historial = ?
                `,
            [id_empleado, id_incapacidad]
        );


        /* VALIDACION  DE LA INCAPACIDAD EN TABLA HISTORIAL*/
        if (!disabilityDischargeHistory.length) {
            return res.status(404).json({ message: "No se encontró la incapacidad con los datos proporcionados." });
        }

        
        /* CONST DATA PARA TOMAR DATOS DE LA CONSULTA */
        const data = disabilityDischargeHistory[0];
        console.log("🧾 Datos encontrados:", data);


        
        // Verificar si ya está descargada
        const [dischargeDisabilitySettlement] = await pool.query(
            `SELECT downloaded FROM incapacidades_liquidacion WHERE id_incapacidades_historial = ?`,
            [id_incapacidad]
        );


        if (dischargeDisabilitySettlement.length === 0) {
            
            const insertValues = [
                data.nombres, data.apellidos, data.documento, data.contacto, data.tipo_contrato,
                data.cargo, data.lider, data.fecha_registro_incapacidad, data.tipo_incapacidad, data.subtipo_incapacidad,
                data.fecha_inicio_incapacidad, data.fecha_final_incapacidad, data.cantidad_dias,
                data.codigo_categoria, data.descripcion_categoria, data.codigo_subcategoria, data.descripcion_subcategoria,
                data.prorroga, data.salario_empleado, data.valor_dia_empleado, data.fecha_contratacion, data.estado_incapacidad,
                data.id_incapacidades_historial, 0
            ];

            await pool.query(
                `INSERT INTO incapacidades_liquidacion 
                (nombres, apellidos, documento, contacto, tipo_contrato, cargo, lider, fecha_registro_incapacidad, tipo_incapacidad, subtipo_incapacidad,
                fecha_inicio_incapacidad, fecha_final_incapacidad, cantidad_dias, codigo_categoria, descripcion_categoria, codigo_subcategoria,
                descripcion_subcategoria, prorroga, salario_empleado, valor_dia_empleado, fecha_contratacion, estado_incapacidad, id_incapacidades_historial, downloaded)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                insertValues
            );


            console.log("✅ Inserción realizada en incapacidades_liquidacion");
        } else {
            console.log("🔁 Ya existe un registro en incapacidades_liquidacion");
        }



        // 🔍 Consulta para obtener los datos insertados o existentes DEL EMPLEADO CONSULTADO:
        const [liquidacionData] = await pool.query(
            `
                SELECT 
                    il.*
                FROM 
                    incapacidades_liquidacion il
                JOIN 
                    incapacidades_historial ih ON il.id_incapacidades_historial = ih.id_incapacidades_historial
                WHERE ih.id_empleado = ?
                ORDER BY fecha_inicio_incapacidad DESC;
            
            `,
            [id_empleado]
        );

        console.log("DATOS RECIBIDOS DE LIQUIDACION:", liquidacionData)




        // ✅ Validación
        if (liquidacionData.length > 0) {


            const liquidacionFormateada = liquidacionData.map(liq => ({
                ...liq,
                fecha_registro_incapacidad: formatDateTime(liq.fecha_registro_incapacidad), // ✅ con hora
                fecha_inicio_incapacidad: formatDate(liq.fecha_inicio_incapacidad),
                fecha_final_incapacidad: formatDate(liq.fecha_final_incapacidad),
                fecha_contratacion: formatDate(liq.fecha_contratacion)
            }));

            console.log("liquidacionFormateada", liquidacionFormateada)

            return res.render('user_disability_table', 
            { 
                datosLiquidacion: liquidacionFormateada
            });

        } else {
            return res.status(404).json({ message: 'No se encontraron datos en incapacidades_liquidacion después de insertar.' });
        }
       



        /* return res.render("user_disability_table"); */

    } catch (error) {
        console.error("💥 Error en UserDisabilityTable:", error);
        return res.status(500).json({ message: "Error interno del servidor al procesar la incapacidad.", error: error.message });
    }
};
