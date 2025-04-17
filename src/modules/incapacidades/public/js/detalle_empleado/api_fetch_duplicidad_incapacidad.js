
document.addEventListener("DOMContentLoaded", () => {
    // Obtenemos el input donde se selecciona la fecha de inicio de la incapacidad
    const inputFecha = document.getElementById("fecha_inicio_incapacidad");
  
    // Obtenemos el ID del empleado desde un elemento que tiene el ID 'info_empleado' y un atributo data-id
    const idEmpleado = document.getElementById("info_empleado")?.dataset.id;
  
    // Si no existe el input o no se pudo obtener el ID del empleado, interrumpimos la ejecución
    if (!inputFecha || !idEmpleado) return;
  
    // Se agrega un listener al input de fecha, que se activa cuando el usuario cambia la fecha
    inputFecha.addEventListener("change", async function () {
      const fechaSeleccionada = this.value;
  
      // Si el usuario no seleccionó ninguna fecha, no hacemos nada
      if (!fechaSeleccionada) return;
  
      try {
        // Enviamos una solicitud POST al backend con la fecha seleccionada y el ID del empleado
        const res = await fetch("/api/validacion/incapacidad/duplicada", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fecha: fechaSeleccionada,
            id_empleado: idEmpleado,
          }),
        });
  
        // Verificamos si la respuesta es válida
        const data = await res.json();

        // Si la propiedad 'duplicado' en la respuesta es verdadera
        if (res.status === 409 && data.duplicado) {
          Swal.fire({
            icon: "warning",
            title: "Fecha ya registrada",
            text: data.mensaje || "Ya existe una incapacidad registrada en esa fecha.",
            confirmButtonColor: "#84cc16",
          });

          // Limpiamos el campo de fecha para que el usuario seleccione otra
          this.value = "";
        } 
        // Si la propiedad 'duplicado' en la respuesta es falsa (no hay duplicado)
        else {
          Swal.fire({
            icon: "success",
            title: "Fecha válida",
            text: "No hay duplicados. Puedes continuar con el registro.",
            confirmButtonColor: "#84cc16",
          });
        }

      } catch (error) {
        // En caso de error de red o del servidor, lo mostramos en consola
        console.error("Error al validar fecha:", error);

        // También mostramos una alerta de error al usuario
        Swal.fire({
          icon: "error",
          title: "Error de red",
          text: "No se pudo validar la fecha. Intenta nuevamente.",
        });
      }
    });
  });
