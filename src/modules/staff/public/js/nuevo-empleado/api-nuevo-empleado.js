document.addEventListener("DOMContentLoaded", function () {

    // Mensaje de que el DOM está completamente cargado
    console.log("🟢 DOMContentLoaded: Iniciando script de registro nuevo empleado");

    /* OBTENEMOS EL FORMULARIO PARA EL INGRESO A LA SESION */
    const form_registro = document.getElementById('form_registrar_nuevo_empleado')
    const button_registro = document.getElementById('button_registro')


    /* ESCUCHAR EL ENVIO DEL FORM */
    form_registro.addEventListener('submit', async (e) => {

        e.preventDefault() //PREVENIR QUE EL FORMULARIO SE ENVIE NORMALMENTE 

        console.log("🔄 Form submit capturado. Iniciando procesamiento...");


        /* CAPTURAMOS LOS VALORES DEL FORMULARIO */
        const nombre = document.getElementById('nombre').value
        const apellidos = document.getElementById('apellidos').value
        const documento = document.getElementById('documento').value
        const fecha_contratacion = document.getElementById('fecha_contratacion').value
        const tipo_contrato = document.getElementById('tipo_contrato').value
        const cargo = document.getElementById('cargo').value
        const estado = document.getElementById('estado').value
        const lider_directo = document.getElementById('lider_directo').value
        const salario = document.getElementById('salario').value
        const valor_dia = document.getElementById('valor_dia').value
        const contacto = document.getElementById('contacto').value
        const email = document.getElementById('email').value
        const area = document.getElementById('area').value
        const empresa = document.getElementById('empresa').value
        const nit = document.getElementById('nit').value
        const eps = document.getElementById('eps').value
        const arl = document.getElementById('arl').value
        const fondo_pensiones = document.getElementById('fondo_pensiones').value
        const caja_compensacion = document.getElementById('caja_compensacion').value


        /* VALIDACION DE CAMPOS OBLIDATORIOS */
        const requiredFields = [
            "nombre",
            "apellidos",
            "documento",
            "fecha_contratacion",
            "tipo_contrato",
            "cargo",
            "estado",
            "lider_directo",
            "salario",
            "valor_dia",
            "contacto",
            "email",
            "area",
            "empresa",
            "nit",
            "eps",
            "arl",
            "fondo_pensiones",
            "caja_compensacion"
        ]


        /* BORDES ROJOS EN CASO DE QUE FALTEN DATOS */
        let isValid = true;
        requiredFields.forEach((fieldId) => {
            const field = document.getElementById(fieldId)
            if (field && !field.value.trim()) {
                field.classList.add("border-b-4", "border-b-red-700", "border-t-red-700", "border-x-red-700")
                isValid = false
            } else if (field) {
                field.classList.remove("border-b-4", "border-b-red-700", "border-t-red-700", "border-x-red-700")
            }
            field.addEventListener("input", () => {
                field.classList.remove("border-b-4", "border-b-red-700", "border-t-red-700", "border-x-red-700")
            })
        })


        /* VALIDACION DE CAMPOS */
        if (!isValid) {
            console.log("CAMPOS INCOMPLETOS");
            return; // <— evita continuar
        }



        try {

            /* CREAMOS EL OBJETO  */
            const payload = {
                nombre,
                apellidos,
                documento,
                fecha_contratacion,
                tipo_contrato,
                cargo,
                estado,
                lider_directo,
                salario,
                valor_dia,
                contacto,
                email,
                area,
                empresa,
                nit,
                eps,
                arl,
                fondo_pensiones,
                caja_compensacion
            }


            /*  */
            const response = await fetch('/Staff/api/registro/nuevo/empleado', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                credentials: "include"
            })


            /* VALIDACION DEL SERVIDOR */
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Error al registrar empleado')
            }


            /* RESULTADO OK */
            const result = await response.json()
            console.log("✅ Ingreso exitodo:", result)


        } catch (error) {

        }



    })




})