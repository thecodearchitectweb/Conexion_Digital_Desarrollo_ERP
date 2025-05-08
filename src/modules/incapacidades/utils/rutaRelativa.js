// utils/rutaRelativa.js
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getRutaRelativa(file) {
  const uploadPath = process.env.UPLOAD_PATH;

  if (!uploadPath) {
    throw new Error('UPLOAD_PATH no está definido en las variables de entorno.');
  }

  const rutaRelativa = path.join(
    file.destination.replace(uploadPath, ''),
    file.filename
  );

  return rutaRelativa;
}
