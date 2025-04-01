import { fileURLToPath } from "url";
import { dirname, join } from "path";
import path from 'path';
import express from "express";
import dotenv from "dotenv";
import morgan from 'morgan';
import session from "express-session";
import MySQLStore from "express-mysql-session";
import { pool } from './models/db.js'; // Importa la conexión a la base de datos



// Cargar variables de entorno
dotenv.config();


// Obtener __dirname  obtener el directorio actual del archivo en Node.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express()





// Archivos estáticos
app.use(express.static(join(__dirname, "public")));
console.log("Ruta de archivos estáticos:", join(__dirname, "public"));


// Archivos estáticos de la carpeta "upload"
app.use('/upload', express.static(path.join(process.cwd(), 'upload')));
console.log("Ruta pública para archivos de upload:", path.join(process.cwd(), 'upload'));




app.set("port", process.env.PORT || 3000);
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");



// Configuración de la tienda de sesiones
const sessionStore = new (MySQLStore(session))({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
}, pool);



// Middleware de sesión
const sessionMiddleware = session({
  key: "session_cookie_name", // Nombre de la cookie de sesión
  secret: process.env.SECRET_SESSION_KEY || "fallback_secret",
  store: sessionStore, // Almacena sesiones en MySQL
  resave: false, // No guardar sesión si no hay cambios
  saveUninitialized: false, // No guardar sesiones vacías
  cookie: {
      httpOnly: true, // Protege contra ataques XSS
      secure: false, // Cambia a `true` si usas HTTPS
      sameSite: "strict", // Protección CSRF
      maxAge: 1000 * 60 * 60 * 24 // Expira en 24 horas
  }
});


// Middlewares generales
app.use(morgan("dev")); // Registro de solicitudes
app.use(express.urlencoded({ extended: true })); // Parsear formularios
app.use(express.json()); // Parsear JSON
app.use(sessionMiddleware); // Middleware de sesión




// Importar y configurar rutas
import seleccionarEmpleado  from './routes/modulos/incapacidades/seleccionar-empleado.routes.js'
import detalleIncapacidadEmpleado  from './routes/modulos/incapacidades/detalle-incapacidad.routes.js'
import  registroNuevaIncapacidad from './routes/modulos/incapacidades/registro-nueva-incapacidad.routes.js'
import  tablaIncapacidades from './routes/modulos/incapacidades/tabla-incapacidades.routes.js'
import  appi_Cie10 from './routes/modulos/incapacidades/appi-cie-10.routes.js'
import  ventanaIncapacidadRecibida from './routes/modulos/incapacidades/ventana_confirmacion_incapacidad_recibida.routes.js'


// Usar rutas
app.use(seleccionarEmpleado)
app.use(detalleIncapacidadEmpleado)
app.use(registroNuevaIncapacidad)
app.use(tablaIncapacidades)
app.use(appi_Cie10)
app.use(ventanaIncapacidadRecibida)




// Iniciar el servidor
app.listen(app.get("port"), '0.0.0.0', () => {
  console.log(`Server listening on port ${app.get("port")}`);
});