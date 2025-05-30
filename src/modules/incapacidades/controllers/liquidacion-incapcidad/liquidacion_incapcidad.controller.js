import { dataPrincipalLiquidacion } from '../../services/api-download-user-disability/dataPrincipalLiquidacion.service.js'
import { validacionesSwitch } from '../../services/api-download-user-disability/validacionesSwitch.service.js'



// CONTROLADOR PRINCIPAL
export const api_download_user_disability = async (req, res) => {
    try {
        
        const { id_liquidacion, id_historial } = req.params;


        /* OBTENER TODOS LOS DATOS NECESARIOS PARA LA LIQUIDACION CORRESPONDIENTE */
        const proceso_1 = await dataPrincipalLiquidacion(id_liquidacion, id_historial)
        console.log("DATOS DEL PROCESO_1:  ", proceso_1)

        
        /* REALIZAR LAS VALIDACIONES CORRESPONDIENTES  */
        const proceso_2 = validacionesSwitch(id_liquidacion, id_historial, proceso_1)





        /* await processDownloadUserDisability(id_liquidacion, id_historial, res); */

    } catch (error) {
        console.error("Error en controlador principal:", error);
        return res.status(500).json({ message: "Error en el servidor." });
    }
};

