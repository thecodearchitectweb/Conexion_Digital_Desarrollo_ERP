import { pool } from '../../../../models/db.js'
 

/* CAMBIAR PRORROGA A 0 - YA QUE NO CUMPLE LA POLITICA DE PRORROGA  - TABLA LIQUIDACION*/
export async function updateDisabilitySettlementExtensionLiq (id_incapacidades_historial){

    try {
        const [updateExtension] = await pool.query(
            `
                UPDATE incapacidades_liquidacion
                SET prorroga = 0
                WHERE id_incapacidades_historial = ?
            `,
            [id_incapacidades_historial]
        );

        // Verificamos si sí se actualizó alguna fila
        return updateExtension.affectedRows > 0;

    } catch (error) {
        console.error("Error al actualizar el estado de prórroga:", error);
        throw error;
    }

}






/* CAMBIAR PRÓRROGA A 0 - YA QUE NO CUMPLE LA POLÍTICA DE PRÓRROGA - TABLA HISTORIAL */
export async function updateDisabilitySettlementExtensionHis(id_incapacidades_historial) {
    try {
        const [updateHistorial] = await pool.query(
            `
                UPDATE incapacidades_historial
                SET prorroga = 0
                WHERE id_incapacidades_historial = ?
            `,
            [id_incapacidades_historial]
        );

        // Verificamos si sí se actualizó alguna fila
        return updateHistorial.affectedRows > 0;

    } catch (error) {
        console.error("Error al actualizar la prórroga en historial:", error);
        throw error;
    }
}

