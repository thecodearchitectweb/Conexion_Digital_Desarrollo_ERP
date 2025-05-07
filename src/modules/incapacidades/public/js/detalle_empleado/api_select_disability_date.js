
document.addEventListener("DOMContentLoaded", function () {
  const id_empleado = document.getElementById("info_empleado")?.dataset.id;
  const toggle = document.querySelector('input[name="input_toggle_prorroga"]');
  const selectFechas = document.getElementById("select_fecha_incapacidad");

  console.log("id_empleado", id_empleado)
  console.log("toggle", toggle)
  console.log("selectFechas", selectFechas)


  if (!id_empleado || !toggle) {
    console.log("FALTAN DATOS PARA INICIAR LA BÚSQUEDA");
    return;
  }

  toggle.addEventListener("change", async () => {
    if (toggle.checked) {
      try {
        const res = await fetch(`/incapacidad/api/select/disability/date/${id_empleado}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();

        if (data.success && Array.isArray(data.fechas)) {
          // Limpiar y agregar opciones
          selectFechas.innerHTML = `<option value="">Seleccione una fecha</option>`;
          data.fechas.forEach(f => {
            const fechaInicio = new Date(f.fecha_inicio).toISOString().slice(0, 10);
            const fechaFinal = new Date(f.fecha_final).toISOString().slice(0, 10);
            selectFechas.innerHTML += `<option value="${f.id}"> ${fechaInicio}  /  ${fechaFinal}</option>`;

          });

          
        } else {
         
          selectFechas.innerHTML = `<option value="">Seleccione una fecha</option>`;
          alert("No se encontraron fechas para este empleado.");
        }

      } catch (error) {
        console.error("Error al cargar las fechas:", error);
        alert("Ocurrió un error al consultar las fechas.");
      }
    } else {
      // Si se desactiva el toggle
      //selectFechas.classList.add("hidden");
      selectFechas.innerHTML = `<option value="">Seleccione una fecha</option>`;
    }
  });
});

