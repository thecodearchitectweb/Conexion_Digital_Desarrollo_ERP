
import { getDataAplicaciones } from '../../repositories/aplicaciones/get_aplicaciones.js'


export async function aplicaivosDB () {

    try {

        /* traer la consulta de la tabla de aplicaciones */

        const data = await getDataAplicaciones()

        return data

    }catch (error){
        throw error;
    }

}