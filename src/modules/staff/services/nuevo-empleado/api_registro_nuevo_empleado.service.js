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
    // 1. Validación de campos obligatorios
    /* const campos = { nombre, apellidos, documento, fecha_contratacion, tipo_contrato, cargo, estado, lider_directo, salario, valor_dia, contacto, email, area, empresa, nit, eps, arl, fondo_pensiones, caja_compensacion };
    const faltantes = Object.entries(campos)
      .filter(([, valor]) => valor === undefined || valor === null || String(valor).trim() === "")
      .map(([campo]) => campo);
    if (faltantes.length) {
      return {
        success: false,
        message: `Faltan campos obligatorios: ${faltantes.join(', ')}`
      };
    } */

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
    return {
      success: false,
      message: 'Ocurrió un error interno al registrar el empleado.'
    };
  }
}
