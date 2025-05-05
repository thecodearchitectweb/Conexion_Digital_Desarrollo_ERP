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
) ENGINE = InnoDB AUTO_INCREMENT = 21 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci



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
    `downloaded` tinyint(1) DEFAULT '0',
    `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_incapacidades_historial`),
    KEY `fk_incapacidades_historial_empleado` (`id_empleado`),
    CONSTRAINT `fk_incapacidades_historial_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 17 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci




CREATE TABLE `incapacidades_liquidacion` (
    `id_incapacidades_liquidacion` int NOT NULL AUTO_INCREMENT,
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
) ENGINE = InnoDB AUTO_INCREMENT = 17 DEFAULT CHARSET = utf8mb4 COLLATE = 






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
) ENGINE = InnoDB AUTO_INCREMENT = 17 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci





CREATE TABLE `politicas_incapacidades` (
    `id_politicas_incapacidades` int NOT NULL AUTO_INCREMENT,
    `cumplimiento` varchar(10) DEFAULT NULL,
    `prorroga` varchar(10) DEFAULT NULL,
    `dias_laborados` varchar(10) DEFAULT NULL,
    `salario` varchar(20) DEFAULT NULL,
    `tipo_incapacidad` varchar(10) DEFAULT NULL,
    `dias_incapacidad` varchar(10) DEFAULT NULL,
    `porcentaje_liquidacion_empleador` decimal(10, 2) DEFAULT NULL,
    `porcentaje_liquidacion_eps` decimal(10, 2) DEFAULT NULL,
    `porcentaje_liquidacion_arl` decimal(10, 2) DEFAULT NULL,
    `porcentaje_liquidacion_fondo_pensiones` decimal(10, 2) DEFAULT NULL,
    `porcentaje_liquidacion_eps_fondo_pensiones` decimal(10, 2) DEFAULT NULL,
    `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_politicas_incapacidades`)
) ENGINE = InnoDB AUTO_INCREMENT = 25 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci




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