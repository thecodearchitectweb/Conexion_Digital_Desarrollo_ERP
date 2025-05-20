document.addEventListener("DOMContentLoaded", function () {

    // Mensaje de que el DOM está completamente cargado
    console.log("🟢 DOMContentLoaded: Iniciando script para crear nuevo usuario")

    /* obtenemos el formulario para la creación del nuevo usuario y el botón de envío */
    const form_usuario = document.getElementById('form_crear_nuevo_usuario')
    const button_usuario = document.getElementById('button_create_usuario')

    /* escuchar el envío del form */
    form_usuario.addEventListener('submit', async (e) => {
        e.preventDefault() // Previene que el formulario se envíe normalmente
        console.log("🔄 Form submit capturado. Iniciando procesamiento...");

        button_usuario.disabled = true // Deshabilita el botón para evitar envíos múltiples

        /* capturamos los valores del formulario */
        const nombre = document.getElementById('nombre').value.trim()
        const documento = document.getElementById('documento').value.trim()
        const estado = document.getElementById('estado').value
        const fecha_nacimiento = document.getElementById('fecha_nacimiento').value
        const correo = document.getElementById('correo').value.trim()
        const contacto = document.getElementById('contacto').value.trim()
        const direccion = document.getElementById('direccion').value.trim()
        const area = document.getElementById('area').value
        const cargo = document.getElementById('cargo').value
        const lider_directo = document.getElementById('lider_directo').value
        const rol = document.getElementById('rol').value
        const usuario = document.getElementById('usuario').value.trim()
        const contraseña = document.getElementById('contraseña').value
        const contraseña_2 = document.getElementById('contraseña_2').value

        /* validación de campos obligatorios */
        const requiredFields = [
            "nombre", "documento", "estado", "fecha_nacimiento",
            "correo", "contacto", "direccion", "area",
            "cargo", "lider_directo", "rol", "usuario", "contraseña", "contraseña_2"
        ]

        let isValid = true;
        requiredFields.forEach((fieldId) => {
            const field = document.getElementById(fieldId)
            if (field && !field.value.trim()) {
                field.classList.add("border-b-4", "border-b-red-600")
                isValid = false
            } else if (field) {
                field.classList.remove("border-b-4", "border-b-red-600")
            }
            field.addEventListener("input", () => {
                field.classList.remove("border-t", "border-red-600", "border-b-4", "border-b-red-600")
            })
        })

        if (!isValid) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos obligatorios.',
                confirmButtonColor: '#ffc107'
            })
            button_usuario.disabled = false
            return
        }


        /* Verificar que las contraseñas coincidan */
        if (contraseña !== contraseña_2) {
            Swal.fire({
                icon: 'error',
                title: 'Contraseñas no coinciden',
                text: 'Por favor asegúrate de que las contraseñas coincidan.',
                confirmButtonColor: '#dc3545'
            })
            button_usuario.disabled = false
            return
        }


        /* Llamada a la API para crear el nuevo usuario */
        try {
            const payload = {
                nombre,
                documento,
                estado,
                fecha_nacimiento,
                correo,
                contacto,
                direccion,
                area,
                cargo,
                lider_directo,
                rol,
                usuario,
                contraseña
            }

            console.log("🚀 Enviando datos al servidor:", payload)


            const response = await fetch('/new/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })


            /* validacion */
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Error al crear el usuario')
            }


            /* resultado ok */
            const result = await response.json()
            console.log("✅ Usuario creado exitosamente:", result)

            Swal.fire({
                icon: 'success',
                title: 'Usuario creado',
                text: `El usuario ${result.usuario} ha sido creado con éxito.`, 
                confirmButtonColor: '#28a745'
            })

            /* Opcional: reiniciar formulario o redirigir */
            form_usuario.reset()

        } catch (error) {
            console.error("❌ Error en la petición:", error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                confirmButtonColor: '#dc3545'
            })
        } finally {
            button_usuario.disabled = false
        }

    })

})
