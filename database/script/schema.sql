DROP DATABASE IF EXISTS hydra_gym;
CREATE DATABASE IF NOT EXISTS hydra_gym;
USE hydra_gym;

CREATE TABLE nivel_entrenamiento (
    id_nivel INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE categoria_financiera (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('ingreso', 'egreso') NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE momento_comida (
    id_momento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    dpi VARCHAR(13) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE plan_entrenamiento (
    id_plan INT AUTO_INCREMENT PRIMARY KEY,
    id_nivel INT NOT NULL,
    nombre_plan VARCHAR(100) NOT NULL,
    metas_fisicas TEXT,
    duracion_dias INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_nivel) REFERENCES nivel_entrenamiento(id_nivel) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE cliente_plan_entrenamiento (
    id_cliente_plan INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_plan INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado ENUM('activo', 'cancelado', 'completado', 'pendiente') NOT NULL DEFAULT 'activo',
    fecha_asigncion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_plan) REFERENCES plan_entrenamiento(id_plan) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE contrato (
    id_contrato INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente_plan INT NOT NULL UNIQUE,
    condiciones TEXT,
    duracion_dias INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    FOREIGN KEY (id_cliente_plan) REFERENCES cliente_plan_entrenamiento(id_cliente_plan) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE seguimiento_fisico (
    id_seguimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente_plan INT NOT NULL,
    semana INT NOT NULL,
    fecha_registro DATE NOT NULL,
    peso_kg DECIMAL(5,2) NOT NULL,
    grasa_corporal DECIMAL(4,2),
    altura_cm DECIMAL(5,2),
    fotos VARCHAR(255),
    comentarios VARCHAR(255),
    FOREIGN KEY (id_cliente_plan) REFERENCES cliente_plan_entrenamiento(id_cliente_plan) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE plan_nutricion (
    id_plan_nutricion INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente_plan INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    FOREIGN KEY (id_cliente_plan) REFERENCES cliente_plan_entrenamiento(id_cliente_plan) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE detalle_comida_diaria (
    id_comida INT AUTO_INCREMENT PRIMARY KEY,
    id_plan_nutricion INT NOT NULL,
    id_momento INT NOT NULL,
    dia_semana ENUM('lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo') NOT NULL,
    alimento VARCHAR(150) NOT NULL,
    calorias_estimadas INT,
    FOREIGN KEY (id_plan_nutricion) REFERENCES plan_nutricion(id_plan_nutricion) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_momento) REFERENCES momento_comida(id_momento) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE gestion_financiera (
    id_gestion INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    id_cliente INT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_transaccion DATETIME DEFAULT CURRENT_TIMESTAMP,
    descripcion VARCHAR(255),
    FOREIGN KEY (id_categoria) REFERENCES categoria_financiera(id_categoria) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE SET NULL ON UPDATE CASCADE
);