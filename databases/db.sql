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