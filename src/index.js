import { fileURLToPath } from "url";
import { dirname, join } from "path";
import path from 'path';
import express from "express";
import dotenv from "dotenv";
import morgan from 'morgan';
import session from "express-session";
import MySQLStore from "express-mysql-session";
import { pool } from './models/db.js'; // Importa la conexión a la base de datos
//import { secureHeaders } from '../src/modules/global/middlewares/login/security.js'
//import { sessionRequired } from '../src/modules/global/middlewares/login/autenticacion.js'

import  rutasDeIncapacidades  from './modules/rutas/rutas-incapacidades/incapacidades_index.routes.js'

import rutasDeLogin from './modules/rutas/rutas-login/rutas_login.routes.js'
import rutasDeUsers from './modules/rutas/rutas-users/rutas_users.routes.js'
import rutasDeModulos from './modules/rutas/rutas-modulos/rutas-modulos.routes.js'


// Cargar variables de entorno
dotenv.config();


// Obtener __dirname  obtener el directorio actual del archivo en Node.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express()



// Middleware global
//app.use(secureHeaders); // aplica helmet a todas las rutas


// Archivos estáticos
app.use(express.static(join(__dirname, "public")));
console.log("Ruta de archivos estáticos:", join(__dirname, "public"));


app.use("/incapacidades",  express.static(join(__dirname, "modules", "incapacidades", "public")));
app.use("/global",  express.static(join(__dirname, "modules", "global", "public")));




// Archivos estáticos de la carpeta "upload"
//app.use('/upload', express.static(path.join(process.cwd(), 'upload')));

app.use('/upload', express.static(path.join(process.env.UPLOAD_PATH)));
console.log("Ruta pública para archivos de upload:", path.join(process.cwd(), 'upload'));




app.set("port", process.env.PORT || 3000);



const viewDirectories = [
  join(__dirname, "modules", "incapacidades", "views", "views"),
  join(__dirname, "modules", "global",       "views", "views"),
];



app.set("views", viewDirectories);

console.log("Directorios de vistas configurados", viewDirectories)

app.set("view engine", "ejs");



// Configuración de la tienda de sesiones
const sessionStore = new (MySQLStore(session))({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  clearExpired: true, // ✅ limpia automáticamente sesiones expiradas
  checkExpirationInterval: 900000 // ✅ cada 15 minutos
}, pool);



// Middleware de sesión
const sessionMiddleware = session({
  key: "session_cookie_name", // Nombre de la cookie de sesión
  secret: process.env.SECRET_SESSION_KEY || "fallback_secret",
  store: sessionStore, // Almacena sesiones en MySQL
  resave: false, // No guardar sesión si no hay cambios
  saveUninitialized: false, // No guardar sesiones vacías
  rolling: true,
  cookie: {
      httpOnly: true, // Protege contra ataques XSS
      secure: false, // Cambia a `true` si usas HTTPS
      sameSite: "strict", // Protección CSRF
      maxAge:  1000 * 60 * 30 // Expira en 24 horas
  }
});



// Middlewares generales
app.use(morgan("dev")); // Registro de solicitudes
app.use(express.urlencoded({ extended: true })); // Parsear formularios
app.use(express.json()); // Parsear JSON
app.use(sessionMiddleware); // Middleware de sesión



/* TRAER DATOS CORRESPONDIENTE DEL USUARIO */
// Middleware para pasar los datos de sesión a las vistas
app.use((req, res, next) => {
  res.locals.user = req.session && req.session.user ? req.session.user : null
  next()
})


// Importar y configurar rutas

// Usar rutas

const todasLasRutas = [
  ...rutasDeIncapacidades,
  ...rutasDeLogin,
  ...rutasDeUsers,
  ...rutasDeModulos
];

//[...rutasDeIncapacidades].forEach(route => app.use(route));

todasLasRutas.forEach(route => app.use(route));



// Iniciar el servidor
app.listen(app.get("port"), '0.0.0.0', () => {
  console.log(`Server listening on port ${app.get("port")}`);
});