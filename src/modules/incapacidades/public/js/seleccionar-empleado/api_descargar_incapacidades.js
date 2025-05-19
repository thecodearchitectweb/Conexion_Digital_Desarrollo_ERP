document.addEventListener("DOMContentLoaded", function () {
    console.log("🟢 DOMContentLoaded: Iniciando script de descarga de incapacidades");

    const btnDownload = document.getElementById('buttonDownload');

    // Copiar ID de empleado al botón cuando abres la modal
    document.querySelectorAll(".btnDownloadIncapacidades").forEach(link => {
        link.addEventListener("click", function () {
            const idEmpleado = this.getAttribute("data-id");
            console.log("ID seleccionado:", idEmpleado);
            btnDownload.setAttribute("data-id-empleado", idEmpleado);
        });
    });

    btnDownload.addEventListener('click', async function (event) {
        event.preventDefault();

        const fecha_inicio = document.getElementById('download_fecha_inicio').value;
        const fecha_final = document.getElementById('download_fecha_final').value;
        const id_empleado = this.getAttribute('data-id-empleado');

        console.log("Fecha inicio:", fecha_inicio, "Fecha final:", fecha_final, "ID empleado:", id_empleado);

        if (!fecha_inicio || !fecha_final || !id_empleado) {
            return Swal.fire({
                icon: "error",
                title: "Datos faltantes",
                text: "Ingresar fecha de Inicio, fecha Final y seleccionar empleado."
            });
        }

        try {
            const response = await fetch(`/api/download/libro/incapacidades/empleado`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fecha_inicio, fecha_final, id_empleado })
            });

            if (!response.ok) {
                // El servidor devolvió un error (p.ej. 404 o 500)
                const errText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errText}`);
            }

            // Aquí leemos el blob en lugar de JSON
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'incapacidades_empleado.xlsx';  // nombre del archivo
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            Swal.fire({
                icon: "success",
                title: "Descarga iniciada",
                text: "Tu archivo se está descargando."
            });
        } catch (error) {
            console.error("Error en la solicitud:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo descargar el archivo."
            });
        }
    });
});
