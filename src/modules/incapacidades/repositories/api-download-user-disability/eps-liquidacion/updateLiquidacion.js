import { pool } from "../../../../../models/db.js";

export async function updateSettlementTable(
  id_user_session,
  upd_liq_dias_eps,
  upd_Liq_porcentaje_liquidacion_eps,
  upd_liq_valor_eps,
  upd_dias_Laborados,
  upd_id_liquidacion,
  upd_dias_liquidables_totales
) {
  try {
    console.log("actualizacion eps por licncia");

    const [updateValues] = await pool.query(
      `
            UPDATE incapacidades_liquidacion
            SET
                id_user_session = ?,
                dias_liquidacion_eps = ?,
                porcentaje_liquidacion_eps = ?, 
                liquidacion_eps = ?,
                dias_laborados = ?,
                dias_liquidables_totales = ?
            WHERE id_incapacidades_liquidacion = ?
            `,
      [
        id_user_session,
        upd_liq_dias_eps,
        upd_Liq_porcentaje_liquidacion_eps,
        upd_liq_valor_eps,
        upd_dias_Laborados,
        upd_dias_liquidables_totales,
        upd_id_liquidacion,
      ]
    );

    return updateValues.affectedRows > 0;
  } catch (error) {
    console.error("❌ Error al actualizar incapacidades_liquidacion:", error);
    throw error;
  }
}





/* EMPLEADOR */
export async function updateSettlementTableEmpleador(
 id_user, upd_liq_dias_empleador, upd_Liq_porcentaje_liquidacion_empleador, upd_liq_valor_empleador, upd_dias_Laborados, upd_id_liquidacion, upd_dias_liquidables_totales
) {
  try {
    console.log("actualizacion Empleador sin prorroga");

    const [result] = await pool.query(
        `
            UPDATE 
                incapacidades_liquidacion
            SET
                id_user_session = ?,
                dias_liquidacion_empleador = ?,
                porcentaje_liquidacion_empleador = ?, 
                liquidacion_empleador = ?,
                dias_laborados = ?,
                dias_liquidables_totales = ?
            WHERE 
                id_incapacidades_liquidacion = ?
        `,
      [
        id_user, upd_liq_dias_empleador, upd_Liq_porcentaje_liquidacion_empleador, upd_liq_valor_empleador, upd_dias_Laborados,  upd_dias_liquidables_totales, upd_id_liquidacion
        
      ]
    );

    // Si se afectó al menos una fila, devolvemos true, si no, false
    return result.affectedRows > 0;


    } catch (error) {
    console.error("❌ Error al actualizar incapacidades_liquidacion:", error);
    throw error;
  }
}





/* EPS */
export async function updateSettlementTableEps(
 id_user, upd_liq_dias_eps, upd_Liq_porcentaje_liquidacion_eps, upd_liq_valor_eps, upd_dias_Laborados, upd_id_liquidacion, upd_dias_liquidables_totales
) {
  try {
    console.log("actualizacion EPS sin prorroga");

    const [result] = await pool.query(
        `
            UPDATE 
                incapacidades_liquidacion
            SET
                id_user_session = ?,
                dias_liquidacion_eps = ?,
                porcentaje_liquidacion_eps = ?, 
                liquidacion_eps = ?,
                dias_laborados = ?,
                dias_liquidables_totales = ?
            WHERE 
                id_incapacidades_liquidacion = ?
        `,
      [
        id_user, upd_liq_dias_eps, upd_Liq_porcentaje_liquidacion_eps, upd_liq_valor_eps, upd_dias_Laborados,  upd_dias_liquidables_totales, upd_id_liquidacion
        
      ]
    );

    // Si se afectó al menos una fila, devolvemos true, si no, false
    return result.affectedRows > 0;


    } catch (error) {
    console.error("❌ Error al actualizar incapacidades_liquidacion:", error);
    throw error;
  }
}




