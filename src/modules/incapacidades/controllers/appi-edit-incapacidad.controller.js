import { pool } from "../../../models/db.js";
import fs from "fs/promises";
import path from "path";

export const edit_incapacidad_ventana = async (req, res) => {
  try {
    console.log("=== Iniciando edit_incapacidad_ventana ===");
    console.log("📥 BODY:", req.body);
    console.log("📎 FILES:", req.files);

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
    } = req.body;

    if (!id_incapacidades_historial || !id_empleado) {
      console.log("❌ Datos obligatorios faltantes");
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    // 1. Actualizar datos principales de la incapacidad
    console.log("🟢 Actualizando datos principales de la incapacidad...");
    await pool.query(`
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
    `, [
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
    ]);
    console.log("✅ Datos principales actualizados");

    // 2. Procesar archivos enviados
    console.log("🟢 Procesando archivos enviados...");
    let archivosProcesados = req.body.archivos || [];
    archivosProcesados = Array.isArray(archivosProcesados)
      ? archivosProcesados.map(a => (typeof a === 'string' ? JSON.parse(a) : a))
      : [];
    console.log("Archivos procesados inicial:", archivosProcesados);

    const archivosSubidos = (req.files || [])
      .map(file => {
        const match = file.fieldname.match(/archivos\[(\d+)\]\[archivo_nuevo\]/);
        if (!match) return null;
        return { index: parseInt(match[1]), file };
      })
      .filter(Boolean);
    console.log("Archivos subidos:", archivosSubidos);

    archivosSubidos.forEach(({ index, file }) => {
      if (!archivosProcesados[index]) archivosProcesados[index] = {};
      archivosProcesados[index].archivo_nuevo = file;
    });
    console.log("Archivos procesados final:", archivosProcesados);

    // 3. Procesar cada archivo para actualizarlo
    console.log("🟢 Procesando actualización de cada archivo...");
    for (const [i, archivo] of archivosProcesados.entries()) {
      if (!archivo?.archivo_nuevo || !archivo.id_ruta_documentos) {
        console.log(`ℹ️ Saltando archivo en posición ${i} por datos insuficientes`);
        continue;
      }
      const archivoNuevo = archivo.archivo_nuevo;
      console.log(`🔄 Procesando archivo en índice ${i} (ID BD: ${archivo.id_ruta_documentos})`);

      // 3a. Recuperar la ruta antigua (guardada en BD)
      console.log("   🟢 Consultando ruta antigua en BD...");
      const [result] = await pool.query(
        "SELECT ruta FROM ruta_documentos WHERE id_ruta_documentos = ?",
        [archivo.id_ruta_documentos]
      );
      console.log("   Resultado BD:", result);

      if (result.length > 0 && result[0].ruta) {
        const oldRutaRel = result[0].ruta;
        console.log("   Ruta antigua relativa:", oldRutaRel);
        const oldIncapacidadFolderRel = path.dirname(oldRutaRel);
        console.log("   Carpeta de incapacidad antigua (relativa):", oldIncapacidadFolderRel);

        // Convertir a absoluta: se asume que la raíz de archivos es "upload"
        const absoluteUploadPath = path.resolve("upload");
        const oldFolderParts = oldIncapacidadFolderRel.replace(/^[/\\]+/, "").split(/[\\/]+/);
        const oldIncapacidadFolderAbs = path.join(absoluteUploadPath, ...oldFolderParts);
        console.log("   Carpeta de incapacidad antigua (absoluta):", oldIncapacidadFolderAbs);

        // Carpeta donde se subió el nuevo archivo
        const newFileFolderAbs = path.dirname(archivoNuevo.path);
        console.log("   Carpeta donde se subió el nuevo archivo:", newFileFolderAbs);

        // Si la carpeta antigua es distinta a la nueva, eliminamos la carpeta de la incapacidad antigua
        if (oldIncapacidadFolderAbs !== newFileFolderAbs) {
          console.log("   🔄 Eliminando carpeta de la incapacidad antigua...");
          try {
            await fs.rm(oldIncapacidadFolderAbs, { recursive: true, force: true });
            console.log(`   🗑️ Carpeta eliminada: ${oldIncapacidadFolderAbs}`);
          } catch (e) {
            console.warn(`   ⚠️ Error al eliminar carpeta ${oldIncapacidadFolderAbs}: ${e.message}`);
          }
        } else {
          console.log("   ℹ️ La carpeta antigua y la nueva son iguales. No se elimina.");
        }
      } else {
        console.log("   ℹ️ No se encontró ruta antigua en BD para este archivo.");
      }

      // 3b. Renombrar el archivo subido con un nuevo nombre
      console.log("   🔄 Renombrando archivo subido...");
      const timestamp = Date.now();
      const nuevoNombre = `${timestamp}-${archivoNuevo.originalname}`;
      const nuevaRutaCompleta = path.join(path.dirname(archivoNuevo.path), nuevoNombre);
      console.log("   Nueva ruta completa:", nuevaRutaCompleta);
      await fs.rename(archivoNuevo.path, nuevaRutaCompleta);
      console.log("   ✅ Archivo renombrado");

      // 3c. Construir la ruta para la BD en formato web usando path.relative()
      const absoluteUploadPath = path.resolve("upload");
      const rutaRelativa = path.relative(absoluteUploadPath, nuevaRutaCompleta);
      console.log("   Ruta relativa (calculada con path.relative):", rutaRelativa);
      // Formatearla para BD con barra invertida y agregar la barra inicial
      const rutaDB = "\\" + rutaRelativa.replace(/\//g, '\\');
      console.log("   Ruta construida para BD:", rutaDB);

      // 3d. Actualizar la información del archivo en BD
      console.log("   🔄 Actualizando BD con la nueva ruta...");
      await pool.query(`
        UPDATE ruta_documentos
        SET nombre = ?, ruta = ?, fecha_actualizacion = NOW()
        WHERE id_ruta_documentos = ?
      `, [nuevoNombre, rutaDB, archivo.id_ruta_documentos]);
      console.log(`   ✅ Archivo actualizado en BD: ${nuevoNombre}`);
    }

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
