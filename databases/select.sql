SELECT *
FROM politicas_incapacidades
WHERE 3 BETWEEN rango_minimo AND IFNULL(rango_maximo, 99999)
