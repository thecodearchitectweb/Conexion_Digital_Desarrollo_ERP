
  document.getElementById("filtro").addEventListener("change", function () {
    let input = document.getElementById("busqueda");
    input.classList.remove("hidden"); // Mostrar el input

    if (this.value === "cedula" || this.value === "contacto") {
      input.type = "text";
      input.inputMode = "numeric";
      input.pattern = "[0-9]+";
      input.placeholder = "Ingrese solo números";
      input.oninput = function () {
        this.value = this.value.replace(/\D/g, ""); // Elimina cualquier caracter que no sea número
      };
    } else if (this.value === "nombres" || this.value === "apellidos") {
      input.type = "text";
      input.inputMode = "text";
      input.pattern = "[A-Za-z ]+";
      input.placeholder = "Ingrese solo letras";
      input.oninput = function () {
        this.value = this.value.replace(/[^A-Za-z ]/g, ""); // Elimina cualquier número o carácter especial
      };
    } else {
      input.classList.add("hidden"); // Ocultar si no se selecciona nada
    }
  });

