

import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { getEmpleadoById } from '../../../repositories/modulos/incapacidades/empleados.service.js';


/* RUTA DONDE SE GARDARAN LAS CARPETAS Y SUBCARPETAS CON SUS ARCHIVOS CORRESPONDIENTES */
const baseDir = path.join(process.cwd(), 'upload', 'empleados');



const storage = multer.diskStorage({

  destination: async (req, file, cb) => {
    try {

      // 🔹 1. Recuperar el ID del empleado desde la sesión
      const idEmpleado = req.session.id_empleado_consultado;

      if (!idEmpleado) {
        return cb(new Error('No se encontró el ID del empleado en la sesión'), null);
      }


      // 🔹 2. Buscar la cédula del empleado en la base de datos
      const empleado = await getEmpleadoById(idEmpleado);

      if (!empleado) {
        return cb(new Error('Empleado no encontrado en la base de datos'), null);
      }


      // Usamos la cédula para el path
      const cedula = empleado.documento;


      // 🔹 3. Construir la ruta de almacenamiento
      const tipoIncapacidad = req.body.select_tipo_incapacidad;
      const fechaInicio = req.body.input_fecha_inicio_incapacidad.replace(/-/g, '');
      const fechaFinal = req.body.input_fecha_final_incapacidad.replace(/-/g, '');
      const incapacidadFolder = `${tipoIncapacidad}_${fechaInicio}_${fechaFinal}`;
      const fullPath = path.join(baseDir, cedula.toString(), 'INCAPACIDAD', incapacidadFolder);


      // 🔹 4. Crear la carpeta si no existe
      fs.mkdir(fullPath, { recursive: true }, (err) => {
        if (err) {
          console.error('Error al crear carpeta:', err);
          return cb(err, fullPath);
        }
        cb(null, fullPath);
      });

    } catch (error) {
      console.error('Error en el middleware de Multer:', error);
      cb(error, null);
    }
  },

  filename: (req, file, cb) => {
    // Se obtiene el timestamp actual para garantizar unicidad
    const timestamp = Date.now();
    // Se extrae la extensión del archivo (por ejemplo, ".pdf")
    const ext = path.extname(file.originalname);
    // Se extrae el nombre base sin la extensión
    const nombreBase = path.basename(file.originalname, ext);
    // Se utiliza el nombre del campo del formulario para identificar el tipo de archivo
    const campo = file.fieldname; // Ejemplo: "input_file_historia_clinica"
    // Se genera el nombre final concatenando el campo, el nombre original y el timestamp
    const nombreArchivo = `${campo}_${nombreBase}_${timestamp}${ext}`;
    cb(null, nombreArchivo);
  }
  
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Solo se permiten archivos PDF'), false);
    }
    cb(null, true);
  }
});

export default upload;
