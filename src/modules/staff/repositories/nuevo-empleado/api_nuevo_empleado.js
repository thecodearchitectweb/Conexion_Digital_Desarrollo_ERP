import { pool } from "../../../../models/db.js";

export async function dataDB(
            idUserRegistro,
            UserRegistro,
            nombre,
            apellidos,
            documento,
            fecha_contratacion,
            tipo_contrato,
            cargo,
            estado,
            lider_directo,
            salario,
            valor_dia,
            contacto,
            email,
            area,
            empresa,
            nit,
            eps,
            arl,
            fondo_pensiones,
            caja_compensacion
        ) {

    try {

        /* INSERTAR DATOS DE EMPLEADO */
        const [result_1] = await pool.query(
            `
                INSERT INTO empleado (
                idUserRegistro,
                UserRegistro,
                nombres,
                apellidos,
                documento,
                fecha_contratacion,
                tipo_contrato,
                cargo,
                estado,
                lider,
                salario,
                valor_dia,
                contacto,
                email,
                area,
                empresa,
                nit,
                eps,
                arl,
                fondo_pensiones,
                caja_compensacion
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                idUserRegistro,
                UserRegistro,
                nombre,
                apellidos,
                documento,
                fecha_contratacion,
                tipo_contrato,
                cargo,
                estado,
                lider_directo,
                salario,
                valor_dia,
                contacto,
                email,
                area,
                empresa,
                nit,
                eps,
                arl,
                fondo_pensiones,
                caja_compensacion
            ]
        );

        // ✅ Obtener el ID insertado:
        const nuevoEmpleadoId = result_1.insertId;
        console.log('ID del nuevo empleado:', nuevoEmpleadoId);



        /* INSERTAR EMPRESA */
        const [result_2] = await pool.query(
            `
            INSERT INTO empresas (
            nombre,
            nit,
            id_empleado
            ) VALUES (?, ?, ?)
        `,
            [empresa, nit, nuevoEmpleadoId]
        );


        /* INSERT SEGURIDAD SOCIAL */
        const [result_3] = await pool.query(
            `
            INSERT INTO seguridad_social (
            eps,
            arl,
            fondo_pension,
            caja_compensacion,
            id_empleado
            ) VALUES (?, ?, ?)
        `,
            [eps, arl, fondo_pensiones, caja_compensacion, nuevoEmpleadoId]
        );

        return nuevoEmpleadoId;

    } catch (error) {
        console.error('Error al insertar nuevo empleado:', error);
        throw new Error('No se pudo registrar el nuevo empleado.');
    }
}