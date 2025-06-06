import express from 'express';

const app = express();



export const downloadInformeExcel = async (req, res) => {
    try {
        
        return res.render('download-informe/download_Informe_Excel')

    } catch (error) {
        
    }
}
