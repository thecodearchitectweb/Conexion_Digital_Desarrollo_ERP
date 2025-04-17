/* document.addEventListener("DOMContentLoaded", function () {
    console.log("🟢 DOMContentLoaded: Iniciando script de actualización de incapacidad");
  
    const updateForm = document.getElementById("update-form");
    const submitButton = document.getElementById("submit-button");
  
    const campos = [
      document.getElementById("fecha_inicio_incapacidad"),
      document.getElementById("fecha_final_incapacidad"),
      document.getElementById("cantidad_dias"),
      document.getElementById("codigo_enfermedad_general"),
      document.getElementById("descripcion_diagnostico"),
      document.getElementById("descripcion_categoria"),
      document.getElementById("codigo_categoria"),
      document.getElementById("select_estado_incapacidad"),
      document.getElementById("message")
    ];
  
    function validarCampos() {
      let valid = true;
  
      campos.forEach(campo => {
        if (!campo || !campo.value || campo.value === "Sin detalle") {
          campo?.classList.add("border-red-500");
          campo?.classList.remove("border-gray-300", "border-b-lime-600");
          valid = false;
        } else {
          campo?.classList.remove("border-red-500");
          campo?.classList.add("border-gray-300", "border-b-lime-600");
        }
      });
  
      return valid;
    }
  
    updateForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      if (!validarCampos()) {
        Swal.fire({
          icon: 'error',
          title: 'Campos requeridos',
          text: 'Por favor completa todos los campos obligatorios de la incapacidad.',
        });
        return; // 🛑 No continúa con el envío
      }
  
      console.log("🔄 Form submit capturado. Iniciando procesamiento...");
      submitButton.disabled = true;
  
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
  
      const idIncapacidad = document.querySelector('label[data-id-incapacidad]')?.dataset.idIncapacidad;
      const idEmpleado = document.querySelector('label[data-id-empleado]')?.dataset.idEmpleado;
  
      const datosClave = document.getElementById("datos-clave");
      const idEmpleado1 = datosClave ? datosClave.dataset.idEmpleado : "";
      const idIncapacidad1 = datosClave ? datosClave.dataset.idIncapacidad : "";
  
      let detalleIncapacidad = "";
      if (tipoIncapacidad === "EPS") {
        detalleIncapacidad = enfermedadGeneral;
      } else if (tipoIncapacidad === "ARL") {
        detalleIncapacidad = accidenteTransito;
      }
  
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
  
      try {
        const response = await fetch('/api/edit/incapacidad', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
  
        if (!response.ok) {
          throw new Error(`Error en la petición: ${response.status}`);
        }
  
        const result = await response.json();
  
        Swal.fire({
          icon: 'success',
          title: 'Actualizado con éxito',
          text: 'La incapacidad fue actualizada correctamente.',
          confirmButtonColor: '#3085d6'
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
      }
    });
  });
   */