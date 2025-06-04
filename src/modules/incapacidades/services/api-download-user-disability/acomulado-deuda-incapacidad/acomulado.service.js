

/* CALCULAR ACOMULADO DE LA DEUDA  */
export async function acomuladoDeuda (salario_empleado, Liq_porcentaje, grupo, id_liquidacion){


    console.log("FUNCION PARA CALCULAR ACOMULADO EN DEUDA DEL EMPLEADOR")

    console.log("DATOS RECIBIDOS: ", salario_empleado, Liq_porcentaje, grupo)


    /* VALOR SMMLV Y VALOR DEL DÍA DEL SMMLV */
    let SMMLV = 1423500
    let DSMMLV = 47450


    /* VARIABLES PARA RECALCULAR EL SALARIO DEL EMPLEADO EN CASO QUE SEA UN SALARIO MENOS AL SMMLV */
    if(salario_empleado < SMMLV){
        
        /* SALARIO A CALCULAR */
        SMMLV = salario_empleado
        DSMMLV = SMMLV / 30

    }

    console.log("DSMMLV: ", SMMLV, DSMMLV)

    /* VALOR DEL DIA DEL EMPLEADO  CON PORCENTAJE A LIQUIDAR POR ENTIDAD*/
    const diaEmpleado = (salario_empleado/30) *  (parseFloat(Liq_porcentaje) / 100)
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

    
    return Deuda

}

