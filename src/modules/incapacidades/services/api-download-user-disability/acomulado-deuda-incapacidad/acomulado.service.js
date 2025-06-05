

/* CALCULAR ACOMULADO DE LA DEUDA  */
export  function acomuladoDeuda (salario_empleado, Liq_porcentaje, grupo, id_liquidacion){


    console.log("FUNCION PARA CALCULAR ACOMULADO EN DEUDA DEL EMPLEADOR")

    console.log("DATOS RECIBIDOS: ", salario_empleado, Liq_porcentaje, grupo)


    /* VALOR SMMLV Y VALOR DEL DÍA DEL SMMLV */
    let SMMLV = 1423500
    let DSMMLV = 47450


    /* VALOR DEL DIA DEL EMPLEADO  CON PORCENTAJE A LIQUIDAR POR ENTIDAD*/
    const diaEmpleado = Math.round((salario_empleado/30) *  (parseFloat(Liq_porcentaje) / 100))
    console.log("diaEmpleado: ", diaEmpleado)
    

    /* VALIDAMOS QUE EL DIA DEL EMPLEADO NO SEA MAYOR QUE EL DSMMLV, DE LO CONTRARIO NO HABRIA ACOMULADO */    
    if( diaEmpleado >= DSMMLV ){

        console.log("DIA DEL EMPLEADO ES MAYOR AL DSMMLV.")
        return 0
    }



    /* SE CALCULA LA DIFERECIA ENTRE EL DIA BASICO Y EL DEL EMPLEADO  */
    const Diferencia = DSMMLV - diaEmpleado
    console.log("DIFERENCIA: ", Diferencia)


    /* VALOR A LIQUIDAR */
    const Deuda = Diferencia * grupo
    console.log("DEUDA ACOMULADA EMPLEADOR: ", Deuda )

    const deudaRedondeada = Math.round(Deuda);
    console.log("DEUDA ACOMULADA EMPLEADOR:", deudaRedondeada);

    
    return deudaRedondeada

}

