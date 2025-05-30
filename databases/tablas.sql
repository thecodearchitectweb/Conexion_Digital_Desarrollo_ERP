CREATE TABLE `cie_10` (
    `id_cie_10` int NOT NULL AUTO_INCREMENT,
    `codigo_categoria` varchar(50) DEFAULT NULL,
    `descripcion_categoria` varchar(300) DEFAULT NULL,
    `codigo_subcategoria` varchar(300) DEFAULT NULL,
    `descripcion_subcategoria` varchar(300) DEFAULT NULL,
    `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_cie_10`)
) ENGINE = InnoDB AUTO_INCREMENT = 12422 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci




CREATE TABLE `codificacion_entidades` (
    `id_codificacion_entidades` int NOT NULL AUTO_INCREMENT,
    `administradora` varchar(100) DEFAULT NULL,
    `subsistema` varchar(100) DEFAULT NULL,
    `codigo_pila` varchar(100) DEFAULT NULL,
    `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_codificacion_entidades`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci



CREATE TABLE `empleado` (
    `id_empleado` int NOT NULL AUTO_INCREMENT,
    `nombres` varchar(100) DEFAULT NULL,
    `apellidos` varchar(100) DEFAULT NULL,
    `documento` bigint NOT NULL,
    `fecha_contratacion` date NOT NULL,
    `tipo_contrato` varchar(100) DEFAULT NULL,
    `cargo` varchar(100) DEFAULT NULL,
    `estado` varchar(100) DEFAULT NULL,
    `lider` varchar(100) DEFAULT NULL,
    `salario` bigint DEFAULT NULL,
    `valor_dia` bigint DEFAULT NULL,
    `contacto` varchar(50) DEFAULT NULL,
    `area` varchar(50) DEFAULT NULL,
    `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_empleado`),
    UNIQUE KEY `documento` (`documento`)
) ENGINE = InnoDB AUTO_INCREMENT = 27 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci




CREATE TABLE `empresas` (
    `id_empresa` int NOT NULL AUTO_INCREMENT,
    `nombre` varchar(100) DEFAULT NULL,
    `nit` bigint NOT NULL,
    `id_empleado` int DEFAULT NULL,
    `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_empresa`),
    UNIQUE KEY `nit` (`nit`),
    UNIQUE KEY `id_empleado` (`id_empleado`),
    CONSTRAINT `fk_empresa_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci




CREATE TABLE `incapacidades_historial` (
    `id_incapacidades_historial` int NOT NULL AUTO_INCREMENT,
    `tipo_incapacidad` varchar(50) DEFAULT NULL,
    `subtipo_incapacidad` varchar(100) DEFAULT NULL,
    `fecha_inicio_incapacidad` date DEFAULT NULL,
    `fecha_final_incapacidad` date DEFAULT NULL,
    `cantidad_dias` int DEFAULT NULL,
    `codigo_categoria` varchar(200) DEFAULT NULL,
    `descripcion_categoria` varchar(300) DEFAULT NULL,
    `codigo_subcategoria` varchar(300) DEFAULT NULL,
    `descripcion_subcategoria` varchar(300) DEFAULT NULL,
    `prorroga` tinyint(1) DEFAULT NULL,
    `id_empleado` int DEFAULT NULL,
    `id_incapacidad_extension` int DEFAULT '0' COMMENT 'id de la incapacidad liquidada anterior',
    `downloaded` tinyint(1) DEFAULT '0',
    `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_incapacidades_historial`),
    KEY `fk_incapacidades_historial_empleado` (`id_empleado`),
    CONSTRAINT `fk_incapacidades_historial_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 15 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci




