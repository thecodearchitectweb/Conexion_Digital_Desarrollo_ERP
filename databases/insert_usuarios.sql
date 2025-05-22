

INSERT INTO empresas (nombre, nit) 
VALUES 
('Conexion Digital Express', 900123456),
('Speed Networks S.A.S', 900654321);




INSERT INTO empleado (nombres, apellidos, documento, fecha_contratacion, tipo_contrato, cargo, estado, lider, salario, valor_dia, contacto, area)
VALUES 
('Carlos Andrés', 'Pérez Gómez', 100001, '2024-01-15', 'Indefinido', 'Analista', 'Activo', 'Laura Medina', 5000000, 166666, 3001234567, 'TI'),
('María Fernanda', 'Gómez Rodríguez', 100002, '2023-05-20', 'Fijo', 'Desarrollador', 'Activo', 'Juan Torres', 4500000, 150000, 3012345678, 'TI'),
('Luis Eduardo', 'Rodríguez Sánchez', 100003, '2022-11-10', 'Temporal', 'Soporte', 'Activo', 'Pedro Suárez', 3000000, 100000, 3023456789, 'Infraestructura'),
('Diana Carolina', 'Ramírez López', 100004, '2021-09-05', 'Indefinido', 'Gerente', 'Activo', 'N/A', 7000000, 233333, 3034567890, 'Administración'),
('Jorge Alberto', 'Martínez Díaz', 100005, '2020-03-18', 'Indefinido', 'Ingeniero', 'Activo', 'Diana Ramírez', 5500000, 183333, 3045678901, 'TI'),
('Sofía Isabel', 'Hernández Castro', 100006, '2023-07-22', 'Fijo', 'Técnico', 'Activo', 'Jorge Martínez', 3500000, 116666, 3056789012, 'Soporte'),
('Ricardo Antonio', 'Torres Vega', 100007, '2024-02-10', 'Indefinido', 'Desarrollador', 'Activo', 'María Gómez', 4800000, 160000, 3067890123, 'TI'),
('Camila Alejandra', 'Vargas Pineda', 100008, '2021-11-30', 'Indefinido', 'Líder de Proyecto', 'Activo', 'Carlos Pérez', 6500000, 216666, 3078901234, 'Proyectos'),
('Felipe Andrés', 'López Méndez', 100009, '2019-06-25', 'Fijo', 'Analista', 'Activo', 'Sofía Hernández', 4200000, 140000, 3089012345, 'TI'),
('Andrea Valentina', 'Jiménez Castaño', 100010, '2022-04-14', 'Indefinido', 'Diseñador UX', 'Activo', 'Felipe López', 4600000, 153333, 3090123456, 'Diseño'),
('Juan Sebastián', 'Muñoz Ríos', 100011, '2023-09-12', 'Temporal', 'Community Manager', 'Activo', 'Andrea Jiménez', 3200000, 106666, 3101234567, 'Marketing'),
('Gabriela Juliana', 'Soto Vargas', 100012, '2020-02-28', 'Fijo', 'Contador', 'Activo', 'Diana Ramírez', 5800000, 193333, 3112345678, 'Contabilidad'),
('José Alejandro', 'Cardona Nieto', 100013, '2021-05-10', 'Indefinido', 'Soporte Técnico', 'Activo', 'Luis Rodríguez', 3400000, 113333, 3123456789, 'Infraestructura'),
('Natalia Beatriz', 'Montoya Fernández', 100014, '2018-08-07', 'Indefinido', 'Gerente de TI', 'Activo', 'Jorge Martínez', 7200000, 240000, 3134567890, 'TI'),
('Hugo Fernando', 'Acosta Beltrán', 100015, '2022-12-05', 'Temporal', 'Asesor Comercial', 'Activo', 'Camila Vargas', 3700000, 123333, 3145678901, 'Ventas'),
('Verónica Estefanía', 'Cárdenas Gil', 100016, '2019-10-15', 'Fijo', 'Consultor', 'Activo', 'Felipe López', 5200000, 173333, 3156789012, 'Consultoría'),
('Raúl Iván', 'Mendoza Gutiérrez', 100017, '2021-01-20', 'Indefinido', 'Desarrollador Senior', 'Activo', 'Ricardo Torres', 6000000, 200000, 3167890123, 'TI'),
('Patricia Luz', 'González Duarte', 100018, '2023-03-11', 'Fijo', 'Reclutador', 'Activo', 'Gabriela Soto', 3900000, 130000, 3178901234, 'Recursos Humanos'),
('Diego Andrés', 'Patiño Escobar', 100019, '2020-06-08', 'Indefinido', 'Arquitecto de Software', 'Activo', 'Raúl Mendoza', 7500000, 250000, 3189012345, 'TI'),
('Clara Marcela', 'Ruiz Quintero', 100020, '2017-12-14', 'Indefinido', 'CEO', 'Activo', 'N/A', 9000000, 300000, 3190123456, 'Alta Dirección');



