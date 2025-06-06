document.addEventListener("DOMContentLoaded", function () {
    console.log("🟢 DOMContentLoaded: Iniciando script de descarga de incapacidades");

    const btnDownload = document.getElementById('buttonDownload');


    btnDownload.addEventListener('click', async function (event) {
        event.preventDefault();

        const fecha_inicio = document.getElementById('download_fecha_inicio').value;
        const fecha_final = document.getElementById('download_fecha_final').value;
        
        console.log("Fecha inicio:", fecha_inicio, "Fecha final:", fecha_final);

        if (!fecha_inicio || !fecha_final) {
            return Swal.fire({
                icon: "error",
                title: "Datos faltantes",
                text: "Ingresar fecha de Inicio, fecha Final y seleccionar empleado."
            });
        }

        try {
            const response = await fetch(`#`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fecha_inicio, fecha_final })
            });

            if (!response.ok) {
                // El servidor devolvió un error (p.ej. 404 o 500)
                const errText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errText}`);
            }


            // Obtiene el nombre del archivo desde el encabezado 'Content-Disposition'
            const disposition = response.headers.get('Content-Disposition');
            let filename = 'reporte_incapacidades.xlsx'; // Valor por defecto

            if (disposition && disposition.includes('filename=')) {
                // Extrae el nombre del archivo y limpia comillas
                filename = disposition.split('filename=')[1].replace(/["']/g, '').trim();
            }

            // Crea un enlace temporal para descargar el archivo
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename; // Usa el nombre recibido del servidor
            document.body.appendChild(a);
            a.click(); // Inicia la descarga
            a.remove();
            window.URL.revokeObjectURL(url); // Libera memoria



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
