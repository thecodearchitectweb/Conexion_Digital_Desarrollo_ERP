import { pool } from "../../../models/db.js";
//import bcrypt from "bcryptjs";

import { SessionManager } from "../utils/sessionManager.js";
import {
  formatDate,
  formatDate2,
  formatDateTime,
} from "../utils/formatDate/formatDate.js";
import { getEmployeeData } from "../repositories/entity-liquidation-view/get_employee_data.js";
import { getDataLiquidation } from "../repositories/entity-liquidation-view/get_liquidation_data.js";
import { updateMensajeSeguimiento } from "../repositories/entity-liquidation-view/updateMensajeSeguimiento.js";
import { getTablaObservaciones } from "../repositories/entity-liquidation-view/get_tabla_observaciones.js";
import { getTablaFiles } from "../repositories/entity-liquidation-view/get_tabla_files.js";
import {
  incapacidadProrrogaVinculadaDB,
  ProrrogaVinculadaDB,
} from "../repositories/entity-liquidation-view/get_incapacidad_prorroga.js";

import path from 'path';

const uploadBase = process.env.UPLOAD_PATH; 

import express from "express";

const app = express();

export const getEntityLiquidationView = async (req, res) => {
  try {
    const { id_liquidacion } = req.params;
    console.log(
      "ESTE ES EL ID QUE RECIBE EL CONTROLLER ENTITY LIQUIDATION VIEW",
      id_liquidacion
    );

    /* TRAE LOS DATOS DE LA TABLA INCAPACIDAD LIQUIDADA */
    const incapacidadLiquidada = await getDataLiquidation(id_liquidacion);
    console.log(
      "ESTOS SON TODOS LOS DATOS QUE TRAE EL ID: ",
      incapacidadLiquidada
    );

    /* SACAMOS EL ID EMPLEADO DE LA TABLA */
    const id_empleado = incapacidadLiquidada.id_empleado;

    /* TRAER LOS DATOS DE LA TABLA PRORROGA CON ID PRORROGA DE LA TABLA LIQUIDACION*/
    const incapacidadProrrogaVinculada = await incapacidadProrrogaVinculadaDB(
      id_liquidacion
    );
    console.log(
      "datos de la incapcidad vinculada, prorroga: ",
      incapacidadProrrogaVinculada
    );

    let ProrrogaVinculada = null;

    /* TRAER LOS DATOS DE LA INCAPCIDAD VINCULADA A LA PRORROGA CON EL ID TRAIDO DE incapacidadProrrogaVinculada*/
    if (
      incapacidadProrrogaVinculada &&
      incapacidadProrrogaVinculada.id_incapacidad_prorroga
    ) {
      ProrrogaVinculada = await ProrrogaVinculadaDB(
        incapacidadProrrogaVinculada.id_incapacidad_prorroga
      );
      console.log("Datos de la prorroga vinculada: ", ProrrogaVinculada);
    } else {
      console.log("No hay prorroga vinculada para esta incapacidad.");
    }

    /* TRAEMOS LOS DATOS DEL EMPLEADO */
    const dataEmployee = await getEmployeeData(id_empleado);
    console.log(
      "ESTOS SON TODOS LOS DATOS DEL EMPLEADO QUE TRAE CON EL ID: ",
      dataEmployee
    );

    /* DEJAMOS EN OBSERVACIONES UN MENSAJE DONDE INFORMAMOS QUE SE HA LIQUIDADO CON EXITO LA INCAPACIDAD */
    const mensajeSeguimiento = await updateMensajeSeguimiento(id_liquidacion);

    /* TRAEMOS TODAS LAS OBSERVACIONES A LA VISTA */
    const tablaObservaciones = await getTablaObservaciones(id_liquidacion);
    console.log(
      "Estas son todas las observaciones realizadas a esta incapacidad: ",
      tablaObservaciones
    );



    /* TRAEMOS TODOS LOS DOCUMENTOS A LA VISTA */
    const tablaFiles = await getTablaFiles(id_liquidacion);
    console.log("ESTOS SON LOS FILES: ", tablaFiles);

    let datos_rutas_files = tablaFiles;

    if (tablaFiles.length > 0) {
      // Transformar las rutas: reemplazar backslashes por forward slashes
        datos_rutas_files = datos_rutas_files.map(file => {
          const absPath = path.normalize(file.ruta);
          let relPath = path.relative(uploadBase, absPath);
          relPath = relPath.split(path.sep).join('/');
          return { 
            ...file, 
            ruta: '/upload/' + relPath 
          };
        });
    }

    console.log("ESTA ES LA RUTA PARA DESCARGAR EL ARCHIVO: ------------------------------>  ", datos_rutas_files)



    /* FORMATEAMOS FECHAS */
    dataEmployee.fecha_contratacion = formatDate2(
      dataEmployee.fecha_contratacion
    );
    incapacidadLiquidada.fecha_inicio_incapacidad = formatDate2(
      incapacidadLiquidada.fecha_inicio_incapacidad
    );
    incapacidadLiquidada.fecha_final_incapacidad = formatDate2(
      incapacidadLiquidada.fecha_final_incapacidad
    );
    incapacidadLiquidada.fecha_registro = formatDateTime(
      incapacidadLiquidada.fecha_registro
    );

    // Verificamos que ProrrogaVinculada exista antes de formatear sus fechas
    if (ProrrogaVinculada) {
      ProrrogaVinculada.fecha_registro_incapacidad = formatDate2(
        ProrrogaVinculada.fecha_registro_incapacidad
      );
      ProrrogaVinculada.fecha_inicio_incapacidad = formatDate2(
        ProrrogaVinculada.fecha_inicio_incapacidad
      );
      ProrrogaVinculada.fecha_final_incapacidad = formatDate2(
        ProrrogaVinculada.fecha_final_incapacidad
      );
    }

    /* AL SER UN ARRAY, DEBEMS RECORRER UN CICLO PARA FORMATEAR LA FECHA DE TODOS */
    tablaObservaciones.forEach((obs) => {
      obs.fecha_registro = formatDateTime(obs.fecha_registro);
    });

    /* ARRAY PARA FORMATEAR LAS FECHAS DEL ARRAY */
    /* ARRAY PARA FORMATEAR LAS FECHAS DEL ARRAY */
    datos_rutas_files.forEach((file) => {
      if (file.fecha_registro) {
        file.fecha_registro = formatDateTime(file.fecha_registro);
      }
    });

    /* RENDER A LA VISTA  */
    return res.render("entity_liquidation_view", {
      datos_empleado: dataEmployee,
      datos_incapacidad_liquidad: incapacidadLiquidada,
      Seguimiento: tablaObservaciones,
      files: datos_rutas_files,
      incapacidadProrroga: ProrrogaVinculada || null,
    });
  } catch (error) {
    console.error("Error en getEntityLiquidationView:", error);
    res
      .status(500)
      .send("Error al cargar la vista de liquidación de incapacidad");
  }
};
