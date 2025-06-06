import ExcelJS from "exceljs";
import { convertirFecha } from "../../utils/formatDate/formatDate.js";
import { DataIncapacidadesEmpleado } from "../../repositories/seleccionar-empleado/data-Incapacidades-empleado.js";

export const generarLibroIncapacidadesEmpleado = async (fecha_inicio, fecha_final, id_empleado) => {
  const F_inicio = convertirFecha(fecha_inicio);
  const F_final = convertirFecha(fecha_final);

  const data = await DataIncapacidadesEmpleado(F_inicio, F_final, id_empleado);
  if (!data || data.length === 0) return null;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Incapacidades del Empleado");

  // Definición de columnas con todos los campos de la tabla
  worksheet.columns = [
    { header: "ID Liquidación", key: "id_incapacidades_liquidacion", width: 15 },
    { header: "ID Empleado", key: "id_empleado", width: 15 },
    { header: "Nombres", key: "nombres", width: 20 },
    { header: "Apellidos", key: "apellidos", width: 20 },
    { header: "Documento", key: "documento", width: 15 },
    { header: "Contacto", key: "contacto", width: 15 },
    { header: "Tipo Contrato", key: "tipo_contrato", width: 25 },
    { header: "Cargo", key: "cargo", width: 25 },
    { header: "Líder", key: "lider", width: 25 },
    { header: "Fecha Registro Incapacidad", key: "fecha_registro_incapacidad", width: 25 },
    { header: "Tipo Incapacidad", key: "tipo_incapacidad", width: 25 },
    { header: "Subtipo Incapacidad", key: "subtipo_incapacidad", width: 25 },
    { header: "Fecha Inicio Incapacidad", key: "fecha_inicio_incapacidad", width: 20 },
    { header: "Fecha Final Incapacidad", key: "fecha_final_incapacidad", width: 20 },
    { header: "Cantidad Días", key: "cantidad_dias", width: 15 },
    { header: "Días Liquidables Totales", key: "dias_liquidables_totales", width: 20 },
    { header: "Código Categoría", key: "codigo_categoria", width: 20 },
    { header: "Descripción Categoría", key: "descripcion_categoria", width: 25 },
    { header: "Código Subcategoría", key: "codigo_subcategoria", width: 20 },
    { header: "Descripción Subcategoría", key: "descripcion_subcategoria", width: 25 },
    { header: "Prórroga", key: "prorroga", width: 10 },
    { header: "Días Liquidación Empleador", key: "dias_liquidacion_empleador", width: 25 },
    { header: "Días Liquidación EPS", key: "dias_liquidacion_eps", width: 20 },
    { header: "Días Liquidación ARL", key: "dias_liquidacion_arl", width: 20 },
    { header: "Días Liquidación Fondo Pensiones", key: "dias_liquidacion_fondo_pensiones", width: 30 },
    { header: "Días Liquidación EPS Fondo Pensiones", key: "dias_liquidacion_eps_fondo_pensiones", width: 30 },
    { header: "Porcentaje Liquidación Empleador", key: "porcentaje_liquidacion_empleador", width: 30 },
    { header: "Porcentaje Liquidación EPS", key: "porcentaje_liquidacion_eps", width: 25 },
    { header: "Porcentaje Liquidación ARL", key: "porcentaje_liquidacion_arl", width: 25 },
    { header: "Porcentaje Liquidación Fondo Pensiones", key: "porcentaje_liquidacion_fondo_pensiones", width: 30 },
    { header: "Porcentaje Liquidación EPS Fondo Pensiones", key: "porcentaje_liquidacion_eps_fondo_pensiones", width: 30 },
    { header: "Liquidación Empleador", key: "liquidacion_empleador", width: 25 },
    { header: "Liquidación EPS", key: "liquidacion_eps", width: 20 },
    { header: "Liquidación ARL", key: "liquidacion_arl", width: 20 },
    { header: "Liquidación Fondo Pensiones", key: "liquidacion_fondo_pensiones", width: 25 },
    { header: "Liquidación EPS Fondo Pensiones", key: "liquidacion_eps_fondo_pensiones", width: 30 },
    { header: "Salario Empleado", key: "salario_empleado", width: 20 },
    { header: "Valor Día Empleado", key: "valor_dia_empleado", width: 20 },
    { header: "Fecha Contratación", key: "fecha_contratacion", width: 20 },
    { header: "Días Laborados", key: "dias_laborados", width: 15 },
    { header: "Estado Incapacidad", key: "estado_incapacidad", width: 20 },
    { header: "Downloaded", key: "downloaded", width: 10 },
    { header: "ID Historial", key: "id_incapacidades_historial", width: 15 },
    { header: "Fecha Registro", key: "fecha_registro", width: 25 },
    { header: "Fecha Actualización", key: "fecha_actualizacion", width: 25 }
  ];

  // Agregar datos
  data.forEach(row => worksheet.addRow(row));

  
  // Estilo encabezados: fondo azul más oscuro, texto blanco, centrado
  worksheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true, color: { argb: "FFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "203864" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });


  // Centrar todos los datos (todas las filas y columnas)
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell(cell => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });
  });


  // Filtro automático
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: worksheet.columns.length }
  };


  // Ajuste automático de ancho de columnas
  worksheet.columns.forEach(column => {
    let maxLength = 10;
    column.eachCell({ includeEmpty: true }, cell => {
      const value = cell.value ? cell.value.toString() : "";
      maxLength = Math.max(maxLength, value.length);
    });
    column.width = Math.min(maxLength + 2, 100);
  });

  return workbook;
};
