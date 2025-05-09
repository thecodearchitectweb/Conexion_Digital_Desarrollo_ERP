import { pool } from "../../../../models/db.js";

export async function getEmployeeData(id_empleado) {

    try {


        /* CONSULTA EN BASES DE DATOS, PARA CONFIRMAR DATOS INGRESADOS DE LA INCAPACIDAD */
        const [rows] = await pool.query(

            ` 
                SELECT 
                    e.id_empleado,
                    e.nombres,
                    e.apellidos,
                    e.documento,
                    e.contacto,
                    e.area,
                    e.fecha_contratacion,
                    e.tipo_contrato,
                    e.cargo,
                    e.estado,
                    e.lider,
                    e.salario,
                    e.valor_dia,
                    e.fecha_registro,

                    emp.id_empresa,
                    emp.nombre AS empresa_nombre,
                    emp.nit AS empresa_nit,

                    ss.id_seguridad_social,
                    ss.eps,
                    ss.arl,
                    ss.fondo_pension,
                    ss.caja_compensacion
                FROM empleado e

                LEFT JOIN empresas emp 
                    ON e.id_empleado = emp.id_empleado
                    AND emp.fecha_actualizacion = (
                        SELECT MAX(fecha_actualizacion) 
                        FROM empresas 
                        WHERE id_empleado = e.id_empleado
                    )

                
                LEFT JOIN seguridad_social ss 
                    ON e.id_empleado = ss.id_empleado
                    AND ss.fecha_actualizacion = (
                        SELECT MAX(fecha_actualizacion) 
                        FROM seguridad_social 
                        WHERE id_empleado = e.id_empleado
                    )

                WHERE e.id_empleado = ?;

            `, [id_empleado]);



        /* CONFIRMACION SI EL EMPLEADO SE ENCUENTRA */
        if (!rows.length) {
            return res.status(404).send('Empleado no encontrado');
        }

        return rows[0]


    } catch (error) {
        console.error("Error al obtener datos del empleado:", error);
        throw error;
    }
}







