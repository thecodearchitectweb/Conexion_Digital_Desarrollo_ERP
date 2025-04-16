
// API CLIENT - api_edit_incapacidad.js
document.addEventListener("DOMContentLoaded", function () {
  console.log("🟢 DOMContentLoaded: Iniciando script de actualización de incapacidad");

  const updateForm = document.getElementById("update-form");
  const submitButton = document.getElementById("submit-button");

  updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("🔄 Form submit capturado. Iniciando procesamiento...");
    submitButton.disabled = true;
    console.log("⛔ Botón deshabilitado para evitar múltiples envíos.");

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

    console.log("🟢 Datos generales recogidos:", {
      tipoIncapacidad,
      enfermedadGeneral,
      accidenteTransito,
      fechaInicio,
      fechaFinal,
      codigoEnfermedadGeneral,
      descripcionDiagnostico,
      descripcionCategoria,
      codigoCategoria,
      estadoIncapacidad
    });

    const idIncapacidad = document.querySelector('label[data-id-incapacidad]')?.dataset.idIncapacidad;
    const idEmpleado = document.querySelector('label[data-id-empleado]')?.dataset.idEmpleado;
    console.log("🟢 IDs recogidos:", { idIncapacidad, idEmpleado });

    const datosClave = document.getElementById("datos-clave");
    const idEmpleado1 = datosClave ? datosClave.dataset.idEmpleado : "";
    const idIncapacidad1 = datosClave ? datosClave.dataset.idIncapacidad : "";
    console.log("🟢 Datos clave del div oculto:", { idEmpleado1, idIncapacidad1 });

    let detalleIncapacidad = "";
    if (tipoIncapacidad === "EPS") {
      detalleIncapacidad = enfermedadGeneral;
    } else if (tipoIncapacidad === "ARL") {
      detalleIncapacidad = accidenteTransito;
    }
    console.log("🟢 Detalle de incapacidad definido:", detalleIncapacidad);

    const payload = {
      select_tipo_incapacidad: tipoIncapacidad,
      select_detalle_incapacidad_eps_arl: detalleIncapacidad,
      input_fecha_inicio_incapacidad: fechaInicio,
      input_fecha_final_incapacidad: fechaFinal,
      list_codigo_enfermedad_general: codigoEnfermedadGeneral,
      input_descripcion_diagnostico: descripcionDiagnostico,
      input_descripcion_categoria: descripcionCategoria,
      input_codigo_categoria: codigoCategoria,
      id_incapacidades_historial: idIncapacidad,
      id_empleado: idEmpleado,
      select_estado_incapacidad: estadoIncapacidad
    };

    console.log("🟢 Enviando petición al endpoint '/api/edit/incapacidad'...");
    try {
      const response = await fetch('/api/edit/incapacidad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      console.log("   Respuesta del servidor recibida:", response.status);

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Actualización exitosa:", result);

    } catch (error) {
      console.error("❌ Error al actualizar:", error);
    } finally {
      submitButton.disabled = false;
      console.log("🔄 Botón habilitado nuevamente.");
    }
  });
});
