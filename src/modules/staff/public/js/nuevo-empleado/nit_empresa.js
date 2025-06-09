
  const empresaSelect = document.getElementById('empresa');
  const nitInput = document.getElementById('nit');

  const empresaNIT = {
    "Conexion Digital": "900548646",
    "Speed Networks": "901491508"
  };

  empresaSelect.addEventListener('change', () => {
    const empresa = empresaSelect.value;
    nitInput.value = empresaNIT[empresa] || '';
  });