CREATE TABLE `incapacidades_liquidacion` (
    `id_incapacidades_liquidacion` int NOT NULL AUTO_INCREMENT,
    `id_empleado` int DEFAULT NULL COMMENT 'id del empleado',
    `nombres` varchar(100) DEFAULT NULL,
    `apellidos` varchar(100) DEFAULT NULL,
    `documento` bigint DEFAULT NULL,
    `contacto` bigint DEFAULT NULL,
    `tipo_contrato` varchar(300) DEFAULT NULL,
    `cargo` varchar(300) DEFAULT NULL,
    `lider` varchar(300) DEFAULT NULL,
    `fecha_registro_incapacidad` datetime DEFAULT NULL,
    `tipo_incapacidad` varchar(300) DEFAULT NULL,
    `subtipo_incapacidad` varchar(300) DEFAULT NULL,
    `fecha_inicio_incapacidad` date DEFAULT NULL,
    `fecha_final_incapacidad` date DEFAULT NULL,
    `cantidad_dias` int DEFAULT NULL,
    `dias_liquidables_totales` int DEFAULT '0',
    `codigo_categoria` varchar(300) DEFAULT NULL,
    `descripcion_categoria` varchar(300) DEFAULT NULL,
    `codigo_subcategoria` varchar(300) DEFAULT NULL,
    `descripcion_subcategoria` varchar(300) DEFAULT NULL,
    `prorroga` tinyint(1) DEFAULT NULL,
    `dias_liquidacion_empleador` int DEFAULT NULL,
    `dias_liquidacion_eps` int DEFAULT NULL,
    `dias_liquidacion_arl` int DEFAULT NULL,
    `dias_liquidacion_fondo_pensiones` int DEFAULT NULL,
    `dias_liquidacion_eps_fondo_pensiones` int DEFAULT NULL,
    `porcentaje_liquidacion_empleador` decimal(10, 2) DEFAULT NULL,
    `porcentaje_liquidacion_eps` decimal(10, 2) DEFAULT NULL,
    `porcentaje_liquidacion_arl` decimal(10, 2) DEFAULT NULL,
    `porcentaje_liquidacion_fondo_pensiones` decimal(10, 2) DEFAULT NULL,
    `porcentaje_liquidacion_eps_fondo_pensiones` decimal(10, 2) DEFAULT NULL,
    `liquidacion_empleador` bigint DEFAULT NULL,
    `liquidacion_eps` bigint DEFAULT NULL,
    `liquidacion_arl` bigint DEFAULT NULL,
    `liquidacion_fondo_pensiones` bigint DEFAULT NULL,
    `liquidacion_eps_fondo_pensiones` bigint DEFAULT NULL,
    `salario_empleado` bigint DEFAULT NULL,
    `valor_dia_empleado` bigint DEFAULT NULL,
    `fecha_contratacion` date DEFAULT NULL,
    `dias_laborados` int DEFAULT NULL,
    `estado_incapacidad` varchar(300) DEFAULT NULL,
    `id_incapacidades_historial` int DEFAULT NULL,
    `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `downloaded` tinyint(1) DEFAULT '0' COMMENT 'downloaded',
    PRIMARY KEY (
        `id_incapacidades_liquidacion`
    ),
    KEY `fk_incapacidades_liquidacion_incapacidades_historial` (`id_incapacidades_historial`),
    CONSTRAINT `fk_incapacidades_liquidacion_incapacidades_historial` FOREIGN KEY (`id_incapacidades_historial`) REFERENCES `incapacidades_historial` (`id_incapacidades_historial`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 15 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci



CREATE TABLE `incapacidades_seguimiento` (
    `id_incapacidades_seguimiento` int NOT NULL AUTO_INCREMENT,
    `estado_incapacidad` varchar(100) DEFAULT NULL,
    `observaciones` varchar(1000) DEFAULT NULL,
    `id_incapacidades_historial` int DEFAULT NULL,
    `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (
        `id_incapacidades_seguimiento`
    ),
    KEY `fk_incapacidades_seguimiento_incapacidades_historial` (`id_incapacidades_historial`),
    CONSTRAINT `fk_incapacidades_seguimiento_incapacidades_historial` FOREIGN KEY (`id_incapacidades_historial`) REFERENCES `incapacidades_historial` (`id_incapacidades_historial`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 16 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci



CREATE TABLE `politicas_incapacidades` (
    `id_politicas_incapacidades` int NOT NULL AUTO_INCREMENT,
    `cumplimiento` varchar(10) DEFAULT NULL,
    `prorroga` varchar(10) DEFAULT NULL,
    `dias_laborados` varchar(10) DEFAULT NULL,
    `salario` varchar(20) DEFAULT NULL,
    `rango_minimo` int DEFAULT NULL,
    `rango_maximo` int DEFAULT NULL,
    `tipo_incapacidad` varchar(10) DEFAULT NULL,
    `entidad_liquidadora` varchar(200) DEFAULT NULL,
    `dias_incapacidad` varchar(10) DEFAULT NULL,
    `porcentaje_liquidacion_empleador` decimal(10, 2) DEFAULT NULL,
    `porcentaje_liquidacion_eps` decimal(10, 2) DEFAULT NULL,
    `porcentaje_liquidacion_arl` decimal(10, 2) DEFAULT NULL,
    `porcentaje_liquidacion_fondo_pensiones` decimal(10, 2) DEFAULT NULL,
    `porcentaje_liquidacion_eps_fondo_pensiones` decimal(10, 2) DEFAULT NULL,
    `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_politicas_incapacidades`)
) ENGINE = InnoDB AUTO_INCREMENT = 37 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci




CREATE TABLE `ruta_documentos` (
    `id_ruta_documentos` int NOT NULL AUTO_INCREMENT,
    `nombre` varchar(100) DEFAULT NULL,
    `ruta` varchar(500) DEFAULT NULL,
    `id_incapacidades_historial` int DEFAULT NULL,
    `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_ruta_documentos`),
    KEY `fk_ruta_documentos_incapacidades_historial` (`id_incapacidades_historial`),
    CONSTRAINT `fk_ruta_documentos_incapacidades_historial` FOREIGN KEY (`id_incapacidades_historial`) REFERENCES `incapacidades_historial` (`id_incapacidades_historial`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci




CREATE TABLE `seguridad_social` (
    `id_seguridad_social` int NOT NULL AUTO_INCREMENT,
    `eps` varchar(100) DEFAULT NULL,
    `arl` varchar(100) DEFAULT NULL,
    `fondo_pension` varchar(100) DEFAULT NULL,
    `caja_compensacion` varchar(100) DEFAULT NULL,
    `id_empleado` int DEFAULT NULL,
    `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_seguridad_social`),
    KEY `fk_seguridad_social_empleado` (`id_empleado`),
    CONSTRAINT `fk_seguridad_social_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 21 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci


CREATE TABLE `sessions` (
    `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
    `expires` int unsigned NOT NULL,
    `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
    PRIMARY KEY (`session_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci



CREATE TABLE `seguimiento_incapacidad_liquidada` (
    `id_seguimiento_incapacidad_liquidada` int NOT NULL AUTO_INCREMENT,
    `id_user` int DEFAULT NULL,
    `estado` varchar(100) DEFAULT NULL,
    `observaciones` varchar(600) DEFAULT NULL,
    `id_incapacidades_liquidacion` int NOT NULL,
    `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (
        `id_seguimiento_incapacidad_liquidada`
    ),
    KEY `fk_seguimiento_liquidacion` (
        `id_incapacidades_liquidacion`
    ),
    CONSTRAINT `fk_seguimiento_liquidacion` FOREIGN KEY (
        `id_incapacidades_liquidacion`
    ) REFERENCES `incapacidades_liquidacion` (
        `id_incapacidades_liquidacion`
    ) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 24 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci



CREATE TABLE `files_upload` (
    `id_ruta_documentos` int NOT NULL AUTO_INCREMENT,
    `id_ruta_documentos_tabla_historial` int DEFAULT NULL,
    `nombre` varchar(100) DEFAULT NULL,
    `ruta` varchar(600) DEFAULT NULL,
    `id_incapacidades_liquidacion` int DEFAULT NULL,
    `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_ruta_documentos`),
    KEY `fk_files_upload` (
        `id_incapacidades_liquidacion`
    ),
    CONSTRAINT `fk_files_upload` FOREIGN KEY (
        `id_incapacidades_liquidacion`
    ) REFERENCES `incapacidades_liquidacion` (
        `id_incapacidades_liquidacion`
    ) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci



CREATE TABLE `prorroga` (
    `id_prorroga` int NOT NULL AUTO_INCREMENT,
    `id_empleado` int DEFAULT NULL,
    `id_incapacidad_prorroga` int DEFAULT NULL,
    `tipo_incapacidad_prorroga` varchar(100) DEFAULT NULL,
    `fecha_inicio_prorroga` date DEFAULT NULL,
    `fecha_final_prorroga` date DEFAULT NULL,
    `dias_incapacidad_prorroga` int DEFAULT NULL,
    `dias_liquidados_prorroga` int DEFAULT NULL,
    `id_incapacidades_liquidacion` int NOT NULL,
    `tipo_incapacidad` varchar(100) DEFAULT NULL,
    `fecha_inicio` date DEFAULT NULL,
    `fecha_final` date DEFAULT NULL,
    `dias_incapacidad` int DEFAULT NULL,
    `dias_liquidados` int DEFAULT NULL,
    `sumatoria_incapacidades` bigint DEFAULT NULL,
    PRIMARY KEY (`id_prorroga`),
    KEY `fk_prorroga_incapacidad` (
        `id_incapacidades_liquidacion`
    ),
    CONSTRAINT `fk_prorroga_incapacidad` FOREIGN KEY (
        `id_incapacidades_liquidacion`
    ) REFERENCES `incapacidades_liquidacion` (
        `id_incapacidades_liquidacion`
    ) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci



/* TABLA USUARIO */
CREATE TABLE `usuarios` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nombre` varchar(100) DEFAULT NULL,
    `documento` varchar(50) DEFAULT NULL,
    `estado` varchar(100) DEFAULT NULL,
    `fecha_nacimiento` date DEFAULT NULL,
    `correo` varchar(150) DEFAULT NULL,
    `contacto` varchar(20) DEFAULT NULL,
    `direccion` varchar(255) DEFAULT NULL,
    `area` varchar(100) DEFAULT NULL,
    `cargo` varchar(100) DEFAULT NULL,
    `lider_directo` varchar(100) DEFAULT NULL,
    `rol` varchar(100) DEFAULT NULL,
    `usuario` varchar(50) DEFAULT NULL,
    `password` varchar(200) DEFAULT NULL,
    `login_attempts` int DEFAULT '0',
    `lock_until` bigint DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `documento` (`documento`),
    UNIQUE KEY `correo` (`correo`),
    UNIQUE KEY `usuario` (`usuario`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci



/* TABLA DE RUTAS PARA PERMISOS */

CREATE TABLE `erp_rutas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `modulo` varchar(100) DEFAULT NULL,
  `submodulo` varchar(100) DEFAULT NULL,
  `ruta` varchar(255) NOT NULL,
  `nombre_vista` varchar(255) DEFAULT NULL,
  `metodo_HTTP` varchar(20) DEFAULT NULL,
  `requiere_AUTH` tinyint(1) DEFAULT NULL,
  `ruta_activa` tinyint(1) DEFAULT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE aplicativos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  ruta VARCHAR(255) NOT NULL,
  area VARCHAR(50) NOT NULL,
  observaciones  VARCHAR(255) NOT NULL,
  activo TINYINT(1) DEFAULT 1,
  fecha_registro DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;



/* TABLA LOGEO EN LOS MODULOS */
CREATE TABLE `accesos_modulos` (
    `id` int NOT NULL AUTO_INCREMENT,
    `usuario_id` int DEFAULT NULL,
    `usuario` varchar(100) DEFAULT NULL,
    `modulo` varchar(100) DEFAULT NULL,
    `ruta` varchar(255) DEFAULT NULL,
    `ip_cliente` varchar(45) DEFAULT NULL,
    `user_agent` varchar(255) DEFAULT NULL,
    `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `usuario_id` (`usuario_id`),
    CONSTRAINT `accesos_modulos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 232 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;