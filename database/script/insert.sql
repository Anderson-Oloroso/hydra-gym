USE hydra_gym;

-- ===================================================
-- 1. CATÁLOGOS BASE
-- ===================================================
INSERT INTO nivel_entrenamiento (nombre, descripcion) VALUES
('Principiante', 'Adaptación anatómica, aprendizaje técnica de ejercicios base y acondicionamiento general.'),
('Intermedio', 'Hipertrofia e incremento de fuerza con mayor volumen e intensidad de carga.'),
('Avanzado', 'Rutinas especializadas de alta intensidad, periodización y optimización de rendimiento.');

INSERT INTO categoria_financiera (nombre, tipo, descripcion) VALUES
('Membresía Mensual', 'ingreso', 'Cobro periódico por concepto de planes de entrenamiento.'),
('Venta de Suplementos', 'ingreso', 'Ingresos por venta de proteína, creatina, pre-entrenos y aminoácidos.'),
('Entrenamiento Personalizado', 'ingreso', 'Sesiones 1 a 1 de asesoría y técnica personalizada.'),
('Venta de Bebidas y Snacks', 'ingreso', 'Ingresos por bebidas isotónicas, barras energéticas y agua.'),
('Mantenimiento de Equipo', 'egreso', 'Reparación y servicio preventivo de maquinaria del gimnasio.'),
('Pago de Servicios Básicos', 'egreso', 'Pago mensual de agua, electricidad, internet y teléfono.'),
('Pago de Alquiler de Local', 'egreso', 'Arrendamiento del inmueble comercial del gimnasio.'),
('Pago de Nómina / Entrenadores', 'egreso', 'Honorarios y salarios para entrenadores y personal de staff.');

INSERT INTO momento_comida (nombre) VALUES
('Desayuno'),
('Colación Mañana'),	
('Almuerzo'),
('Colación Tarde'),
('Cena');

-- ===================================================
-- 2. ENTIDADES PRINCIPALES
-- ===================================================
INSERT INTO clientes (dpi, nombre, apellido, correo, activo, fecha_registro) VALUES
('2541987650101', 'Carlos', 'Mendoza', 'carlos.mendoza@email.com', TRUE, '2026-01-10 08:30:00'),
('3012457890101', 'Ana', 'García', 'ana.garcia@email.com', TRUE, '2026-01-15 10:15:00'),
('1890234560101', 'Luis', 'Hernández', 'luis.hernandez@email.com', TRUE, '2026-02-01 14:00:00'),
('2765432100101', 'Sofía', 'López', 'sofia.lopez@email.com', FALSE, '2026-02-10 11:45:00'),
('3123456780101', 'Diego', 'Ramírez', 'diego.ramirez@email.com', TRUE, '2026-02-15 09:00:00'),
('2987654320101', 'María', 'Fernández', 'maria.fernandez@email.com', TRUE, '2026-02-20 16:30:00'),
('1765432190101', 'Javier', 'Castillo', 'javier.castillo@email.com', TRUE, '2026-03-01 10:00:00'),
('2456789010101', 'Valeria', 'Morales', 'valeria.morales@email.com', TRUE, '2026-03-05 15:20:00');

INSERT INTO plan_entrenamiento (id_nivel, nombre_plan, metas_fisicas, duracion_dias, precio, activo) VALUES
(1, 'Acondicionamiento 30D', 'Pérdida de grasa inicial y mejora de resistencia aeróbica.', 30, 250.00, TRUE),
(2, 'Hipertrofia Torso-Pierna', 'Ganancia de masa muscular enfocada en sobrecarga progresiva.', 60, 450.00, TRUE),
(3, 'Fuerza y Potencia 90D', 'Aumento de marcas en levantamientos principales y definición.', 90, 650.00, TRUE),
(2, 'Definición y Pérdida Grasa 45D', 'Reducción de porcentaje graso y mantenimiento de masa muscular.', 45, 375.00, TRUE),
(3, 'Powerlifting Avanzado 120D', 'Periodización de fuerza máxima para sentadilla, banca y peso muerto.', 120, 800.00, TRUE),
(1, 'Calistenia y Movilidad 30D', 'Desarrollo de fuerza con peso corporal, control postural y flexibilidad.', 30, 200.00, TRUE);

-- ===================================================
-- 3. ASIGNACIONES Y CONTRATOS
-- ===================================================
INSERT INTO cliente_plan_entrenamiento (id_cliente, id_plan, fecha_inicio, fecha_fin, estado, fecha_asigncion) VALUES
(1, 2, '2026-02-01', '2026-04-02', 'activo', '2026-02-01 09:00:00'),
(2, 1, '2026-02-15', '2026-03-17', 'activo', '2026-02-15 10:30:00'),
(3, 3, '2026-01-01', '2026-04-01', 'completado', '2026-01-01 08:00:00'),
(5, 4, '2026-02-20', '2026-04-06', 'activo', '2026-02-20 09:30:00'),
(6, 1, '2026-03-01', '2026-03-31', 'activo', '2026-03-01 16:45:00'),
(7, 5, '2026-03-05', '2026-07-03', 'activo', '2026-03-05 10:15:00'),
(8, 6, '2026-03-10', '2026-04-09', 'activo', '2026-03-10 15:30:00');

