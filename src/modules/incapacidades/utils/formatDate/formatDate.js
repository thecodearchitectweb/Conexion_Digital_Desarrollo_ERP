import { format } from "date-fns";


/* FECHA FORMATEADA FECHA */
export function formatDate(fecha) {
    try {
        return fecha ? format(new Date(fecha), "dd/MM/yyyy") : "Fecha no disponible";
    } catch (error) {
        return "Fecha inválida";
    }
}


/* FECHA FORMATEADA FECHA */
export function formatDate2(fecha) {
    try {
        return fecha ? format(new Date(fecha), "yyyy/MM/dd") : "Fecha no disponible";
    } catch (error) {
        console.error("🔥 Error al formatear la fecha:", error);
        return "Fecha inválida";
    }
}



/* FECHA FORMATEADA FECHA Y HORA */
export function formatDateTime(fecha) {
    try {
        return fecha ? format(new Date(fecha), "dd/MM/yyyy HH:mm:ss") : "Fecha y hora no disponibles";
    } catch (error) {
        return "Fecha y hora inválidas";
    }
}

