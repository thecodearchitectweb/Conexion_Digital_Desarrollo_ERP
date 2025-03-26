document.addEventListener("DOMContentLoaded", function () {
    let fechaInicioInput = document.getElementById("fecha_inicio_incapacidad");
    let fechaFinInput = document.getElementById("fecha_final_incapacidad");
    let cantidadDiasInput = document.getElementById("cantidad_dias");

    function calcularDiasIncapacidad() {
        let fechaInicio = new Date(fechaInicioInput.value.split('/').reverse().join('-'));
        let fechaFin = new Date(fechaFinInput.value.split('/').reverse().join('-'));

        if (!isNaN(fechaInicio) && !isNaN(fechaFin)) {
            let diferenciaMs = fechaFin - fechaInicio;
            let dias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir el primer día

            // Validaciones: No permitir negativos ni 0
            if (dias <= 0) {
                cantidadDiasInput.value = "";
                alert("⚠️ La fecha de finalización debe ser mayor o igual a la de inicio.");
            } else {
                console.log(cantidadDiasInput.value = dias)
            }
        }
    }

    // Eventos para calcular automáticamente
    fechaInicioInput.addEventListener("change", calcularDiasIncapacidad);
    fechaFinInput.addEventListener("change", calcularDiasIncapacidad);
});