INSERT INTO contrato (id_cliente_plan, condiciones, duracion_dias, precio, fecha_inicio, fecha_fin) VALUES
(1, 'El cliente acepta el reglamento interno. Incluye evaluación física quincenal.', 60, 450.00, '2026-02-01 09:00:00', '2026-04-02 23:59:59'),
(2, 'Acceso ilimitado a área de pesas y cardio de lunes a sábado.', 30, 250.00, '2026-02-15 10:30:00', '2026-03-17 23:59:59'),
(3, 'Contrato trimestral con asesoría de plan nutricional personalizada.', 90, 650.00, '2026-01-01 08:00:00', '2026-04-01 23:59:59'),
(4, 'Plan intensivo con monitoreo semanal de medidas y pliegues cutáneos.', 45, 375.00, '2026-02-20 09:30:00', '2026-04-06 23:59:59'),
(5, 'Acceso matutino y vespertino de lunes a viernes.', 30, 250.00, '2026-03-01 16:45:00', '2026-03-31 23:59:59'),
(6, 'Acceso total a área de barras olímpicas, plataformas y racks.', 120, 800.00, '2026-03-05 10:15:00', '2026-07-03 23:59:59'),
(7, 'Incluye uso de sala de calistenia, anillas y barras paralelas.', 30, 200.00, '2026-03-10 15:30:00', '2026-04-09 23:59:59');

-- ===================================================
-- 4. SEGUIMIENTO FÍSICO
-- ===================================================
INSERT INTO seguimiento_fisico (id_cliente_plan, semana, fecha_registro, peso_kg, grasa_corporal, altura_cm, fotos, comentarios) VALUES
(1, 1, '2026-02-01', 82.50, 22.40, 175.00, 'fotos/cli1_sem1.jpg', 'Evaluación inicial, buena movilidad de cadera.'),
(1, 2, '2026-02-15', 81.20, 21.80, 175.00, 'fotos/cli1_sem2.jpg', 'Reducción de medidas en cintura, adaptación positiva.'),
(1, 4, '2026-03-01', 80.50, 20.90, 175.00, 'fotos/cli1_sem4.jpg', 'Incremento notorio de fuerza en press de banca y sentadilla.'),
(2, 1, '2026-02-15', 64.00, 28.50, 162.00, 'fotos/cli2_sem1.jpg', 'Inicio de plan de acondicionamiento general.'),
(2, 2, '2026-03-01', 63.10, 27.80, 162.00, 'fotos/cli2_sem2.jpg', 'Mejora en resistencia cardiovascular.'),
(4, 1, '2026-02-20', 88.00, 24.50, 180.00, 'fotos/cli5_sem1.jpg', 'Inicio de fase de definición, registro de medidas base.'),
(4, 3, '2026-03-06', 86.40, 23.20, 180.00, 'fotos/cli5_sem3.jpg', 'Excelente progreso en control calórico y pérdida de grasa.'),
(5, 1, '2026-03-01', 58.00, 26.00, 160.00, 'fotos/cli6_sem1.jpg', 'Evaluación inicial, buena postura en ejercicios libres.'),
(6, 1, '2026-03-05', 94.00, 19.50, 183.00, 'fotos/cli7_sem1.jpg', 'Test de 1RM realizado en sentadilla (150kg) y peso muerto (180kg).');

-- ===================================================
-- 5. PLANES DE NUTRICIÓN Y DETALLES DE COMIDAS
-- ===================================================
INSERT INTO plan_nutricion (id_cliente_plan, nombre, descripcion) VALUES
(1, 'Normocalórica Deportiva', 'Enfocada en recomposición corporal con alto aporte proteico (2g/kg).'),
(2, 'Déficit Calórico Moderado', 'Diseñada para reducir porcentaje de grasa manteniendo masa magra.'),
(4, 'Definición Alta Proteína', 'Déficit calórico estructurado con ciclado de carbohidratos.'),
(6, 'Superávit Calórico de Fuerza', 'Dieta hipercalórica rica en carbohidratos complejos para rendimiento en powerlifting.');

