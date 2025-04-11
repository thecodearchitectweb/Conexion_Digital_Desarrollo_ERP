// Importaciones a nivel superior
import { pool } from "../../../models/db.js";
import fs from "fs/promises"; // para manejo de archivos con async/await

export const edit_incapacidad_ventana = async (req, res) => {
  try {
    console.log("📥 BODY:", req.body);
    console.log("📎 FILES:", req.files);

    // Extraer datos generales del body
    const data = req.body;
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
    } = data;

    console.log("Estos son los datos recopilados para actualizar", data);

    // Validación básica
    if (!id_incapacidades_historial || !id_empleado) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    // Actualizar la tabla de incapacidades_historial
    const query = `
      UPDATE incapacidades_historial 
      SET 
        tipo_incapacidad = ?, 
        subtipo_incapacidad = ?, 
        fecha_inicio_incapacidad = ?, 
        fecha_final_incapacidad = ?, 
        cantidad_dias = DATEDIFF(?, ?), 
        codigo_categoria = ?, 
        descripcion_categoria = ?, 
        codigo_subcategoria = ?, 
        descripcion_subcategoria = ?, 
        id_empleado = ?
      WHERE id_incapacidades_historial = ?
    `;
    const values = [
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
      id_empleado,
      id_incapacidades_historial,
    ];
    await pool.query(query, values);

    // ------------------------------------------------------------------
    // Procesamiento de archivos:
    // Como ya se parseó el campo "archivos" en el body, lo extraemos directamente:
    const archivosProcesados = req.body.archivos || [];
    console.log("--------------------Paso 1, File: ", archivosProcesados);

    // 2. Procesar archivos subidos con Multer
    // Se espera que el nombre del campo sea: "archivos[<index>][archivo_nuevo]"
    const archivosSubidos = (req.files || [])
      .map((file) => {
        const match = file.fieldname.match(/archivos\[(\d+)\]\[archivo_nuevo\]/);
        if (!match) return null; // campo con nombre inesperado
        const index = parseInt(match[1]);
        return { index, file };
      })
      .filter(Boolean);

    // 3. Vincular archivos subidos con sus registros en el array
    archivosSubidos.forEach(({ index, file }) => {
      if (archivosProcesados[index]) {
        archivosProcesados[index].archivo_nuevo = file;
      } else {
        archivosProcesados[index] = { archivo_nuevo: file };
      }
    });

    console.log("📦 DATOS FINALES:");
    console.log("→ Tipo incapacidad:", select_tipo_incapacidad);
    console.log("→ Fecha inicio:", input_fecha_inicio_incapacidad);
    console.log("→ Archivos procesados:", archivosProcesados);

    // 4. Procesar la actualización de cada archivo en la base de datos
    // Se asume que cada objeto en el array tiene el campo "id_ruta_documentos"
    for (const archivo of archivosProcesados) {
        if (!archivo || !archivo.archivo_nuevo) continue; {
        const archivoNuevo = archivo.archivo_nuevo;
        try {
          // Buscar la ruta actual del archivo en la BD
          const [result] = await pool.query(
            "SELECT ruta FROM ruta_documentos WHERE id_ruta_documentos = ?",
            [archivo.id_ruta_documentos]
          );
          if (result.length > 0 && result[0].ruta) {
            const rutaAnterior = result[0].ruta;
            try {
              // Intentar eliminar el archivo antiguo
              await fs.unlink(rutaAnterior);
              console.log(`🗑️ Archivo anterior eliminado: ${rutaAnterior}`);
            } catch (e) {
              console.warn(`⚠️ No se pudo eliminar el archivo anterior (${rutaAnterior}):`, e.message);
            }
          }

          // Preparar datos del nuevo archivo: renombrar con timestamp para evitar duplicados
          const timestamp = Date.now();
          const nuevoNombre = `${timestamp}-${archivoNuevo.originalname}`;
          const nuevaRuta = archivoNuevo.path.replace(/\\/g, '/');

          const updateArchivoQuery = `
            UPDATE ruta_documentos
            SET nombre = ?, ruta = ?, fecha_actualizacion = NOW()
            WHERE id_ruta_documentos = ?
          `;
          const updateValues = [nuevoNombre, nuevaRuta, archivo.id_ruta_documentos];

          await pool.query(updateArchivoQuery, updateValues);
          console.log(`✅ Archivo actualizado en BD para ID: ${archivo.id_ruta_documentos}`);
        } catch (err) {
          console.error(`❌ Error procesando archivo ID ${archivo.id_ruta_documentos}:`, err.message);
        }
      }
    }
    // ------------------------------------------------------------------

    return res.json({
      ok: true,
      message: "Incapacidad actualizada correctamente",
    });
  } catch (error) {
    console.error("❌ Error en edit_incapacidad_ventana:", error);
    return res.status(500).json({
      ok: false,
      message: "Ocurrió un error al actualizar la incapacidad",
      error: error.message,
    });
  }
};
