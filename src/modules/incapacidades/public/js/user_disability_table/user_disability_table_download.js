// Este script debe estar cargado después de que el DOM esté listo
function abrirModal(element) {
    const datos = element.dataset;
  
    // Mapea los IDs del HTML con las keys del dataset
    const campos = {
      'modal-id-liquidacion': datos.idLiquidacion,
      'modal-id-historial': datos.idHistorial,
      'modal-creador': datos.creador,
      'modal-nombres': datos.nombres,
      'modal-apellidos': datos.apellidos,
      'modal-documento': datos.documento,
      'modal-contacto': datos.contacto,
      'modal-salario': datos.salario,
      'modal-valor-dia': datos.valorDia,
      'modal-fecha-contratacion': datos.fechaContratacion,
      'modal-cargo': datos.cargo,
      'modal-lider': datos.lider,
      'modal-registro-incapacidad': datos.registroIncapacidad,
      'modal-tipo-incapacidad': datos.tipoIncapacidad,
      'modal-subtipo-incapacidad': datos.subtipoIncapacidad,
      'modal-inicio-incapacidad': datos.inicioIncapacidad,
      'modal-final-incapacidad': datos.finalIncapacidad,
      'modal-n-dias': datos.nDias,
      'modal-codigo-categoria': datos.codigoCategoria,
      'modal-des-categoria': datos.desCategoria,
      'modal-codigo-subcategoria': datos.codigoSubcategoria,
      'modal-des-subcategoria': datos.desSubcategoria,
      'modal-prorroga': datos.prorroga,
      'modal-estado': datos.estado,
    };
  
    console.log("Datos recibidos en el modal:", datos);
  
    // Recorremos cada campo y lo insertamos si existe en el DOM
    for (const id in campos) {
      const valor = campos[id] || '(Sin dato)';
      const elemento = document.getElementById(id);
  
      if (elemento) {
        elemento.innerText = valor;
      } else {
        console.warn(`[Modal] No se encontró el elemento con ID '${id}'`);
      }
    }
  }
  
  console.log("Datos recibidos en el modal:", datos);
  