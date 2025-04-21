// CONTROLLER - edit_incapacidad_ventana.js
import { pool } from "../../../models/db.js";

export const edit_incapacidad_ventana = async (req, res) => {
  try {
    console.log("=== Iniciando edit_incapacidad_ventana ===");
    console.log("📥 BODY:", req.body);


    /* DATOS RECIBIDOS DEL BODY */
    const {
      id_incapacidades_historial, 
      id_empleado,
      select_tipo_incapacidad,
      select_detalle_incapacidad_eps_arl, 
      input_fecha_inicio_incapacidad,
      input_fecha_final_incapacidad, 
      list_codigo_enfermedad_general,
      input_descripcion_diagnostico,
      input_descripcion_categoria, 
      input_codigo_categoria, 
      select_estado_incapacidad,
      input_observaciones,
      input_toggle_prorroga


    } = req.body;


    /* VALIDACION DE ID */
    if (!id_incapacidades_historial || !id_empleado) {
      console.log("❌ Datos obligatorios faltantes");
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    console.log("🟢 Actualizando datos principales de la incapacidad...");


    /* ACTUALIZAR LOS DATOS REGISTRADOS DE LA INCAPACIDAD */
    const [update_tracking_data] = await pool.query(
      `UPDATE incapacidades_historial SET 
        tipo_incapacidad = ?,                      
        subtipo_incapacidad = ?,                  
        fecha_inicio_incapacidad = ?,             
        fecha_final_incapacidad = ?,              
        cantidad_dias = DATEDIFF(?, ?),           
        codigo_categoria = ?,                     
        descripcion_categoria = ?,                
        codigo_subcategoria = ?,                  
        descripcion_subcategoria = ?,    
        prorroga = ?        
      WHERE id_empleado = ? AND id_incapacidades_historial = ?`,
      [
        select_tipo_incapacidad,
        select_detalle_incapacidad_eps_arl,
        input_fecha_inicio_incapacidad,
        input_fecha_final_incapacidad,
        input_fecha_final_incapacidad,
        input_fecha_inicio_incapacidad,
        input_codigo_categoria,
        input_descripcion_categoria,
        list_codigo_enfermedad_general,
        input_descripcion_diagnostico,
        input_toggle_prorroga,
        id_empleado,
        id_incapacidades_historial
      ]
    );
    

    console.log("✅ Datos de tabla INCAPACIDAD HISTORIAL, actualizados exitosamente: ", update_tracking_data);
    
    
    /* INSERTAR OBSERVACIONES Y ESTADO DE INCAPACIDAD */
    const [insert_tracking_data] = await pool.query(
      `
        INSERT INTO incapacidades_seguimiento
          (estado_incapacidad, observaciones, id_incapacidades_historial)
        VALUES
          (?, ?, ?)
      `,
      [
        select_estado_incapacidad,
        input_observaciones,
        id_incapacidades_historial
      ]
    );

    console.log("✅ Datos de tabla INCAPACIDAD HISTORIAL, actualizados exitosamente: ", insert_tracking_data);
    
    
    /* RESPUESTA A LA API POR MEDIO DE JSON */
    console.log("=== Proceso completado. Enviando respuesta al cliente ===");
    return res.json({
      ok: true,
      message: "Incapacidad actualizada correctamente",
    });

  } catch (error) {
    console.error("❌ Error en edit_incapacidad_ventana:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al actualizar incapacidad",
      error: error.message,
    });
  }
};