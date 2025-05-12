document.addEventListener("DOMContentLoaded", function () {

  // Mensaje de que el DOM está completamente cargado
  console.log("🟢 DOMContentLoaded: Iniciando script de actualización de incapacidad");

  // Obtener elementos del DOM
  const codigoLiquidacion = document.getElementById("id_incapacidad_liquidada")?.textContent.trim();
  const observaciones = document.getElementById("observaciones");
  const buttonUpdate = document.getElementById("buttonUpdate");

  // Evento de clic en el botón de actualización
  buttonUpdate.addEventListener("click", async function (event) {
    // Evitar recargar la página
    event.preventDefault();

    // Capturar el estado seleccionado en tiempo real
    const estadoIncapacidad = document.getElementById("estado_incapacidad")?.value;

    // Validar que el estado sea diferente a "Seleccione un estado"
    if (estadoIncapacidad === "Seleccione un estado") {
      Swal.fire({
        icon: 'warning',
        title: 'Estado inválido',
        text: 'Debes seleccionar un estado válido.',
      });
      return; // Detener la ejecución
    }

    // Validar que las observaciones no estén vacías
    if (!observaciones.value.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Observación vacía',
        text: 'Debes ingresar una observación.',
      });
      return; // Detener la ejecución
    }

    try {

      // Realizar la solicitud POST a la API
      const response = await fetch('/api/agregar/nueva/observacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codigoLiquidacion,
          estadoIncapacidad,
          observacion: observaciones.value.trim()
        })
      });

      // Verificar la respuesta
      const result = await response.json();


      // Manejar la respuesta según el éxito
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: 'La incapacidad ha sido actualizada correctamente.',
        }).then(() => location.reload());
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error en la actualización',
          text: result.message || 'Hubo un problema al actualizar.',
        });
      }

    } catch (error) {

      // Manejar errores de red
      Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo conectar con el servidor.',
      });
    }

  });

});
