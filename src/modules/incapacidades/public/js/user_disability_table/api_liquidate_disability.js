// Asegúrate de que SweetAlert2 esté cargado en tu HTML

document.addEventListener("DOMContentLoaded", function () {
    const btnLiquidar = document.getElementById("btnLiquidar");
  
    btnLiquidar.addEventListener("click", async function () {
      const idLiquidacion = document.getElementById("modal-id-liquidacion")?.innerText.trim();
      const idHistorial = document.getElementById("modal-id-historial")?.innerText.trim();
  
      if (!idLiquidacion || !idHistorial) {
        return Swal.fire({
          icon: "error",
          title: "Datos faltantes",
          text: "No se encontraron los IDs necesarios para procesar la liquidación."
        });
      }
  
      const confirmacion = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Estás a punto de liquidar esta incapacidad. ¡Esta acción no se puede deshacer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, liquidar",
        cancelButtonText: "Cancelar"
      });
  
      if (!confirmacion.isConfirmed) return;
  
      try {
        const response = await fetch(`/api/download/user/disability/${idLiquidacion}/${idHistorial}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        const result = await response.json();
  
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Liquidación completada",
            text: result.message || "La incapacidad fue liquidada correctamente."
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error en la liquidación",
            text: result.message || "No se pudo procesar la liquidación."
          });
        }
      } catch (error) {
        console.error("Error en la petición:", error);
        Swal.fire({
          icon: "error",
          title: "Error del servidor",
          text: error.message || "Ocurrió un error inesperado."
        });
      }
    });
  });
  