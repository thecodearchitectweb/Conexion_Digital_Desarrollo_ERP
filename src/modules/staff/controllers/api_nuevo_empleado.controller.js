import { registroNuevoEmpleado } from '../../staff/services/nuevo-empleado/api_registro_nuevo_empleado.service.js'


export const _registroNuevoEmpleado = async (req, res) => {

    try {

        const {
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
            area,
            empresa,
            nit,
            eps,
            arl,
            fondo_pensiones,
            caja_compensacion
        } = req.body


        const idUserRegistro = req.session.user.id;
        const UserRegistro   = req.session.user.usuario;



        /* MANEJO DE LOGICA  */
        const registro = await registroNuevoEmpleado(
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
            area,
            empresa,
            nit,
            eps,
            arl,
            fondo_pensiones,
            caja_compensacion
        )

        console.log("registro empleado: ", registro)


        return {
            success: true,
            message: "Empleado registrado correctamente.",
        };


    } catch (error) {
        console.error("Error al registrar empleado:", error);
        return {
            success: false,
            message: "Ocurrió un error interno al registrar el empleado."
        };
    }
}
