
import { pool } from "../../../../models/db.js";


export async function getPoliticaByParametros
(
    prorroga, diasLaborados, salario, tipoIncapacidad, diasIncapacidad
) 
{
    try {
        const [politicas] = await pool.query(
            `
            SELECT * FROM 
                politicas_incapacidades
            WHERE 
                TRIM(LOWER(prorroga)) = TRIM(LOWER(?))
                AND TRIM(LOWER(dias_laborados)) = TRIM(LOWER(?))
                AND TRIM(LOWER(salario)) = TRIM(LOWER(?))
                AND TRIM(LOWER(tipo_incapacidad)) = TRIM(LOWER(?))
                AND TRIM(LOWER(dias_incapacidad)) = TRIM(LOWER(?))
            `,
            [prorroga, diasLaborados, salario, tipoIncapacidad, diasIncapacidad]
        );

        if (politicas.length === 0) {
            return null;
        }

        return politicas[0]; // Retornamos solo la política encontrada
        
    } catch (error) {
        console.error("Error al obtener la política de incapacidad:", error);
        throw error;
    }
}




/* POLITICA CON PRORROGA PARA VALIDAR OTTRAS ENTIDADES */
export async function getPoliticaByParametrosProrroga(
    prorroga, diasLaborados, salario, totalDiasIncapacidad
) {
    try {
        const [politicas] = await pool.query(
            `
            SELECT * FROM 
                politicas_incapacidades
            WHERE 
                TRIM(LOWER(prorroga)) = TRIM(LOWER(?))
                AND TRIM(LOWER(dias_laborados)) = TRIM(LOWER(?))
                AND TRIM(LOWER(salario)) = TRIM(LOWER(?))
                AND ? BETWEEN rango_minimo AND IFNULL(rango_maximo, 99999)
            `,
            [prorroga, diasLaborados, salario, totalDiasIncapacidad]
        );

        if (politicas.length === 0) {
            return null;
        }

        return politicas[0];
        
    } catch (error) {
        console.error("Error al obtener la política de incapacidad:", error);
        throw error;
    }
}





/* POLITICA CON PRORROGA PARA VALIDAR OTTRAS ENTIDADES */
export async function getPoliticaGrupoA(
    prorroga,
    dias_laborados_conversion_grupoA,
    salario_conversion_grupoA,
    liquidacion_dias_grupoA,
    tipo_incapacidad
) {
    try {
        const [politicas] = await pool.query(
            `
            SELECT *
            FROM politicas_incapacidades
            WHERE
                TRIM(LOWER(prorroga))     = TRIM(LOWER(?))
                AND TRIM(LOWER(dias_laborados)) = TRIM(LOWER(?))
                AND TRIM(LOWER(salario))      = TRIM(LOWER(?))
                AND ? BETWEEN rango_minimo AND IFNULL(rango_maximo, 99999)
                AND TRIM(LOWER(tipo_incapacidad)) = TRIM(LOWER(?))
            `,
            [
              
              prorroga,
              dias_laborados_conversion_grupoA,
              salario_conversion_grupoA,
              liquidacion_dias_grupoA,
              tipo_incapacidad
            ]
        );

        return politicas[0] || null;
    } catch (error) {
        console.error("Error al obtener la política de incapacidad:", error);
        throw error;
    }
}








/* POLITICA CON PRORROGA PARA VALIDAR OTTRAS ENTIDADES */
export async function getPoliticaGrupoB(
    prorroga,
    dias_laborados_conversion_grupoA,
    salario_conversion_grupoA,
    liquidacion_dias_grupoA,
    tipo_incapacidad
) {
    try {
        const [politicas] = await pool.query(
            `
            SELECT *
            FROM politicas_incapacidades
            WHERE
                TRIM(LOWER(prorroga))     = TRIM(LOWER(?))
                AND TRIM(LOWER(dias_laborados)) = TRIM(LOWER(?))
                AND TRIM(LOWER(salario))      = TRIM(LOWER(?))
                AND ? BETWEEN rango_minimo AND IFNULL(rango_maximo, 99999)
                AND TRIM(LOWER(tipo_incapacidad)) = TRIM(LOWER(?))
            `,
            [
              
              prorroga,
              dias_laborados_conversion_grupoA,
              salario_conversion_grupoA,
              liquidacion_dias_grupoA,
              tipo_incapacidad
            ]
        );

        return politicas[0] || null;
    } catch (error) {
        console.error("Error al obtener la política de incapacidad:", error);
        throw error;
    }
}





/* POLITICA CON PRORROGA PARA VALIDAR OTTRAS ENTIDADES */
export async function getPoliticaGrupoC(
    prorroga,
    dias_laborados_conversion_grupoA,
    salario_conversion_grupoA,
    liquidacion_dias_grupoA,
    tipo_incapacidad
) {
    try {
        const [politicas] = await pool.query(
            `
            SELECT *
            FROM politicas_incapacidades
            WHERE
                TRIM(LOWER(prorroga))     = TRIM(LOWER(?))
                AND TRIM(LOWER(dias_laborados)) = TRIM(LOWER(?))
                AND TRIM(LOWER(salario))      = TRIM(LOWER(?))
                AND ? BETWEEN rango_minimo AND IFNULL(rango_maximo, 99999)
                AND TRIM(LOWER(tipo_incapacidad)) = TRIM(LOWER(?))
            `,
            [
              
              prorroga,
              dias_laborados_conversion_grupoA,
              salario_conversion_grupoA,
              liquidacion_dias_grupoA,
              tipo_incapacidad
            ]
        );

        return politicas[0] || null;
    } catch (error) {
        console.error("Error al obtener la política de incapacidad:", error);
        throw error;
    }
}



/* POLITICA CON PRORROGA PARA VALIDAR OTTRAS ENTIDADES */
export async function getPoliticaGrupoD(
    prorroga,
    dias_laborados_conversion_grupoA,
    salario_conversion_grupoA,
    liquidacion_dias_grupoA,
    tipo_incapacidad
) {
    try {
        const [politicas] = await pool.query(
            `
            SELECT *
            FROM politicas_incapacidades
            WHERE
                TRIM(LOWER(prorroga))     = TRIM(LOWER(?))
                AND TRIM(LOWER(dias_laborados)) = TRIM(LOWER(?))
                AND TRIM(LOWER(salario))      = TRIM(LOWER(?))
                AND ? BETWEEN rango_minimo AND IFNULL(rango_maximo, 99999)
                AND TRIM(LOWER(tipo_incapacidad)) = TRIM(LOWER(?))
            `,
            [
              
              prorroga,
              dias_laborados_conversion_grupoA,
              salario_conversion_grupoA,
              liquidacion_dias_grupoA,
              tipo_incapacidad
            ]
        );

        return politicas[0] || null;
    } catch (error) {
        console.error("Error al obtener la política de incapacidad:", error);
        throw error;
    }
}




/* LICENCIA DE MATERNIDAD  O PATERNIDAD*/
export async function getPoliticaLicencia(
    prorroga,
    dias_laborados_conversion,
    salario_conversion,
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
                AND TRIM(LOWER(tipo_incapacidad)) = TRIM(LOWER(?))
                AND TRIM(LOWER(origen)) = TRIM(LOWER(?))
            `,
            [
              
                prorroga,
                dias_laborados_conversion,
                salario_conversion,
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