
/* TABLA AUDITORIA PARA PARA INCAPCIDADES HISTORIAL */
CREATE TABLE auditoria_incapacidades (
    id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
    id_historial_afectado INT,
    tipo_incapacidad VARCHAR(50),
    subtipo_incapacidad VARCHAR(100),
    fecha_inicio_incapacidad DATE,
    fecha_final_incapacidad DATE,
    cantidad_dias INT,
    codigo_categoria VARCHAR(200),
    descripcion_categoria VARCHAR(300),
    codigo_subcategoria VARCHAR(300),
    descripcion_subcategoria VARCHAR(300),
    prorroga TINYINT(1),
    id_empleado INT,
    id_incapacidad_extension INT,
    downloaded TINYINT(1),
    fecha_registro TIMESTAMP,
    fecha_actualizacion TIMESTAMP,
    usuario_id INT,
    tipo_accion VARCHAR(10),
    fecha_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



/* TRIGGER PARA INSERT TABLA HISTORIAL */
DELIMITER $$

CREATE TRIGGER trg_auditoria_incapacidad_insert
AFTER INSERT ON incapacidades_historial
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_incapacidades (
        id_historial_afectado,
        tipo_incapacidad,
        subtipo_incapacidad,
        fecha_inicio_incapacidad,
        fecha_final_incapacidad,
        cantidad_dias,
        codigo_categoria,
        descripcion_categoria,
        codigo_subcategoria,
        descripcion_subcategoria,
        prorroga,
        id_empleado,
        id_incapacidad_extension,
        downloaded,
        fecha_registro,
        fecha_actualizacion,
        usuario_id,
        tipo_accion
    ) VALUES (
        NEW.id_incapacidades_historial,
        NEW.tipo_incapacidad,
        NEW.subtipo_incapacidad,
        NEW.fecha_inicio_incapacidad,
        NEW.fecha_final_incapacidad,
        NEW.cantidad_dias,
        NEW.codigo_categoria,
        NEW.descripcion_categoria,
        NEW.codigo_subcategoria,
        NEW.descripcion_subcategoria,
        NEW.prorroga,
        NEW.id_empleado,
        NEW.id_incapacidad_extension,
        NEW.downloaded,
        NEW.fecha_registro,
        NEW.fecha_actualizacion,
        @usuario_id,
        'INSERT'
    );
END$$

DELIMITER ;




/* TRIGGER PARA UPDATE HISTORIAL */
DELIMITER $$

CREATE TRIGGER trg_incapacidad_update_auditoria
AFTER UPDATE ON incapacidades_historial
FOR EACH ROW
BEGIN
  INSERT INTO auditoria_incapacidades (
    id_historial_afectado,
    tipo_incapacidad,
    subtipo_incapacidad,
    fecha_inicio_incapacidad,
    fecha_final_incapacidad,
    cantidad_dias,
    codigo_categoria,
    descripcion_categoria,
    codigo_subcategoria,
    descripcion_subcategoria,
    prorroga,
    id_empleado,
    id_incapacidad_extension,
    downloaded,
    fecha_registro,
    fecha_actualizacion,
    usuario_id,
    tipo_accion,
    fecha_evento
  ) VALUES (
    NEW.id_incapacidades_historial,
    NEW.tipo_incapacidad,
    NEW.subtipo_incapacidad,
    NEW.fecha_inicio_incapacidad,
    NEW.fecha_final_incapacidad,
    NEW.cantidad_dias,
    NEW.codigo_categoria,
    NEW.descripcion_categoria,
    NEW.codigo_subcategoria,
    NEW.descripcion_subcategoria,
    NEW.prorroga,
    NEW.id_empleado,
    NEW.id_incapacidad_extension,
    NEW.downloaded,
    NEW.fecha_registro,
    NEW.fecha_actualizacion,
    @usuario_id,
    'UPDATE',
    NOW()
  );
END$$

DELIMITER ;



/* TABLA TRIGGER PARA TABLA INCAPACIDADES */

CREATE TABLE auditoria_liquidacion (
  id_auditoria_liq INT AUTO_INCREMENT PRIMARY KEY,
  id_liquidacion_afectada INT,
  id_empleado INT,
  nombres VARCHAR(100),
  apellidos VARCHAR(100),
  documento BIGINT,
  contacto BIGINT,
  tipo_contrato VARCHAR(300),
  cargo VARCHAR(300),
  lider VARCHAR(300),
  fecha_registro_incapacidad DATETIME,
  tipo_incapacidad VARCHAR(300),
  subtipo_incapacidad VARCHAR(300),
  fecha_inicio_incapacidad DATE,
  fecha_final_incapacidad DATE,
  cantidad_dias INT,
  dias_liquidables_totales INT,
  codigo_categoria VARCHAR(300),
  descripcion_categoria VARCHAR(300),
  codigo_subcategoria VARCHAR(300),
  descripcion_subcategoria VARCHAR(300),
  prorroga TINYINT(1),
  dias_liquidacion_empleador INT,
  dias_liquidacion_eps INT,
  dias_liquidacion_arl INT,
  dias_liquidacion_fondo_pensiones INT,
  dias_liquidacion_eps_fondo_pensiones INT,
  porcentaje_liquidacion_empleador DECIMAL(10,2),
  porcentaje_liquidacion_eps DECIMAL(10,2),
  porcentaje_liquidacion_arl DECIMAL(10,2),
  porcentaje_liquidacion_fondo_pensiones DECIMAL(10,2),
  porcentaje_liquidacion_eps_fondo_pensiones DECIMAL(10,2),
  liquidacion_empleador BIGINT,
  liquidacion_eps BIGINT,
  liquidacion_arl BIGINT,
  liquidacion_fondo_pensiones BIGINT,
  liquidacion_eps_fondo_pensiones BIGINT,
  salario_empleado BIGINT,
  valor_dia_empleado BIGINT,
  fecha_contratacion DATE,
  dias_laborados INT,
  estado_incapacidad VARCHAR(300),
  id_incapacidades_historial INT,
  fecha_registro TIMESTAMP NULL,
  fecha_actualizacion TIMESTAMP NULL,
  downloaded TINYINT(1),
  usuario_id INT,
  tipo_accion VARCHAR(10),
  fecha_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



/* TRIGGUER TABLA DISPARADORA INSERT TABLA LIQUIDACION */
DELIMITER $$

CREATE TRIGGER trg_liquidacion_insert_auditoria
AFTER INSERT ON incapacidades_liquidacion
FOR EACH ROW
BEGIN
  INSERT INTO auditoria_liquidacion (
    id_liquidacion_afectada,
    id_empleado,
    nombres,
    apellidos,
    documento,
    contacto,
    tipo_contrato,
    cargo,
    lider,
    fecha_registro_incapacidad,
    tipo_incapacidad,
    subtipo_incapacidad,
    fecha_inicio_incapacidad,
    fecha_final_incapacidad,
    cantidad_dias,
    dias_liquidables_totales,
    codigo_categoria,
    descripcion_categoria,
    codigo_subcategoria,
    descripcion_subcategoria,
    prorroga,
    dias_liquidacion_empleador,
    dias_liquidacion_eps,
    dias_liquidacion_arl,
    dias_liquidacion_fondo_pensiones,
    dias_liquidacion_eps_fondo_pensiones,
    porcentaje_liquidacion_empleador,
    porcentaje_liquidacion_eps,
    porcentaje_liquidacion_arl,
    porcentaje_liquidacion_fondo_pensiones,
    porcentaje_liquidacion_eps_fondo_pensiones,
    liquidacion_empleador,
    liquidacion_eps,
    liquidacion_arl,
    liquidacion_fondo_pensiones,
    liquidacion_eps_fondo_pensiones,
    salario_empleado,
    valor_dia_empleado,
    fecha_contratacion,
    dias_laborados,
    estado_incapacidad,
    id_incapacidades_historial,
    fecha_registro,
    fecha_actualizacion,
    downloaded,
    usuario_id,
    tipo_accion,
    fecha_evento
  ) VALUES (
    NEW.id_incapacidades_liquidacion,
    NEW.id_empleado,
    NEW.nombres,
    NEW.apellidos,
    NEW.documento,
    NEW.contacto,
    NEW.tipo_contrato,
    NEW.cargo,
    NEW.lider,
    NEW.fecha_registro_incapacidad,
    NEW.tipo_incapacidad,
    NEW.subtipo_incapacidad,
    NEW.fecha_inicio_incapacidad,
    NEW.fecha_final_incapacidad,
    NEW.cantidad_dias,
    NEW.dias_liquidables_totales,
    NEW.codigo_categoria,
    NEW.descripcion_categoria,
    NEW.codigo_subcategoria,
    NEW.descripcion_subcategoria,
    NEW.prorroga,
    NEW.dias_liquidacion_empleador,
    NEW.dias_liquidacion_eps,
    NEW.dias_liquidacion_arl,
    NEW.dias_liquidacion_fondo_pensiones,
    NEW.dias_liquidacion_eps_fondo_pensiones,
    NEW.porcentaje_liquidacion_empleador,
    NEW.porcentaje_liquidacion_eps,
    NEW.porcentaje_liquidacion_arl,
    NEW.porcentaje_liquidacion_fondo_pensiones,
    NEW.porcentaje_liquidacion_eps_fondo_pensiones,
    NEW.liquidacion_empleador,
    NEW.liquidacion_eps,
    NEW.liquidacion_arl,
    NEW.liquidacion_fondo_pensiones,
    NEW.liquidacion_eps_fondo_pensiones,
    NEW.salario_empleado,
    NEW.valor_dia_empleado,
    NEW.fecha_contratacion,
    NEW.dias_laborados,
    NEW.estado_incapacidad,
    NEW.id_incapacidades_historial,
    NEW.fecha_registro,
    NEW.fecha_actualizacion,
    NEW.downloaded,
    @usuario_id,
    'INSERT',
    NOW()
  );
END$$

DELIMITER ;


/* TRIGGER DE UPDATE PARA TABLA LIQUIDACION */
DELIMITER $$

CREATE TRIGGER trg_liquidacion_update_auditoria
AFTER UPDATE ON incapacidades_liquidacion
FOR EACH ROW
BEGIN
  INSERT INTO auditoria_liquidacion (
    id_liquidacion_afectada,
    id_empleado,
    nombres,
    apellidos,
    documento,
    contacto,
    tipo_contrato,
    cargo,
    lider,
    fecha_registro_incapacidad,
    tipo_incapacidad,
    subtipo_incapacidad,
    fecha_inicio_incapacidad,
    fecha_final_incapacidad,
    cantidad_dias,
    dias_liquidables_totales,
    codigo_categoria,
    descripcion_categoria,
    codigo_subcategoria,
    descripcion_subcategoria,
    prorroga,
    dias_liquidacion_empleador,
    dias_liquidacion_eps,
    dias_liquidacion_arl,
    dias_liquidacion_fondo_pensiones,
    dias_liquidacion_eps_fondo_pensiones,
    porcentaje_liquidacion_empleador,
    porcentaje_liquidacion_eps,
    porcentaje_liquidacion_arl,
    porcentaje_liquidacion_fondo_pensiones,
    porcentaje_liquidacion_eps_fondo_pensiones,
    liquidacion_empleador,
    liquidacion_eps,
    liquidacion_arl,
    liquidacion_fondo_pensiones,
    liquidacion_eps_fondo_pensiones,
    salario_empleado,
    valor_dia_empleado,
    fecha_contratacion,
    dias_laborados,
    estado_incapacidad,
    id_incapacidades_historial,
    fecha_registro,
    fecha_actualizacion,
    downloaded,
    usuario_id,
    tipo_accion,
    fecha_evento
  ) VALUES (
    NEW.id_incapacidades_liquidacion,
    NEW.id_empleado,
    NEW.nombres,
    NEW.apellidos,
    NEW.documento,
    NEW.contacto,
    NEW.tipo_contrato,
    NEW.cargo,
    NEW.lider,
    NEW.fecha_registro_incapacidad,
    NEW.tipo_incapacidad,
    NEW.subtipo_incapacidad,
    NEW.fecha_inicio_incapacidad,
    NEW.fecha_final_incapacidad,
    NEW.cantidad_dias,
    NEW.dias_liquidables_totales,
    NEW.codigo_categoria,
    NEW.descripcion_categoria,
    NEW.codigo_subcategoria,
    NEW.descripcion_subcategoria,
    NEW.prorroga,
    NEW.dias_liquidacion_empleador,
    NEW.dias_liquidacion_eps,
    NEW.dias_liquidacion_arl,
    NEW.dias_liquidacion_fondo_pensiones,
    NEW.dias_liquidacion_eps_fondo_pensiones,
    NEW.porcentaje_liquidacion_empleador,
    NEW.porcentaje_liquidacion_eps,
    NEW.porcentaje_liquidacion_arl,
    NEW.porcentaje_liquidacion_fondo_pensiones,
    NEW.porcentaje_liquidacion_eps_fondo_pensiones,
    NEW.liquidacion_empleador,
    NEW.liquidacion_eps,
    NEW.liquidacion_arl,
    NEW.liquidacion_fondo_pensiones,
    NEW.liquidacion_eps_fondo_pensiones,
    NEW.salario_empleado,
    NEW.valor_dia_empleado,
    NEW.fecha_contratacion,
    NEW.dias_laborados,
    NEW.estado_incapacidad,
    NEW.id_incapacidades_historial,
    NEW.fecha_registro,
    NEW.fecha_actualizacion,
    NEW.downloaded,
    @usuario_id,
    'UPDATE',
    NOW()
  );
END$$

DELIMITER ;




/* TABLA AUDITORIA DE EMPLEADO */
CREATE TABLE `auditoria_empleado` (
  `id_auditoria` INT NOT NULL AUTO_INCREMENT,
  `id_empleado` INT NOT NULL,
  `nombres` VARCHAR(100) DEFAULT NULL,
  `apellidos` VARCHAR(100) DEFAULT NULL,
  `documento` BIGINT NOT NULL,
  `fecha_contratacion` DATE NOT NULL,
  `tipo_contrato` VARCHAR(100) DEFAULT NULL,
  `cargo` VARCHAR(100) DEFAULT NULL,
  `estado` VARCHAR(100) DEFAULT NULL,
  `lider` VARCHAR(100) DEFAULT NULL,
  `salario` BIGINT DEFAULT NULL,
  `valor_dia` BIGINT DEFAULT NULL,
  `contacto` VARCHAR(50) DEFAULT NULL,
  `area` VARCHAR(50) DEFAULT NULL,
  `usuario_id` INT NOT NULL COMMENT 'ID del usuario que hizo la acción',
  `tipo_accion` VARCHAR(10) NOT NULL COMMENT 'INSERT, UPDATE, DELETE',
  `fecha_evento` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_auditoria`),
  KEY `idx_aud_empleado` (`id_empleado`),
  KEY `idx_usuario` (`usuario_id`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;



/* TRIGGUER EMPLEADO */
DELIMITER $$

CREATE TRIGGER trg_aud_empleado_insert
AFTER INSERT ON empleado
FOR EACH ROW
BEGIN
  INSERT INTO auditoria_empleado (
    id_empleado,
    nombres,
    apellidos,
    documento,
    fecha_contratacion,
    tipo_contrato,
    cargo,
    estado,
    lider,
    salario,
    valor_dia,
    contacto,
    area,
    /* usuario_id, */
    tipo_accion,
    fecha_evento
  ) VALUES (
    NEW.id_empleado,
    NEW.nombres,
    NEW.apellidos,
    NEW.documento,
    NEW.fecha_contratacion,
    NEW.tipo_contrato,
    NEW.cargo,
    NEW.estado,
    NEW.lider,
    NEW.salario,
    NEW.valor_dia,
    NEW.contacto,
    NEW.area,
    /* @usuario_id, */
    'INSERT',
    NOW()
  );
END$$

DELIMITER ;



-----------------------------------------
/* TABLA AUDITORIA INCAPACIDADES SEGUIMIENTO LIQUIDACION */

CREATE TABLE `auditoria_seguimiento_incapacidad_liquidada` (
  `id_auditoria` INT NOT NULL AUTO_INCREMENT,
  `id_seguimiento_afectado` INT NOT NULL COMMENT 'ID de seguimiento_incapacidad_liquidada',
  `id_user` INT DEFAULT NULL,
  `estado` VARCHAR(100) DEFAULT NULL,
  `observaciones` VARCHAR(600) DEFAULT NULL,
  `id_incapacidades_liquidacion` INT NOT NULL,
  `fecha_registro` TIMESTAMP NULL,
  `fecha_actualizacion` TIMESTAMP NULL,
  `tipo_accion` VARCHAR(10) NOT NULL COMMENT 'INSERT',
  `fecha_evento` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_auditoria`),
  KEY `idx_seguimiento_liq_aud` (`id_seguimiento_afectado`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;


  DELIMITER $$
CREATE TRIGGER `trg_segu_liq_liquidada_insert_auditoria`
AFTER INSERT ON `seguimiento_incapacidad_liquidada`
FOR EACH ROW
BEGIN
  INSERT INTO `auditoria_seguimiento_incapacidad_liquidada` (
    id_seguimiento_afectado,
    id_user,
    estado,
    observaciones,
    id_incapacidades_liquidacion,
    fecha_registro,
    fecha_actualizacion,
    tipo_accion,
    fecha_evento
  ) VALUES (
    NEW.id_seguimiento_incapacidad_liquidada,
    NEW.id_user,
    NEW.estado,
    NEW.observaciones,
    NEW.id_incapacidades_liquidacion,
    NEW.fecha_registro,
    NEW.fecha_actualizacion,
    'INSERT',
    NOW()
  );
END$$
DELIMITER ;