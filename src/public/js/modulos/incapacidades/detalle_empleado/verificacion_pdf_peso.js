document.addEventListener("DOMContentLoaded", function () {
    // Seleccionamos todos los input file dentro del contenedor
    const fileInputs = document.querySelectorAll("#container_files_incapacidad input[type='file']");

    fileInputs.forEach(input => {
        input.addEventListener("change", function () {
            const file = this.files[0]; // Obtener el archivo seleccionado
            
            if (file) {
                const fileType = file.type; // Obtener tipo de archivo
                const fileSize = file.size; // Obtener tamaño en bytes

                // Validar que sea un PDF
                if (fileType !== "application/pdf") {
                    alert("❌ Solo se permiten archivos en formato PDF.");
                    this.value = ""; // Limpiar el input file
                    return;
                }

                // Validar que no supere los 5MB (5 * 1024 * 1024 bytes)
                if (fileSize > 5 * 1024 * 1024) {
                    alert("❌ El archivo no debe superar los 5MB.");
                    this.value = ""; // Limpiar el input file
                    return;
                }

                // ✅ Si cumple las validaciones, se mantiene el archivo seleccionado
                console.log(`✔️ Archivo válido: ${file.name} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
            }
        });
    });
});