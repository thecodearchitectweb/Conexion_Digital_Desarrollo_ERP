document.getElementById("btn-ver-detalles").addEventListener("click", () => {
    const idIncapacidad = document.querySelector('label[data-id-incapacidad]')?.dataset.idIncapacidad;
    const idEmpleado = document.querySelector('label[data-id-empleado]')?.dataset.idEmpleado;

    if (idIncapacidad && idEmpleado) {
      const url = `/incapacidad/user/disabiblity/table/${idEmpleado}/${idIncapacidad}`;
      console.log("🔗 Redireccionando a:", url);
      window.location.href = url;
    } else {
      console.warn("❌ No se encontraron los IDs necesarios para la redirección.");
      Swal.fire({
        icon: 'error',
        title: 'Faltan datos',
        text: 'No se pudo obtener el ID del empleado o de la incapacidad.',
        confirmButtonColor: '#d33'
      });
    }
  });