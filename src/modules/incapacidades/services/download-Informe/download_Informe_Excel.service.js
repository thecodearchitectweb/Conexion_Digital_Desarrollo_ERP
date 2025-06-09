import ExcelJS from "exceljs";
import { convertirFecha } from "../../utils/formatDate/formatDate.js";
import { DataIncapacidades } from '../../repositories/download-Informe/download-Informe-Excel.js'

export const generarInformeIncapacidades = async ( fecha_inicio, fecha_final ) => {
  
    const F_inicio = convertirFecha(fecha_inicio);
    const F_final = convertirFecha(fecha_final);  
    
    console.log("DATOS RECIBIDOS DEL CONTROLLER.")
    console.log(F_inicio)
    console.log(F_final)


    /* CONSULTA BASE DE DATOS PARA TRAER INCAPACIDADES */
    const data = await DataIncapacidades(F_inicio, F_final);
      
    if (!data || data.length === 0) 
        return null;


    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Informe de Incapacidades");

    /* DEFINICION DE LAS COLUMNAS CON TODOS LOS CAMPOS DE LA TABLA */
    worksheet.columns = [

        {header: 'Registro', key: 'fecha_registro_incapacidad' },
        {header: 'Estado', key: 'estado' },
        {header: 'Observaciones', key: 'observaciones' },
        {header: 'Nombre', key: 'nombres' },
        {header: 'Apellido', key: 'apellidos' },
        {header: 'Documento', key: 'documento' },
        {header: 'Contacto', key: 'contacto' },
        {header: 'Contrato', key: 'tipo_contrato' },
        {header: 'Cargo', key: 'cargo' },
        {header: 'Salario', key: 'salario_empleado' , style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' }},
        {header: 'Valor dia', key: 'valor_dia_empleado', style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' } },
        {header: 'Dias Laborados', key: 'dias_laborados' },
        {header: 'Lider', key: 'lider' },
        {header: 'Tipo Incapacidad', key: 'tipo_incapacidad'},
        {header: 'Origen', key: 'subtipo_incapacidad' },
        {header: 'Inicio Incapacidad', key: 'fecha_inicio_incapacidad' },
        {header: 'Final Incapacidad', key: 'fecha_final_incapacidad' },
        {header: 'N. Dias', key: 'cantidad_dias',  },
        {header: 'Dias Liquidados', key: 'dias_liquidables_totales' },
        {header: 'Codigo', key: 'codigo_categoria' },
        {header: 'Descripcion', key: 'descripcion_categoria'},
        {header: 'Subcategoria', key: 'codigo_subcategoria' },
        {header: 'Descripcion', key: 'descripcion_subcategoria' },
        {header: 'Prorroga', key: 'prorroga' },        
       
        /* EMPLEADOR */
        {header: 'Dias Liquidados Empleador 1 - 2', key: 'dias_liquidacion_empleador' }, 
        {header: '% Empleador', key: 'porcentaje_liquidacion_empleador' },
        {header: 'Liquidacion Empleador', key: 'liquidacion_empleador', style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' } },
        {header: 'Complemento Empleador', key: 'complementoIncapacidadEmpleador', style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' } }, 
        {header: 'Total Empleador', key: 'total_empleador',  style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' } }, 
        
        /* EPS 1 - 90 */
        {header: 'Dias Liquidados EPS 3 - 90', key: 'dias_liquidacion_eps' }, 
        {header: '% EPS 3 - 90', key: 'porcentaje_liquidacion_eps' },
        {header: 'Liquidacion EPS', key: 'liquidacion_eps', style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' } },
        {header: 'Complemento EPS', key: 'complementoIncapacidadEPS', style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' } }, 
        {header: 'Total EPS', key: 'total_eps',  style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' } },    
        
        /* EPS 91 - 180 */
        {header: 'Dias Liquidados EPS 91 - 180', key: 'dias_liquidacion_eps_50' },  
        {header: '% EPS 91 - 180', key: 'porcentaje_liquidacion_eps_50' },
        {header: 'Liquidacion EPS', key: 'liquidacion_eps_50', style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' } },
        {header: 'Complemento EPS', key: 'complementoIncapacidadEPS_50', style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' } }, 
        {header: 'Total EPS 50%', key: 'total_eps_50' , style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' }}, 
        
        /* F. PENSIONES 181 - 540 */
        {header: 'Dias Liquidados F. Pensiones 181 - 540', key: 'dias_liquidacion_fondo_pensiones' },
        {header: '% F. Pensiones 181 - 540', key: 'porcentaje_liquidacion_fondo_pensiones' },
        {header: 'Liquidacion F. Pensiones', key: 'liquidacion_fondo_pensiones', style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' } },
        {header: 'Complemento F. Pensiones', key: 'complementoIncapacidadFondoPensiones' , style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' }},
        {header: 'Total Fondo Pensiones', key: 'total_fondo_pensiones', style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' } }, 
        
        /* EPS 541+ */
        {header: 'Dias Liquidados EPS 540 +', key: 'dias_liquidacion_eps_fondo_pensiones' },  
        {header: '% EPS 541 +', key: 'porcentaje_liquidacion_eps_fondo_pensiones' },
        {header: 'Liquidacion EPS', key: 'liquidacion_eps_fondo_pensiones', style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' } },
        {header: 'Complemento EPS', key: 'complementoIncapacidadEPS_FONDO', style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' } },
        {header: 'Total EPS 541+', key: 'total_eps_541_plus', style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' } }, 

        
        /* ARL */
        {header: 'Dias Liquidados ARL', key: 'dias_liquidacion_arl' },  
        {header: '% ARL', key: 'porcentaje_liquidacion_arl' },
        {header: 'Liquidacion ARL', key: 'liquidacion_arl' , style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' }},
        {header: 'Complemento', key: 'complementoIncapacidadARL', style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' } },
        {header: 'Total ARL', key: 'total_arl', style: { numFmt: '"$"#,##0.00;[Red]\-"$"#,##0.00' } }, 

        
        
       


    ]

    // Agregar datos
    data.forEach(raw => {
        //  CONSTRUIR OBJETO FILA CON LOS CAMPOS ORIGINALES
        const row = {
        ...raw,
            // Añadir totales:
            total_empleador: (raw.liquidacion_empleador || 0) + (raw.complementoIncapacidadEmpleador || 0),
            total_eps : (raw.liquidacion_eps || 0) + (raw.complementoIncapacidadEPS || 0),
            total_eps_50 : (raw.liquidacion_eps_50 || 0) + (raw.complementoIncapacidadEPS_50 || 0),
            total_fondo_pensiones : (raw.liquidacion_fondo_pensiones || 0) + (raw.complementoIncapacidadFondoPensiones || 0),
            total_eps_541_plus : (raw.liquidacion_eps_fondo_pensiones || 0) + (raw.complementoIncapacidadEPS_FONDO || 0),
            total_arl : (raw.liquidacion_arl || 0) + (raw.complementoIncapacidadARL || 0),
        };

        // finalmente agregas la fila ya completa
        worksheet.addRow(row);
    });




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


    ['nombres', 'apellidos', 'subtipo_incapacidad', 'descripcion_categoria', 'descripcion_subcategoria', 'observaciones'].forEach((key) => {
        worksheet.getColumn(key).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            if (rowNumber !== 1) {
            cell.alignment = { horizontal: 'left' };
            }
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
        column.width = Math.min(maxLength + 2, 30);
    });    


/*     worksheet.columns.forEach(column => {
    let maxLength = 10;
    column.eachCell({ includeEmpty: true }, cell => {
        const value = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, value.length);
    });
    column.width = maxLength + 2; // Quitaste el Math.min
    }); */


    return workbook;    

}