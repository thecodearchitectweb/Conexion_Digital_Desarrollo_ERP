import { pool } from "../../../../../models/db.js";


/* POLITICA GRUPO A */
export async function getPoliticaGrupoA(
    prorroga,
    dias_laborados_conversion,
    salario_conversion,
    liquidacion_dias,
    tipo_incapacidad,
    origen_incapacidad

) {
    try {
        const [rows] = await pool.query(
            `
            SELECT *
            FROM politicas_incapacidades
            WHERE
                TRIM(LOWER(prorroga))     = TRIM(LOWER(?))
                AND TRIM(LOWER(dias_laborados)) = TRIM(LOWER(?))
                AND TRIM(LOWER(salario))      = TRIM(LOWER(?))
                AND ? BETWEEN rango_minimo AND IFNULL(rango_maximo, 99999)
                AND TRIM(LOWER(tipo_incapacidad)) = TRIM(LOWER(?))
                AND TRIM(LOWER(origen)) = TRIM(LOWER(?))
            `,
            [
              
                prorroga,
                dias_laborados_conversion,
                salario_conversion,
                liquidacion_dias,
                tipo_incapacidad,
                origen_incapacidad
            ]
        );

        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error("Error al obtener la política de incapacidad:", error);
        throw error;
    }
}





/* POLITICA GRUPO B */
export async function getPoliticaGrupoB(
    prorroga,
    dias_laborados_conversion,
    salario_conversion,
    liquidacion_dias,
    tipo_incapacidad,
    origen_incapacidad

) {
    try {
        const [rows] = await pool.query(
            `
            SELECT *
            FROM 
                politicas_incapacidades
            WHERE
                TRIM(LOWER(prorroga))     = TRIM(LOWER(?))
                AND TRIM(LOWER(dias_laborados)) = TRIM(LOWER(?))
                AND TRIM(LOWER(salario))      = TRIM(LOWER(?))
                AND ? BETWEEN rango_minimo AND IFNULL(rango_maximo, 99999)
                AND TRIM(LOWER(tipo_incapacidad)) = TRIM(LOWER(?))
                AND TRIM(LOWER(origen)) = TRIM(LOWER(?))
            `,
            [
              
                prorroga,
                dias_laborados_conversion,
                salario_conversion,
                liquidacion_dias,
                tipo_incapacidad,
                origen_incapacidad
            ]
        );

        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error("Error al obtener la política de incapacidad:", error);
        throw error;
    }
}





/* POLITICA GRUPO C */
export async function getPoliticaGrupoC(
    prorroga,
    dias_laborados_conversion,
    salario_conversion,
    liquidacion_dias,
    tipo_incapacidad,
    origen_incapacidad

) {
    try {
        const [rows] = await pool.query(
            `
            SELECT *
            FROM 
                politicas_incapacidades
            WHERE
                TRIM(LOWER(prorroga))     = TRIM(LOWER(?))
                AND TRIM(LOWER(dias_laborados)) = TRIM(LOWER(?))
                AND TRIM(LOWER(salario))      = TRIM(LOWER(?))
                AND ? BETWEEN rango_minimo AND IFNULL(rango_maximo, 99999)
                AND TRIM(LOWER(tipo_incapacidad)) = TRIM(LOWER(?))
                AND TRIM(LOWER(origen)) = TRIM(LOWER(?))
            `,
            [
              
                prorroga,
                dias_laborados_conversion,
                salario_conversion,
                liquidacion_dias,
                tipo_incapacidad,
                origen_incapacidad
            ]
        );

        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error("Error al obtener la política de incapacidad:", error);
        throw error;
    }
}





/* POLITICA GRUPO D */
export async function getPoliticaGrupoD(
    prorroga,
    dias_laborados_conversion,
    salario_conversion,
    liquidacion_dias,
    tipo_incapacidad,
    origen_incapacidad

) {
    try {
        const [rows] = await pool.query(
            `
            SELECT *
            FROM 
                politicas_incapacidades
            WHERE
                TRIM(LOWER(prorroga))     = TRIM(LOWER(?))
                AND TRIM(LOWER(dias_laborados)) = TRIM(LOWER(?))
                AND TRIM(LOWER(salario))      = TRIM(LOWER(?))
                AND ? BETWEEN rango_minimo AND IFNULL(rango_maximo, 99999)
                AND TRIM(LOWER(tipo_incapacidad)) = TRIM(LOWER(?))
                AND TRIM(LOWER(origen)) = TRIM(LOWER(?))
            `,
            [
              
                prorroga,
                dias_laborados_conversion,
                salario_conversion,
                liquidacion_dias,
                tipo_incapacidad,
                origen_incapacidad
            ]
        );

        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error("Error al obtener la política de incapacidad:", error);
        throw error;
    }
}





/* POLITICA GRUPO E */
export async function getPoliticaGrupoE(
    prorroga,
    dias_laborados_conversion,
    salario_conversion,
    liquidacion_dias,
    tipo_incapacidad,
    origen_incapacidad

) {
    try {
        const [rows] = await pool.query(
            `
            SELECT *
            FROM 
                politicas_incapacidades
            WHERE
                TRIM(LOWER(prorroga))     = TRIM(LOWER(?))
                AND TRIM(LOWER(dias_laborados)) = TRIM(LOWER(?))
                AND TRIM(LOWER(salario))      = TRIM(LOWER(?))
                AND ? BETWEEN rango_minimo AND IFNULL(rango_maximo, 99999)
                AND TRIM(LOWER(tipo_incapacidad)) = TRIM(LOWER(?))
                AND TRIM(LOWER(origen)) = TRIM(LOWER(?))
            `,
            [
              
                prorroga,
                dias_laborados_conversion,
                salario_conversion,
                liquidacion_dias,
                tipo_incapacidad,
                origen_incapacidad
            ]
        );

        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error("Error al obtener la política de incapacidad:", error);
        throw error;
    }
}