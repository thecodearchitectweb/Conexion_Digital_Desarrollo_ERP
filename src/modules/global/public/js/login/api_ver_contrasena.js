
    // Esperamos que el DOM ya esté cargado si el script va en <head>, si está después basta:
    document.addEventListener('DOMContentLoaded', () => {
      const pwdInput = document.getElementById('input_password');
      const toggleIcon = document.getElementById('togglePassword');

      toggleIcon.addEventListener('click', () => {
        // Alternar tipo
        const isPassword = pwdInput.getAttribute('type') === 'password';
        pwdInput.setAttribute('type', isPassword ? 'text' : 'password');

        // Cambiar icono
        toggleIcon.classList.toggle('bx-show-alt', !isPassword);
        toggleIcon.classList.toggle('bx-hide-alt', isPassword);
      });
    });
