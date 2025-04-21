// Comentamos todo el código para mejor comprensión

document.addEventListener("DOMContentLoaded", function () {
  // Mensaje de que el DOM está completamente cargado
  console.log("🟢 DOMContentLoaded: Iniciando script de actualización de incapacidad");

  // Obtenemos el formulario de actualización y el botón de envío
  const updateForm = document.getElementById("update-form");
  const submitButton = document.getElementById("submit-button");

  // Recoge los IDs desde atributos en el HTML (puestos en un label por ejemplo)
  const idIncapacidad = document.querySelector('label[data-id-incapacidad]')?.dataset.idIncapacidad;
  const idEmpleado = document.querySelector('label[data-id-empleado]')?.dataset.idEmpleado;
  console.log("🟢 IDs recogidos:", { idIncapacidad, idEmpleado });

  // Escucha el envío del formulario
  updateForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Previene que el formulario se envíe normalmente (recarga la página)
    console.log("🔄 Form submit capturado. Iniciando procesamiento...");

    submitButton.disabled = true; // Deshabilita el botón para evitar envíos múltiples

    // Captura los valores de los campos del formulario
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
    const observaciones = document.getElementById("message").value;
    const prorroga = document.getElementById("input_toggle_prorroga").checked ? 1 : 0; // ✔ Capturamos el estado del toggle

    // Validación de campos obligatorios
    const requiredFields = [
      "tipo_incapacidad",
      tipoIncapacidad === "EPS" ? "enfermedad_general" : "accidente_laboral_transito",
      "fecha_inicio_incapacidad",
      "fecha_final_incapacidad",
      "codigo_enfermedad_general",
      "descripcion_diagnostico",
      "descripcion_categoria",
      "codigo_categoria",
      "select_estado_incapacidad",
      "message"
    ];

    let isValid = true;
    requiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (field && !field.value.trim()) {
        field.classList.add("border-t", "border-red-600", "border-b-4", "border-b-red-600");
        isValid = false;
      } else {
        field.classList.remove("border-t", "border-red-600", "border-b-4", "border-b-red-600");
      }
      // Elimina el borde rojo al escribir
      field.addEventListener("input", () => {
        field.classList.remove("border-t", "border-red-600", "border-b-4", "border-b-red-600");
      });
    });

    if (!isValid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos obligatorios.',
        confirmButtonColor: '#ffc107'
      });
      submitButton.disabled = false;
      return;
    }

    // Creamos el objeto que vamos a enviar al backend
    const payload = {
      id_incapacidades_historial: idIncapacidad,
      id_empleado: idEmpleado,
      select_tipo_incapacidad: tipoIncapacidad,
      select_detalle_incapacidad_eps_arl: tipoIncapacidad === "EPS" ? enfermedadGeneral : accidenteTransito,
      input_fecha_inicio_incapacidad: fechaInicio,
      input_fecha_final_incapacidad: fechaFinal,
      list_codigo_enfermedad_general: codigoEnfermedadGeneral,
      input_descripcion_diagnostico: descripcionDiagnostico,
      input_descripcion_categoria: descripcionCategoria,
      input_codigo_categoria: codigoCategoria,
      select_estado_incapacidad: estadoIncapacidad,
      input_observaciones: observaciones,
      input_toggle_prorroga: prorroga // ✔ Se agrega la prorrogra al payload
    };

    console.log("🟢 Enviando petición al endpoint '/api/edit/incapacidad'...");

    // Hacemos la petición a la API
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

      Swal.fire({
        icon: 'success',
        title: 'Actualizado con éxito',
        text: 'La incapacidad fue actualizada correctamente.',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        window.location.href = '/incapacidad/tabla/incapacidades';
      });

    } catch (error) {
      console.error("❌ Error al actualizar:", error);

      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: 'Ocurrió un problema al actualizar la incapacidad.',
        confirmButtonColor: '#d33'
      });

    } finally {
      submitButton.disabled = false;
      console.log("🔄 Botón habilitado nuevamente.");
    }
  });
});
