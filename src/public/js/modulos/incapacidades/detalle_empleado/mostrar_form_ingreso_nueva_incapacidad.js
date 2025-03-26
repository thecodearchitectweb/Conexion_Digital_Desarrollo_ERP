document.addEventListener("DOMContentLoaded", function () {
    // Elementos de selección principales
    const tipoIncapacidad = document.getElementById("tipo_incapacidad");
    const enfermedadGeneral = document.getElementById("enfermedad_general");
    const accidenteTransito = document.getElementById("accidente_laboral_transito");

    // Contenedores que deben mostrarse según selección
    const enfermedadGeneralContainer = document.getElementById("enfermedad_general_container");
    const accidenteTransitoContainer = document.getElementById("accidente_transito_container");

    // Contenedor del formulario que debe ocultarse inicialmente
    const formIncapacidad = document.getElementById("form_ingreso_nueva_incapacidad");

    // Ocultar el formulario al inicio
    formIncapacidad.classList.add("hidden");

    // Función para verificar si al menos 2 campos están llenos
    function verificarCamposLlenos() {
        let camposLlenos = 0;

        // Verifica si el campo "Tipo de incapacidad" tiene un valor seleccionado
        if (tipoIncapacidad.value !== "Seleccione el tipo de incapacidad") {
            camposLlenos++;

            // Muestra u oculta los contenedores según la selección
            if (tipoIncapacidad.value === "EPS") {
                enfermedadGeneralContainer.classList.remove("hidden");
                accidenteTransitoContainer.classList.add("hidden");
            } else if (tipoIncapacidad.value === "ARL") {
                accidenteTransitoContainer.classList.remove("hidden");
                enfermedadGeneralContainer.classList.add("hidden");
            }
        }

        // Verifica si los subcampos tienen un valor seleccionado
        if (enfermedadGeneral.value !== "Seleccione la Enfermedad General" && !enfermedadGeneralContainer.classList.contains("hidden")) {
            camposLlenos++;
        }
        if (accidenteTransito.value !== "Seleccione el Accidente de Trabajo" && !accidenteTransitoContainer.classList.contains("hidden")) {
            camposLlenos++;
        }

        // Mostrar el formulario solo si al menos dos campos están llenos
        if (camposLlenos >= 2) {
            formIncapacidad.classList.remove("hidden");
        } else {
            formIncapacidad.classList.add("hidden");
        }
    }

    // Eventos para verificar cambios en los select
    tipoIncapacidad.addEventListener("change", verificarCamposLlenos);
    enfermedadGeneral.addEventListener("change", verificarCamposLlenos);
    accidenteTransito.addEventListener("change", verificarCamposLlenos);
});
