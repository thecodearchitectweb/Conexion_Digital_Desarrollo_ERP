import { differenceInDays } from 'date-fns';

export function transformarParametrosPolitica(data) {
  const fechaContratacionRaw = new Date(data.fecha_contratacion);
  const hoy = new Date();

  const diasLaborados = differenceInDays(hoy, fechaContratacionRaw) + 1;
  const diasLaborados_conversion = diasLaborados >= 30 ? ">30" : "<30";

  const SMMLV = 1423500;
  const salario_conversion = data.salario_empleado > SMMLV ? ">SMLV" : "SMLV";

  const tipo_incapacidad = data.tipo_incapacidad;

  const dias_incapacidad = data.cantidad_dias;
  const dias_incapacidad_conversion = dias_incapacidad > 2 ? ">2" : "<3";

  const prorroga_conversion = data.prorroga === 1 ? "SI" : "NO";

  return {
    prorroga: prorroga_conversion,

    dias_laborados_conversion: diasLaborados_conversion,
    dias_laborados: diasLaborados,
    
    salario: salario_conversion,

    tipo_incapacidad,
    
    dias_incapacidad_conversion: dias_incapacidad_conversion,
    dias_incapacidad: dias_incapacidad
  };
}
