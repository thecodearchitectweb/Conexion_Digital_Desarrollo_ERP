document.getElementById("btn-agregar-incapacidad").addEventListener("click", () => {
    const idEmpleado = document.querySelector('label[data-id-empleado]')?.dataset.idEmpleado;

    if (idEmpleado) {
      const url = `/incapacidad/detalle/incapacidad/empleado/${idEmpleado}`;
      console.log("🔗 Redireccionando a:", url);
      window.location.href = url;
    } else {
      console.warn("❌ No se encontró el ID del empleado.");
      Swal.fire({
        icon: 'error',
        title: 'ID no encontrado',
        text: 'No se pudo obtener el ID del empleado.',
        confirmButtonColor: '#d33'
      });
    }
  });