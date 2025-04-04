document.addEventListener("DOMContentLoaded", function () {

    let tipo_incapacidad = document.getElementById("tipo_incapacidad");
    let dias_incapacidad = document.getElementById("cantidad_dias");
    let container_files = document.getElementById("container_files_incapacidad");
    let file_incapacidad = document.getElementById("file_incapacidad");
    let file_historia_clinica = document.getElementById("file_historia_clinica");
    let file_cedula = document.getElementById("file_cedula");
    let file_soat = document.getElementById("file_soat");
    let file_licencia_conduccion = document.getElementById("file_licencia_conduccion");
    let file_tecnico_mecanica = document.getElementById("file_tecnico_mecanica");
    let file_Formulario_furips = document.getElementById("file_Formulario_furips");
    let line_files = document.getElementById("line_files");
    let enfermedad_general = document.getElementById("enfermedad_general")
    let accidente_laboral_transito = document.getElementById("accidente_laboral_transito")
    

    // Función que oculta todos los archivos antes de aplicar las reglas
    function ocultarArchivos() {
        line_files.classList.add("hidden");
        container_files.classList.add("hidden");
        file_incapacidad.classList.add("hidden");
        file_historia_clinica.classList.add("hidden");
        file_cedula.classList.add("hidden");
        file_soat.classList.add("hidden");
        file_licencia_conduccion.classList.add("hidden");
        file_tecnico_mecanica.classList.add("hidden");
        file_Formulario_furips.classList.add("hidden");
    }



    // Función para EPS con menos de 4 días
    function incapacidad_tipo_1() {
        let EPS = tipo_incapacidad.value === "EPS";
        let dias = parseInt(dias_incapacidad.value);

        if (EPS && dias < 4) {
            line_files.classList.remove("hidden");
            container_files.classList.remove("hidden");
            file_incapacidad.classList.remove("hidden");
        }
    }


    // Función para EPS con 4 o más días
    function incapacidad_tipo_2() {
        let EPS = tipo_incapacidad.value === "EPS";
        let dias = parseInt(dias_incapacidad.value); 

        if (EPS && dias >= 4) {
            line_files.classList.remove("hidden");
            container_files.classList.remove("hidden");
            file_incapacidad.classList.remove("hidden");
            file_historia_clinica.classList.remove("hidden");
        }
    }



    /* Funcion para EPS licencias de maternidad y paternidad */
    function incapacidad_tipo_3(){
        let EPS = tipo_incapacidad.value === "EPS";
        let licencia = enfermedad_general.value === "LICENCIA DE PATERNIDAD" || enfermedad_general.value === "LICENCIA DE MATERNIDAD"
        
        
        if (EPS && licencia){
            line_files.classList.remove("hidden");
            container_files.classList.remove("hidden");
            file_incapacidad.classList.remove("hidden");
            file_historia_clinica.classList.remove("hidden");
            file_cedula.classList.remove("hidden")
        }

    }



    /* Funcion para ARL Accidente laboral  */
    function incapacidad_tipo_4(){
        let ARL = tipo_incapacidad.value === "ARL";
        let accidente_laboral = accidente_laboral_transito.value === "ORIGEN COMUN";

        if (ARL && accidente_laboral){
            line_files.classList.remove("hidden");
            container_files.classList.remove("hidden");
            file_incapacidad.classList.remove("hidden");
            file_historia_clinica.classList.remove("hidden");
            file_cedula.classList.remove("hidden")
            file_Formulario_furips.classList.remove("hidden")
        }
    }


    /* Funcion para ARL Accidente laboral  */
    function incapacidad_tipo_5(){
        let ARL = tipo_incapacidad.value === "ARL";
        let accidente_laboral = accidente_laboral_transito.value === "ACCIDENTE DE TRANSITO";

        if (ARL && accidente_laboral){
            line_files.classList.remove("hidden");
            container_files.classList.remove("hidden");
            file_incapacidad.classList.remove("hidden");
            file_historia_clinica.classList.remove("hidden");
            file_cedula.classList.remove("hidden")
            file_soat.classList.remove("hidden")
            file_licencia_conduccion.classList.remove("hidden")
            file_tecnico_mecanica.classList.remove("hidden")

            file_Formulario_furips.classList.remove("hidden")
        }
    }




   
    // Función principal que actualiza la visibilidad sin sobreescribir
    function actualizarVisibilidad() {
        ocultarArchivos(); // Primero, oculta todo
        incapacidad_tipo_1();
        incapacidad_tipo_2();
        incapacidad_tipo_3();
        incapacidad_tipo_4();
        incapacidad_tipo_5();
    }



    // Eventos que disparan la validación
    tipo_incapacidad.addEventListener("change", actualizarVisibilidad);
    dias_incapacidad.addEventListener("input", actualizarVisibilidad);
    enfermedad_general.addEventListener("change", actualizarVisibilidad);
    accidente_laboral_transito.addEventListener("change", actualizarVisibilidad);

});