INSERT INTO detalle_comida_diaria (id_plan_nutricion, id_momento, dia_semana, alimento, calorias_estimadas) VALUES
(1, 1, 'lunes', '4 claras de huevo, 2 rebanadas de pan integral y 1/2 aguacate', 420),
(1, 2, 'lunes', 'Batido de proteína whey con 1 plátano y 20g de almendras', 320),
(1, 3, 'lunes', '200g de pechuga de pollo a la plancha, 150g de arroz integral y ensalada verde', 650),
(1, 4, 'lunes', 'Yogur griego natural con 30g de nueces', 230),
(1, 5, 'lunes', '180g de filete de salmón con espárragos al vapor', 500),
(2, 1, 'martes', 'Avena cocida en agua con proteína en polvo y frutos rojos', 350),
(2, 3, 'martes', '180g de carne magra picada con verduras al wok y quinoa', 550),
(2, 5, 'martes', 'Omelette de 3 claras con espinaca y queso panela', 280),
(3, 1, 'miércoles', 'Tostadas de pan de centeno con aguacate, tomate y 150g de atún al agua', 400),
(3, 3, 'miércoles', '220g de pechuga de pavo con boniato asado y brócoli al vapor', 580),
(3, 5, 'miércoles', 'Ensalada tibia de pollo desmenuzado con semillas de chía y vinagreta ligera', 360),
(4, 1, 'jueves', 'Tortilla de 5 huevos enteros con avena, miel y frutos secos', 750),
(4, 3, 'jueves', '250g de lomo de res con 200g de pasta integral y salsa de tomate natural', 850),
(4, 5, 'jueves', 'Arroz con leche casero con proteína en polvo y mantequilla de maní', 600);

-- ===================================================
-- 6. GESTIÓN FINANCIERA (INGRESOS Y EGRESOS)
-- ===================================================
INSERT INTO gestion_financiera (id_categoria, id_cliente, monto, fecha_transaccion, descripcion) VALUES
(1, 1, 450.00, '2026-02-01 09:15:00', 'Pago de membresía Hipertrofia Torso-Pierna - Carlos Mendoza'),
(1, 2, 250.00, '2026-02-15 10:35:00', 'Pago de membresía Acondicionamiento 30D - Ana García'),
(1, 3, 650.00, '2026-01-01 08:15:00', 'Pago de membresía Fuerza y Potencia 90D - Luis Hernández'),
(1, 5, 375.00, '2026-02-20 09:40:00', 'Pago de membresía Definición 45D - Diego Ramírez'),
(1, 6, 250.00, '2026-03-01 16:50:00', 'Pago de membresía Acondicionamiento 30D - María Fernández'),
(1, 7, 800.00, '2026-03-05 10:20:00', 'Pago de membresía Powerlifting 120D - Javier Castillo'),
(1, 8, 200.00, '2026-03-10 15:35:00', 'Pago de membresía Calistenia 30D - Valeria Morales'),
(2, 1, 320.00, '2026-02-05 11:30:00', 'Venta de Proteína Whey Isolada 2lbs a Carlos Mendoza'),
(2, 5, 150.00, '2026-02-22 17:00:00', 'Venta de Creatina Creapure 300g a Diego Ramírez'),
(2, 7, 220.00, '2026-03-07 11:15:00', 'Venta de Pre-entreno de alta intensidad a Javier Castillo'),
(3, 2, 180.00, '2026-02-18 09:00:00', 'Sesión 1 a 1 de técnica de sentadilla y peso muerto - Ana García'),
(3, 6, 180.00, '2026-03-04 17:00:00', 'Sesión 1 a 1 de acondicionamiento físico - María Fernández'),
(4, NULL, 45.00, '2026-02-10 14:20:00', 'Venta de bebidas hidratantes y barras proteicas (caja chica)'),
(4, NULL, 75.00, '2026-03-02 18:40:00', 'Venta de bebidas energéticas en mostrador'),
(5, NULL, 350.00, '2026-02-05 16:20:00', 'Reparación de poleas y cables en máquina multifuncional'),
(5, NULL, 480.00, '2026-03-03 12:00:00', 'Engrase, calibración y cambio de rodamientos en caminadoras'),
(6, NULL, 620.00, '2026-02-02 11:00:00', 'Pago de suministro eléctrico e iluminación LED del gimnasio'),
(6, NULL, 280.00, '2026-02-04 10:15:00', 'Pago del servicio de agua potable y recolección'),
(6, NULL, 300.00, '2026-02-10 15:00:00', 'Pago de servicio de internet de alta velocidad y telefonía'),
(7, NULL, 2500.00, '2026-02-01 08:00:00', 'Pago mensual de arrendamiento del local comercial Hydra Gym'),
(7, NULL, 2500.00, '2026-03-01 08:00:00', 'Pago mensual de arrendamiento del local comercial Hydra Gym'),
(8, NULL, 1800.00, '2026-02-28 17:00:00', 'Pago quincenal a entrenadores de planta y personal de limpieza'),
(8, NULL, 1800.00, '2026-03-15 17:00:00', 'Pago quincenal a entrenadores de planta y personal de limpieza');