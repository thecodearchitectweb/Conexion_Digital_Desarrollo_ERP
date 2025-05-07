document.addEventListener("DOMContentLoaded", () => {
    const selectIncapacidad = document.getElementById("select_fecha_incapacidad");
    const containerData = document.getElementById("container_data_incapacidad_prorroga");
  
    selectIncapacidad.addEventListener("change", async function () {
      const id_incapacidad = this.value;
  
      if (!id_incapacidad) {
        console.log("No se seleccionó ninguna incapacidad.");
        containerData.classList.add("hidden");
        return;
      }
  
      console.log("ID seleccionado:", id_incapacidad);
  
      try {
        const res = await fetch(`/incapacidad/api/select/disability/extension/${id_incapacidad}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!res.ok) throw new Error("Error al obtener datos del servidor");
  
        const data = await res.json();
        console.log("Datos recibidos:", data);
  
        const incapacidad = data.data;
  
        document.getElementById("api_extension_incapacidad").textContent = incapacidad.tipo_incapacidad || "Sin datos";
        document.getElementById("api_extension_enfermedad_general").textContent = incapacidad.subtipo_incapacidad || "Sin datos";
        document.getElementById("api_extension_inicio").textContent = new Date(incapacidad.fecha_inicio_incapacidad).toLocaleDateString() || "Sin datos";
        document.getElementById("api_extension_final").textContent = new Date(incapacidad.fecha_final_incapacidad).toLocaleDateString() || "Sin datos";
        document.getElementById("api_extension_dias").textContent = incapacidad.cantidad_dias || "Sin datos";
        document.getElementById("api_extension_categoria").textContent = incapacidad.codigo_categoria || "Sin datos";
        document.getElementById("api_extension_descripcion_categoria").textContent = incapacidad.descripcion_categoria || "Sin datos";
        document.getElementById("api_extension_sub_categoria").textContent = incapacidad.codigo_subcategoria || "Sin datos";
        document.getElementById("api_extension_descripcion_sub_categoria").textContent = incapacidad.descripcion_subcategoria || "Sin datos";
        document.getElementById("api_extension_prorroga").textContent = incapacidad.prorroga ? "Sí" : "No";
  
        containerData.classList.remove("hidden");
  
      } catch (error) {
        console.error("Hubo un error al hacer fetch:", error);
        containerData.classList.add("hidden");
      }
    });
  });
  