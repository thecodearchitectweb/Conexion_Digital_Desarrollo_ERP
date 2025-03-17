CREATE DATABASE conexion_digital;

CREATE TABLE codificacion_entidades (
    id_codificacion_entidades INT AUTO_INCREMENT PRIMARY KEY,
    administradora VARCHAR(100) DEFAULT NULL,
    subsistema VARCHAR(100) DEFAULT NULL,
    codigo_pila VARCHAR(100) DEFAULT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


CREATE TABLE cie_10 (
    id_cie_10 INT AUTO_INCREMENT PRIMARY KEY,
    codigo_categoria VARCHAR(10) DEFAULT NULL,
    descripcion_categoria VARCHAR(100) DEFAULT NULL,
    codigo_subcategoria VARCHAR(10) DEFAULT NULL,
    descripcion_subcategoria VARCHAR(200) DEFAULT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


CREATE TABLE politicas_incapacidades (
    id_politicas_incapacidades INT AUTO_INCREMENT PRIMARY KEY,
    cumplimiento VARCHAR(10) DEFAULT NULL,
    prorroga VARCHAR(10) DEFAULT NULL,
    dias_laborados VARCHAR(10) DEFAULT NULL,
    salario BIGINT DEFAULT NULL,
    tipo_incapacidad VARCHAR(10) DEFAULT NULL,
    dias_incapacidad VARCHAR(10) DEFAULT NULL,
    porcentaje_liquidacion_empleador DECIMAL(10,2) DEFAULT NULL,
    porcentaje_liquidacion_eps DECIMAL(10,2) DEFAULT NULL,
    porcentaje_liquidacion_arl DECIMAL(10,2) DEFAULT NULL,
    porcentaje_liquidacion_fondo_pensiones DECIMAL(10,2) DEFAULT NULL,
    porcentaje_liquidacion_eps_fondo_pensiones DECIMAL(10,2) DEFAULT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

)ENGINE=InnoDB;


CREATE TABLE empleado(
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) DEFAULT NULL,
    apellidos varchar(100) DEFAULT NULL,
    documento BIGINT UNIQUE NOT NULL,
    fecha_contratacion DATE NOT NULL,
    tipo_contrato VARCHAR(100) DEFAULT NULL,
    cargo VARCHAR(100) DEFAULT NULL,
    estado VARCHAR(100) DEFAULT NULL,
    lider VARCHAR(100)  DEFAULT NULL,
    salario BIGINT DEFAULT NULL,
    valor_dia BIGINT DEFAULT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
)ENGINE=InnoDB;


CREATE TABLE empresas(
    id_empresa INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) DEFAULT NULL,
    nit BIGINT UNIQUE NOT NULL,
    id_empleado INT UNIQUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_empresa_empleado FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado) ON DELETE CASCADE

)ENGINE=InnoDB;


CREATE TABLE seguridad_social(
    id_seguridad_social INT AUTO_INCREMENT PRIMARY KEY,
    eps VARCHAR(100) DEFAULT NULL,
    arl VARCHAR(100) DEFAULT NULL,
    fondo_pension VARCHAR(100) DEFAULT NULL,
    caja_compensacion VARCHAR(100) DEFAULT NULL,
    id_empleado INT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_seguridad_social_empleado FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado) ON DELETE CASCADE

)ENGINE=InnoDB;



CREATE TABLE incapacidades_historial(
    id_incapacidades_historial INT AUTO_INCREMENT PRIMARY KEY,
    tipo_incapacidad VARCHAR(50) DEFAULT NULL,
    subtipo_incapacidad VARCHAR(100) DEFAULT NULL,
    fecha_inicio_incapacidad DATE DEFAULT NULL,
    fecha_final_incapacidad DATE DEFAULT NULL,
    cantidad_dias INT DEFAULT NULL,
    codigo_enfermedad_general VARCHAR(50) DEFAULT NULL,
    descripcion_enfermedad_general VARCHAR(200) DEFAULT NULL,
    prorroga BOOLEAN DEFAULT NULL,
    id_empleado INT,

    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_incapacidades_historial_empleado FOREIGN KEY (id_empleado)REFERENCES empleado(id_empleado) ON DELETE CASCADE

)ENGINE=InnoDB;



CREATE TABLE incapacidades_seguimiento(
    id_incapacidades_seguimiento INT AUTO_INCREMENT PRIMARY KEY,
    estado_incapacidad VARCHAR(100) DEFAULT NULL,
    observaciones VARCHAR(1000) DEFAULT NULL,
    id_incapacidades_historial INT,

    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_incapacidades_seguimiento_incapacidades_historial FOREIGN KEY (id_incapacidades_historial)REFERENCES incapacidades_historial(id_incapacidades_historial) ON DELETE CASCADE

)ENGINE=InnoDB;



CREATE TABLE incapacidades_liquidacion(
    id_incapacidades_liquidacion INT AUTO_INCREMENT PRIMARY KEY,
    dias_liquidacion_empleador INT DEFAULT NULL,
    dias_liquidacion_eps INT DEFAULT NULL,
    dias_liquidacion_arl INT DEFAULT NULL,
    dias_liquidacion_fondo_pensiones INT DEFAULT NULL,
    dias_liquidacion_eps_fondo_pensiones INT DEFAULT NULL,
    porcentaje_liquidacion_empleador DECIMAL(10,2) DEFAULT NULL,
    porcentaje_liquidacion_eps DECIMAL(10,2) DEFAULT NULL,
    porcentaje_liquidacion_arl DECIMAL(10,2) DEFAULT NULL,
    porcentaje_liquidacion_fondo_pensiones DECIMAL(10,2) DEFAULT NULL,
    porcentaje_liquidacion_eps_fondo_pensiones DECIMAL(10,2) DEFAULT NULL,
    liquidacion_empleador BIGINT DEFAULT NULL,
    liquidacion_eps BIGINT DEFAULT NULL,
    liquidacion_arl BIGINT DEFAULT NULL,
    liquidacion_fondo_pensiones BIGINT DEFAULT NULL,
    liquidacion_eps_fondo_pensiones BIGINT DEFAULT NULL,
    salario_empleado BIGINT DEFAULT NULL,
    valor_dia_empleado BIGINT DEFAULT NULL,
    fecha_contratacion DATE DEFAULT NULL,
    dias_laborados INT,
    id_incapacidades_historial INT,

    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_incapacidades_liquidacion_incapacidades_historial FOREIGN KEY (id_incapacidades_historial)REFERENCES incapacidades_historial(id_incapacidades_historial) ON DELETE CASCADE


)ENGINE=InnoDB;



CREATE TABLE ruta_documentos(
    id_ruta_documentos INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) DEFAULT NULL,
    ruta VARCHAR(500) DEFAULT NULL,
    id_incapacidades_historial INT,

    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_ruta_documentos_incapacidades_historial FOREIGN KEY (id_incapacidades_historial)REFERENCES incapacidades_historial(id_incapacidades_historial) ON DELETE CASCADE


)ENGINE=InnoDB;




















































