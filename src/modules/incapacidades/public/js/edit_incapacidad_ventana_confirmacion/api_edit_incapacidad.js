document.addEventListener("DOMContentLoaded", function () {
  console.log("🟢 DOMContentLoaded: Iniciando script de actualización de incapacidad");

  const updateForm = document.getElementById("update-form");
  const submitButton = document.getElementById("submit-button");

  updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("🔄 Form submit capturado. Iniciando procesamiento...");

    submitButton.disabled = true;
    console.log("⛔ Botón deshabilitado para evitar múltiples envíos.");

    // Crear objeto FormData
    const formData = new FormData();
    console.log("🟢 FormData creado.");

    // 1. Recoger datos generales de la incapacidad
    const tipoIncapacidad = document.getElementById("tipo_incapacidad").value;
    const enfermedadGeneral = document.getElementById("enfermedad_general")?.value || "";
    const accidenteTransito = document.getElementById("accidente_laboral_transito")?.value || "";
    const fechaInicio = document.getElementById("fecha_inicio_incapacidad").value;
    const fechaFinal = document.getElementById("fecha_final_incapacidad").value;
    const codigoEnfermedadGeneral = document.getElementById("codigo_enfermedad_general").value;
    const descripcionDiagnostico = document.getElementById("descripcion_diagnostico").value;
    const descripcionCategoria = document.getElementById("descripcion_categoria").value;
    const codigoCategoria = document.getElementById("codigo_categoria").value;
    const estadoIncapacidad = document.getElementById("select_estado_incapacidad").value;

    console.log("🟢 Datos generales recogidos:");
    console.log("   Tipo Incapacidad:", tipoIncapacidad);
    console.log("   Enfermedad General:", enfermedadGeneral);
    console.log("   Accidente Transito:", accidenteTransito);
    console.log("   Fecha Inicio:", fechaInicio);
    console.log("   Fecha Final:", fechaFinal);
    console.log("   Código Enfermedad General:", codigoEnfermedadGeneral);
    console.log("   Diagnóstico:", descripcionDiagnostico);
    console.log("   Categoría:", descripcionCategoria);
    console.log("   Código Categoría:", codigoCategoria);
    console.log("   Estado Incapacidad:", estadoIncapacidad);

    // Obtenemos los IDs desde etiquetas o un div oculto
    const idIncapacidad = document.querySelector('label[data-id-incapacidad]')?.dataset.idIncapacidad;
    const idEmpleado = document.querySelector('label[data-id-empleado]')?.dataset.idEmpleado;
    console.log("🟢 IDs recogidos:");
    console.log("   ID Incapacidad:", idIncapacidad);
    console.log("   ID Empleado:", idEmpleado);

    // Si hay un div oculto con datos adicionales:
    const datosClave = document.getElementById("datos-clave");
    const idEmpleado1 = datosClave ? datosClave.dataset.idEmpleado : "";
    const idIncapacidad1 = datosClave ? datosClave.dataset.idIncapacidad : "";
    const idFiles1 = datosClave ? JSON.parse(datosClave.dataset.idFiles || "[]") : [];
    console.log("🟢 Datos clave del div oculto:");
    console.log("   ID Empleado (1):", idEmpleado1);
    console.log("   ID Incapacidad (1):", idIncapacidad1);
    console.log("   IDs de archivos:", idFiles1);

    // Definir detalle de incapacidad según tipo
    let detalleIncapacidad = "";
    if (tipoIncapacidad === "EPS") {
      detalleIncapacidad = enfermedadGeneral;
    } else if (tipoIncapacidad === "ARL") {
      detalleIncapacidad = accidenteTransito;
    }
    console.log("🟢 Detalle de incapacidad definido:", detalleIncapacidad);

    // Agregar datos generales al FormData
    formData.append("select_tipo_incapacidad", tipoIncapacidad);
    formData.append("select_detalle_incapacidad_eps_arl", detalleIncapacidad);
    formData.append("input_fecha_inicio_incapacidad", fechaInicio);
    formData.append("input_fecha_final_incapacidad", fechaFinal);
    formData.append("list_codigo_enfermedad_general", codigoEnfermedadGeneral);
    formData.append("input_descripcion_diagnostico", descripcionDiagnostico);
    formData.append("input_descripcion_categoria", descripcionCategoria);
    formData.append("input_codigo_categoria", codigoCategoria);
    formData.append("id_incapacidades_historial", idIncapacidad);
    formData.append("id_empleado", idEmpleado);
    formData.append("select_estado_incapacidad", estadoIncapacidad);
    console.log("✅ Datos generales añadidos al FormData.");

    // 2. Recoger datos de archivos modificados
    console.log("🟢 Procesando datos de archivos en el formulario...");
    const fileRows = document.querySelectorAll("tbody tr");
    fileRows.forEach((row, idx) => {
      console.log(`   Procesando fila de archivo en índice ${idx}`);
      const idInput = row.querySelector("input[name^='archivos_existentes'][name$='[id_ruta_documentos]']");
      if (!idInput) {
        console.log(`   ℹ️ No se encontró input de id_ruta_documentos en fila ${idx}, se saltea.`);
        return;
      }
      const idRuta = idInput.value;
      formData.append(`archivos[${idx}][id_ruta_documentos]`, idRuta);
      console.log(`   ✅ Se agregó id_ruta_documentos: ${idRuta} en índice ${idx}`);
      
      const fileInput = row.querySelector(".archivo-input");
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        formData.append(`archivos[${idx}][archivo_nuevo]`, fileInput.files[0]);
        console.log(`   ✅ Se agregó archivo en índice ${idx}: ${fileInput.files[0].name}`);
      } else {
        console.log(`   ℹ️ No hay archivo nuevo en fila ${idx}`);
      }
    });

    // 3. Enviar la petición fetch al endpoint
    console.log("🟢 Enviando petición al endpoint '/api/edit/incapacidad'...");
    try {
      const response = await fetch('/api/edit/incapacidad', {
        method: 'POST',
        body: formData
      });
      console.log("   Respuesta del servidor recibida:", response.status);

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Actualización exitosa:", result);

/*       if (result.ok) {
        console.log("🔄 Redireccionando a '/incapacidad/tabla/incapacidades'");
        window.location.href = "/incapacidad/tabla/incapacidades";
      } */
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
    } finally {
      submitButton.disabled = false;
      console.log("🔄 Botón habilitado nuevamente.");
    }
  });
});
