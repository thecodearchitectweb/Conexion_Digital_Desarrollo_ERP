import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

import {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
} from "./config.js";

// Imprimir las variables de entorno para verificar que se carguen correctamente
console.log('DB_HOST:', DB_HOST);
console.log('DB_PORT:', DB_PORT);
console.log('DB_USER:', DB_USER);
console.log('DB_PASSWORD:', DB_PASSWORD);
console.log('DB_DATABASE:', DB_DATABASE);



export const pool = createPool({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
});


// Verificar si la conexión se estableció correctamente
pool
  .getConnection()
  .then((connection) => {
    console.log("Connected to database!");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });


  export default pool;