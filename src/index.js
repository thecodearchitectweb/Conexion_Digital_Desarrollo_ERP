import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express from "express";


// Obtener __dirname  obtener el directorio actual del archivo en Node.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express()

// Archivos estáticos
app.use(express.static(join(__dirname, "public")));
console.log("Ruta de archivos estáticos:", join(__dirname, "public"));



app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");


// Middlewares generales
app.use(express.json()); // Parsear JSON


// Importar y configurar rutas
import seleccionarEmpleado  from './routes/modulos/incapacidades/seleccionar-empleado.routes.js'
import detalleIncapacidadEmpleado  from './routes/modulos/incapacidades/detalle-incapacidad.routes.js'
import  registroNuevaIncapacidad from './routes/modulos/incapacidades/registro-nueva-incapacidad.routes.js'
import  tablaIncapacidades from './routes/modulos/incapacidades/tabla-incapacidades.routes.js'


// Usar rutas
app.use(seleccionarEmpleado)
app.use(detalleIncapacidadEmpleado)
app.use(registroNuevaIncapacidad)
app.use(tablaIncapacidades)




app.listen(4000, () => {
    console.log("Servidor corriendo en http://localhost:4000");
  });