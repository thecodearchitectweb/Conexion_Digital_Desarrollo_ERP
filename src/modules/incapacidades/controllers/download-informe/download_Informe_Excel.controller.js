import express from 'express';
import { generarInformeIncapacidades } from '../../services/download-Informe/download_Informe_Excel.service.js'

const app = express();



export const downloadInformeExcel = async (req, res) => {
    try {
        
        return res.render('download-informe/download_Informe_Excel')

    } catch (error) {
        
    }
}


export const downloadInformeExcel_ = async (req, res) => {

    try {
        
        const  {
            fecha_inicio,
            fecha_final            
        } = req.body

        console.log("FECHAS: ", fecha_inicio, fecha_final)

        const workbook = await generarInformeIncapacidades(fecha_inicio, fecha_final);        


        /* VALIDACION SIN HAY DATOS */
        if (!workbook) {
            return res.status(404).json({
                ok: false,
                message: "No se encontraron registros de incapacidades.",
            });
        }


        /* Configuras las cabeceras HTTP para indicarle al navegador que la respuesta es un archivo Excel descargable, con nombre sugerido incapacidades_empleado.xlsx. */
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );        


        const nombreArchivo = `incapacidades_${fecha_inicio}_${fecha_final}.xlsx`.replace(/\s+/g, "_");   
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${nombreArchivo}`
        );     
        
        
        await workbook.xlsx.write(res);
        res.end();        
        

    } catch (error) {
        
    }
}
