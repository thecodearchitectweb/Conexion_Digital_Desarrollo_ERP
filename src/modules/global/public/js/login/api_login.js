document.addEventListener("DOMContentLoaded", function () {


    // Mensaje de que el DOM está completamente cargado
    console.log("🟢 DOMContentLoaded: Iniciando script para iniciar sesion")

    /* OBTENEMOS EL FORMULARIO PARA EL INGRESO A LA SESION */
    const form_login = document.getElementById('form_login')
    const button_login = document.getElementById('button_login')


    /* ESCUCHAR EL ENVIO DEL FORM */
    form_login.addEventListener('submit', async (e) => {

        e.preventDefault() //PREVENIR QUE EL FORMULARIO SE ENVIE NORMALMENTE 

        console.log("🔄 Form submit capturado. Iniciando procesamiento...");

        button_login.disabled = true //Desabilitar el boton para envio multiples de solicitudes


        /* CAPTURAMOS LOS VALORES DEL FORMULARIO */
        const usuario = document.getElementById('input_usuario').value
        const contraseña = document.getElementById('input_password').value


        /* VALIDACION DE CAMPOS OBLIDATORIOS */
        const requiredFields = [
            "input_usuario",
            "input_password"
        ]


        let isValid = true;
        requiredFields.forEach((fieldId) => {
            const field = document.getElementById(fieldId)
            if (field && !field.value.trim()) {
                field.classList.add("border-b-4", "border-b-red-700")
                isValid = false
            } else if (field) {
                field.classList.remove("border-b-4", "border-b-red-700")
            }
            field.addEventListener("input", () => {
                field.classList.remove("border-t", "border-red-600", "border-b-4", "border-b-red-600")
            })
        })



        if (!isValid) {
            console.log("CAMPOS INCOMPLETOS")
        }

        try {

            /* CREAMOS EL OBJETO */
            const payload = {
                usuario,
                contraseña
            }

            //console.log("🚀 Enviando datos al servidor:", payload)

            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                credentials: "include"
            })


            /* validacion */
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Error al iniciar sesion')
            }

            /* resultado ok */
            const result = await response.json()
            console.log("✅ Ingreso exitodo:", result)

            // ✅ Redirección tras login exitoso
            window.location.href = "/incapacidad/seleccionar/empleado";



        } catch (error) {
            console.error("❌ Error en la petición:", error)
        } finally {
             button_usuario.disabled = false
        }


    })


})