/* EPS - 50% */
export async function updateSettlementTableEps_50(
 id_user, upd_liq_dias_eps, upd_Liq_porcentaje_liquidacion_eps, upd_liq_valor_eps, upd_dias_Laborados, upd_id_liquidacion, upd_dias_liquidables_totales
) {
  try {
    console.log("actualizacion EPS 50% sin prorroga");

    const [result] = await pool.query(
        `
            UPDATE 
                incapacidades_liquidacion
            SET
                id_user_session = ?,
                dias_liquidacion_eps_50 = ?,
                porcentaje_liquidacion_eps_50 = ?, 
                liquidacion_eps_50 = ?,
                dias_laborados = ?,
                dias_liquidables_totales = ?
            WHERE 
                id_incapacidades_liquidacion = ?
        `,
      [
        id_user, upd_liq_dias_eps, upd_Liq_porcentaje_liquidacion_eps, upd_liq_valor_eps, upd_dias_Laborados,  upd_dias_liquidables_totales, upd_id_liquidacion
        
      ]
    );

    // Si se afectó al menos una fila, devolvemos true, si no, false
    return result.affectedRows > 0;


    } catch (error) {
    console.error("❌ Error al actualizar incapacidades_liquidacion:", error);
    throw error;
  }
}




/* FONDO DE PENSIONES */
export async function updateSettlementTableFondoPensiones(
 id_user, upd_liq_dias_fondo_pensiones, upd_Liq_porcentaje_liquidacion_fondo_pensiones, upd_liq_valor_fondo_pensiones, upd_dias_Laborados, upd_id_liquidacion, upd_dias_liquidables_totales
) {
  try {
    console.log("actualizacion EPS 50% sin prorroga");

    const [result] = await pool.query(
        `
            UPDATE 
                incapacidades_liquidacion
            SET
                id_user_session = ?,
                dias_liquidacion_fondo_pensiones = ?,
                porcentaje_liquidacion_fondo_pensiones = ?, 
                liquidacion_fondo_pensiones = ?,
                dias_laborados = ?,
                dias_liquidables_totales = ?
            WHERE 
                id_incapacidades_liquidacion = ?
        `,
      [
        id_user, upd_liq_dias_fondo_pensiones, upd_Liq_porcentaje_liquidacion_fondo_pensiones, upd_liq_valor_fondo_pensiones, upd_dias_Laborados,  upd_dias_liquidables_totales, upd_id_liquidacion
        
      ]
    );

    // Si se afectó al menos una fila, devolvemos true, si no, false
    return result.affectedRows > 0;


    } catch (error) {
    console.error("❌ Error al actualizar incapacidades_liquidacion:", error);
    throw error;
  }
}




/* FONDO DE EPS FONDO DE PENSIONES */
export async function updateSettlementTableEpsFondoPensiones(
 id_user, upd_liq_dias_eps_fondo_pensiones, upd_Liq_porcentaje_liquidacion_eps_fondo_pensiones, upd_liq_valor_eps_fondo_pensiones, upd_dias_Laborados, upd_id_liquidacion, upd_dias_liquidables_totales
) {
  try {
    console.log("actualizacion EPS 50% sin prorroga");

    const [result] = await pool.query(
        `
            UPDATE 
                incapacidades_liquidacion
            SET
                id_user_session = ?,
                dias_liquidacion_eps_fondo_pensiones = ?,
                porcentaje_liquidacion_eps_fondo_pensiones = ?, 
                liquidacion_eps_fondo_pensiones = ?,
                dias_laborados = ?,
                dias_liquidables_totales = ?
            WHERE 
                id_incapacidades_liquidacion = ?
        `,
      [
        id_user, upd_liq_dias_eps_fondo_pensiones, upd_Liq_porcentaje_liquidacion_eps_fondo_pensiones, upd_liq_valor_eps_fondo_pensiones, upd_dias_Laborados,  upd_dias_liquidables_totales, upd_id_liquidacion
        
      ]
    );

    // Si se afectó al menos una fila, devolvemos true, si no, false
    return result.affectedRows > 0;


    } catch (error) {
    console.error("❌ Error al actualizar incapacidades_liquidacion:", error);
    throw error;
  }
}
