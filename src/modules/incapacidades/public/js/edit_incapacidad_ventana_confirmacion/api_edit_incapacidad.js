document.addEventListener("DOMContentLoaded", function () {
    
    document.getElementById("update-form").addEventListener("submit", async (e) => {
        e.preventDefault(); // Evitamos la recarga de la página
      
        // Creamos un objeto FormData
        const formData = new FormData();
      
        // 1. Recogemos los datos generales de la incapacidad
        const tipoIncapacidad = document.getElementById("tipo_incapacidad").value;
        const enfermedadGeneral = document.getElementById("enfermedad_general")?.value || ""; // si está visible
        const accidenteTransito = document.getElementById("accidente_laboral_transito")?.value || "";
        const fechaInicio = document.getElementById("fecha_inicio_incapacidad").value;
        const fechaFinal = document.getElementById("fecha_final_incapacidad").value;
        const codigoEnfermedadGeneral = document.getElementById("codigo_enfermedad_general").value;
        const descripcionDiagnostico = document.getElementById("descripcion_diagnostico").value;
        const descripcionCategoria = document.getElementById("descripcion_categoria").value;
        const codigoCategoria = document.getElementById("codigo_categoria").value;
        const idIncapacidad = document.querySelector('label[data-id-incapacidad]')?.dataset.idIncapacidad;
        const idEmpleado = document.querySelector('label[data-id-empleado]')?.dataset.idEmpleado;
        

        const datosClave = document.getElementById("datos-clave");

        const idEmpleado1 = datosClave.dataset.idEmpleado;
        const idIncapacidad1 = datosClave.dataset.idIncapacidad;
        const idFiles1 = JSON.parse(datosClave.dataset.idFiles || "[]");

        console.log("-----------------------------------Empleado:", idEmpleado1);
        console.log(" -----------------------------------Incapacidad:", idIncapacidad1);
        console.log(" -----------------------------------Archivos:", idFiles1); // → [3, 7, 12] o lo que tengas


      
        // Los agregamos al FormData
        formData.append("select_tipo_incapacidad", tipoIncapacidad);
        formData.append("select_detalle_incapacidad_eps_arl", enfermedadGeneral || accidenteTransito);
        formData.append("input_fecha_inicio_incapacidad", fechaInicio);
        formData.append("input_fecha_final_incapacidad", fechaFinal);
        formData.append("list_codigo_enfermedad_general", codigoEnfermedadGeneral);
        formData.append("input_descripcion_diagnostico", descripcionDiagnostico);
        formData.append("input_descripcion_categoria", descripcionCategoria);
        formData.append("input_codigo_categoria", codigoCategoria);
        formData.append("id_incapacidades_historial", idIncapacidad);
        formData.append("id_empleado", idEmpleado);
      

        // 2. Recogemos los datos de los archivos (sólo los modificados)
        // Suponemos que los rows de archivos están en el tbody de la tabla que contenga inputs con la clase "archivo-input"
        const fileRows = document.querySelectorAll("tbody tr");
        fileRows.forEach((row, idx) => {
          // Obtenemos el input oculto que tiene el ID del archivo
          const idInput = row.querySelector("input[name^='archivos_existentes'][name$='[id_ruta_documentos]']");
          if (!idInput) return; // si la fila no tiene datos de archivo, la salteamos
      
          const idRuta = idInput.value;
          // Siempre enviamos el ID para saber qué registro actualizar
          formData.append(`archivos[${idx}][id_ruta_documentos]`, idRuta);
      
          // Recogemos los demás campos de cada archivo si los tenés (por ejemplo, nombre actual, u otros)
          // Ejemplo: formData.append(`archivos[${idx}][nombre_actual]`, row.querySelector("input[name^='archivos_existentes'][name$='[nombre_actual]']").value);
      
          // Ahora, el input file
          const fileInput = row.querySelector(".archivo-input");
          // Si se seleccionó un nuevo archivo, lo agregamos
          if (fileInput && fileInput.files && fileInput.files.length > 0) {
            formData.append(`archivos[${idx}][archivo_nuevo]`, fileInput.files[0]);
          }
        });
      

        // 3. Enviar la petición fetch al endpoint
        try {
          const response = await fetch('/api/edit/incapacidad', {
            method: 'POST', // O PUT, según tu lógica en el backend
            body: formData
            // No seteamos el Content-Type: el navegador lo hace automáticamente con multipart/form-data
          });
      
          if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
          }
      
          const result = await response.json();
          console.log("Actualización exitosa:", result);
          // Aquí podés notificar al usuario o redirigir, según necesites
        } catch (error) {
          console.error("Error al actualizar:", error);
        }
      });
      
})