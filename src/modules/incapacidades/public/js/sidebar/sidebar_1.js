
// Seleccionamos elementos
const menusItemsDropDown = document.querySelectorAll('.menu-item-dropdown');
const menusItemsStatic = document.querySelectorAll('.menu-item-static');
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menu-btn');
const sidebarBtn = document.getElementById('sidebar-btn'); // Si usas otro botón para mostrar/ocultar en mobile
const container = document.getElementById('container_seleccionar_empleado');

// Si tienes un botón específico para mobile, mantenlo. Sino, ignóralo:
if (sidebarBtn) {
  sidebarBtn.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-hidden');
  });
}

// Toggle de minimización de la sidebar
menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('minimize');
  
  // Actualizamos el contenedor según el estado de la sidebar
  if (sidebar.classList.contains('minimize')) {
    // Sidebar minimizada: contenedor se expande
    container.classList.remove('container-collapsed');
    container.classList.add('container-expanded');
  } else {
    // Sidebar expandida: contenedor deja espacio
    container.classList.remove('container-expanded');
    container.classList.add('container-collapsed');
  }
});

// Dropdown de items en la sidebar
menusItemsDropDown.forEach((menuItem) => {
  menuItem.addEventListener('click', () => {
    const subMenu = menuItem.querySelector('.sub-menu');
    const isActive = menuItem.classList.toggle('sub-menu-toggle');
    if (subMenu) {
      if (isActive) {
        subMenu.style.height = `${subMenu.scrollHeight + 6}px`;
        subMenu.style.padding = '0.2rem 0';
      } else {
        subMenu.style.height = '0';
        subMenu.style.padding = '0';
      }
    }
    // Cerrar otros dropdowns
    menusItemsDropDown.forEach((item) => {
      if (item !== menuItem) {
        const otherSubmenu = item.querySelector('.sub-menu');
        if (otherSubmenu) {
          item.classList.remove('sub-menu-toggle');
          otherSubmenu.style.height = '0';
          otherSubmenu.style.padding = '0';
        }
      }
    });
  });
});

// Para items estáticos, si la sidebar está minimizada, se cierra el dropdown
menusItemsStatic.forEach((menuItem) => {
  menuItem.addEventListener('mouseenter', () => {
    if (!sidebar.classList.contains('minimize')) return;
    menusItemsDropDown.forEach((item) => {
      const otherSubmenu = item.querySelector('.sub-menu');
      if (otherSubmenu) {
        item.classList.remove('sub-menu-toggle');
        otherSubmenu.style.height = '0';
        otherSubmenu.style.padding = '0';
      }
    });
  });
});

// Función para ajustar la sidebar al cambiar el tamaño de la ventana (opcional)
function checkWindowsSize() {
  sidebar.classList.remove('minimize');
  // También, restablecemos las clases del contenedor para la vista expandida
  container.classList.remove('container-expanded', 'container-collapsed');
  container.classList.add('container-collapsed');
}
checkWindowsSize();
window.addEventListener('resize', checkWindowsSize);
