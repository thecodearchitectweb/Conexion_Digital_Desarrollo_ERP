document.addEventListener("DOMContentLoaded", function () {
    const codigoInput = document.getElementById("codigo_enfermedad_general");
    const descripcionDiagnosticoInput = document.getElementById("descripcion_diagnostico");
    const codigoCategoriaInput = document.getElementById("codigo_categoria");
    const descripcionCategoriaInput = document.getElementById("descripcion_categoria");


    codigoInput.addEventListener("change", function () {
        const codigo = codigoInput.value.trim(); 

        if (codigo) {
            console.log("🔍 Consultando API con código:", codigo); // Debug

            fetch(`/api/cie_10/${codigo}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("📥 Datos recibidos:", data); // Debug

                    if (data.success) {
                        descripcionDiagnosticoInput.value = data.descripcion_subcategoria || "No disponible";
                        codigoCategoriaInput.value = data.codigo_categoria || "No disponible";
                        descripcionCategoriaInput.value = data.descripcion_categoria || "No disponible";
                        
                        
                        console.log("✅ Inputs actualizados correctamente.");
                    } else {
                        alert("Código no encontrado en la base de datos.");
                        descripcionDiagnosticoInput.value = "";
                        codigoCategoriaInput.value = "";
                        descripcionCategoriaInput.value = "";
                    }
                })
                .catch(error => {
                    console.error("❌ Error en la consulta:", error);
                    alert("Hubo un problema al obtener los datos.");
                });
        }
    });
});