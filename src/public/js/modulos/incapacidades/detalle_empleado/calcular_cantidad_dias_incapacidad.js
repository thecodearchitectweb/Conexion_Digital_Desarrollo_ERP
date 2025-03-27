document.addEventListener("DOMContentLoaded", function () {
    // Seleccionamos los elementos de fecha y cantidad de días
    const fechaInicio = document.getElementById("fecha_inicio_incapacidad");
    const fechaFinal = document.getElementById("fecha_final_incapacidad");
    const cantidadDias = document.getElementById("cantidad_dias");

    function calcularDias() {
        const inicio = new Date(fechaInicio.value);
        const final = new Date(fechaFinal.value);

        if (!isNaN(inicio) && !isNaN(final)) {
            // Verificamos que la fecha de inicio sea menor o igual a la fecha final
            if (inicio > final) {
                alert("Error: La fecha de inicio no puede ser mayor que la fecha final.");
                fechaInicio.value = "";
                fechaFinal.value = "";
                cantidadDias.setAttribute("value", "");
                cantidadDias.value = "";
                return; // Detenemos la ejecución si hay un error
            }

            const diferenciaTiempo = final - inicio;
            const diferenciaDias = diferenciaTiempo / (1000 * 60 * 60 * 24) + 1; // Se suma 1 para incluir el primer día

            if (diferenciaDias > 0) {
                cantidadDias.setAttribute("value", diferenciaDias);
                cantidadDias.value = diferenciaDias; // También actualiza el campo visualmente
            } else {
                cantidadDias.setAttribute("value", "0");
                cantidadDias.value = "0";
            }

            // Dispara el evento "input" para que el otro script lo detecte
            cantidadDias.dispatchEvent(new Event("input"));
        } else {
            cantidadDias.setAttribute("value", "");
            cantidadDias.value = "";
        }
    }

    // Escuchar cambios en las fechas para recalcular los días
    fechaInicio.addEventListener("change", calcularDias);
    fechaFinal.addEventListener("change", calcularDias);
});