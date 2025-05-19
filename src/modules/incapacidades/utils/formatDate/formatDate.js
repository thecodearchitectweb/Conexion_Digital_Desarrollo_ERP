import { parse, format, isValid } from "date-fns";


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



/* FORMATEAR FECHA "31-07-2025" a "2025-07-31" */
export function convertirFecha(fechaTexto) {
    try {
        const fecha = parse(fechaTexto, "dd-MM-yyyy", new Date());
        if (!isValid(fecha)) throw new Error("Fecha inválida");
        return format(fecha, "yyyy-MM-dd");
    } catch (error) {
        return "Fecha inválida";
    }
}
