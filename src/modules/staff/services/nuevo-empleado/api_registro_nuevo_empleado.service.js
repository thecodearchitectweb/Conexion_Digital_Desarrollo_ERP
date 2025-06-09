import { dataDB } from '../../repositories/nuevo-empleado/api_nuevo_empleado.js';

export async function registroNuevoEmpleado(
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

    // 2. Inserción de datos en la base y obtención del ID
    const nuevoEmpleadoId = await dataDB(
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
    );

    // 3. Respuesta de éxito
    return {
      success: true,
      message: 'Empleado registrado correctamente.',
      empleadoId: nuevoEmpleadoId
    };


  } catch (error) {
   
      console.error('Error al registrar empleado:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return {
                success: false,
                message: 'Ya existe un empleado con ese número de documento.'
            };
        }

        return {
            success: false,
            message: 'Ocurrió un error interno al registrar el empleado.'
        };
  }
}