UPDATE empresas SET id_empleado = 1 WHERE id_empresa = 1;
UPDATE empresas SET id_empleado = 2 WHERE id_empresa = 2;




INSERT INTO seguridad_social (eps, arl, fondo_pension, caja_compensacion, id_empleado)
VALUES 
('Sura', 'Colpatria', 'Protección', 'Comfama', 1),
('Sanitas', 'Sura', 'Colfondos', 'Cafam', 2),
('Nueva EPS', 'Bolívar', 'Porvenir', 'Compensar', 3),
('Compensar', 'Bolívar', 'Porvenir', 'Colsubsidio', 4),
('Coomeva', 'Positiva', 'Old Mutual', 'Cajasan', 5),
('Famisanar', 'Liberty', 'Horizonte', 'Comfama', 6),
('Aliansalud', 'Sura', 'Colpatria', 'Compensar', 7),
('Salud Total', 'Bolívar', 'Skandia', 'Cafam', 8),
('Sanitas', 'Axa Colpatria', 'Porvenir', 'Comfandi', 9),
('Nueva EPS', 'Mapfre', 'Colfondos', 'Cajacopi', 10),
('Coomeva', 'Bolívar', 'Old Mutual', 'Comfenalco', 11),
('Famisanar', 'Liberty', 'Protección', 'Colsubsidio', 12),
('Aliansalud', 'Sura', 'Colpatria', 'Compensar', 13),
('Salud Total', 'Bolívar', 'Skandia', 'Cafam', 14),
('Sanitas', 'Axa Colpatria', 'Porvenir', 'Comfandi', 15),
('Nueva EPS', 'Mapfre', 'Colfondos', 'Cajacopi', 16),
('Coomeva', 'Bolívar', 'Old Mutual', 'Comfenalco', 17),
('Famisanar', 'Liberty', 'Protección', 'Colsubsidio', 18),
('Aliansalud', 'Sura', 'Colpatria', 'Compensar', 19),
('Salud Total', 'Bolívar', 'Skandia', 'Cafam', 20);



INSERT INTO seguridad_social
  (eps, arl, fondo_pension, caja_compensacion, id_empleado)
VALUES
  ('Sura',        'Colpatria',    'Protección',    'Comfama',    67),
  ('Sanitas',     'Sura',         'Colfondos',     'Cafam',      68),
  ('Nueva EPS',   'Bolívar',      'Porvenir',      'Compensar',  69),
  ('Compensar',   'Bolívar',      'Porvenir',      'Colsubsidio',70),
  ('Coomeva',     'Positiva',     'Old Mutual',    'Cajasan',    71),
  ('Famisanar',   'Liberty',      'Horizonte',     'Comfama',    72),
  ('Aliansalud',  'Sura',         'Colpatria',     'Compensar',  73),
  ('Salud Total', 'Bolívar',      'Skandia',       'Cafam',      74),
  ('Sanitas',     'Axa Colpatria','Porvenir',      'Comfandi',   75),
  ('Nueva EPS',   'Mapfre',       'Colfondos',     'Cajacopi',   76),
  ('Coomeva',     'Bolívar',      'Old Mutual',    'Comfenalco', 77),
  ('Famisanar',   'Liberty',      'Protección',    'Colsubsidio',78),
  ('Aliansalud',  'Sura',         'Colpatria',     'Compensar',  79),
  ('Salud Total', 'Bolívar',      'Skandia',       'Cafam',      80),
  ('Sanitas',     'Axa Colpatria','Porvenir',      'Comfandi',   81),
  ('Nueva EPS',   'Mapfre',       'Colfondos',     'Cajacopi',   82),
  ('Coomeva',     'Bolívar',      'Old Mutual',    'Comfenalco', 83),
  ('Famisanar',   'Liberty',      'Protección',    'Colsubsidio',84),
  ('Aliansalud',  'Sura',         'Colpatria',     'Compensar',  85),
  ('Salud Total', 'Bolívar',      'Skandia',       'Cafam',      86);
