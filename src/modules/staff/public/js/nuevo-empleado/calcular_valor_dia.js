
  document.addEventListener('DOMContentLoaded', () => {
    const salarioInput = document.getElementById('salario');
    const valorDiaInput = document.getElementById('valor_dia');

    salarioInput.addEventListener('input', () => {
      // Obtén el valor numérico del salario
      const salario = parseFloat(salarioInput.value);
      if (!isNaN(salario)) {
        // Divide entre 30 y fija 2 decimales
        const valorDia = salario / 30;
        valorDiaInput.value = valorDia.toFixed(2);
      } else {
        // Si borran el salario, limpia el valor día
        valorDiaInput.value = '';
      }
    });
  });

