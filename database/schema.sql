-- ==========================================
-- EXTENSIONES Y REQUISITOS PREVIOS
-- ==========================================

-- Extensión necesaria para generar identificadores únicos (UUID) de forma segura
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ==========================================
-- BLOQUE 1 — USUARIOS, PERFILES Y PROGRESO FISICO
-- ==========================================

-- Información de inicio de sesión y datos básicos de la cuenta del usuario
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    contrasena VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catálogo global de metas disponibles en la aplicación (p. ej. ganar masa, perder grasa)
CREATE TABLE IF NOT EXISTS objetivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL UNIQUE
);


-- Datos antropométricos, nivel y disponibilidad semanal del usuario vinculados a su objetivo
CREATE TABLE IF NOT EXISTS perfiles_usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    objetivo_id UUID NOT NULL REFERENCES objetivos(id),
    experiencia VARCHAR(50) NOT NULL,
    dias_disponibles INT NOT NULL CHECK (dias_disponibles BETWEEN 2 AND 6),
    altura_cm NUMERIC(5,2),
    edad INT CHECK (edad >= 13),
    sexo VARCHAR(20),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Historial periódico de peso y medidas corporales para realizar el seguimiento del progreso
CREATE TABLE IF NOT EXISTS registros_fisicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    peso_kg NUMERIC(5,2) CHECK (peso_kg >0),
    brazo_izquierdo_cm NUMERIC(5,2) CHECK (brazo_izquierdo_cm > 0),
    brazo_derecho_cm NUMERIC(5,2) CHECK (brazo_derecho_cm > 0),
    pecho_cm NUMERIC(5,2) CHECK (pecho_cm > 0),
    cintura_cm NUMERIC(5,2) CHECK (cintura_cm > 0),
    pierna_izquierda_cm NUMERIC(5,2) CHECK (pierna_izquierda_cm > 0),
    pierna_derecha_cm NUMERIC(5,2) CHECK (pierna_derecha_cm > 0),
    pantorrilla_izquierda_cm NUMERIC(5,2) CHECK (pantorrilla_izquierda_cm > 0),
    pantorrilla_derecha_cm NUMERIC(5,2) CHECK (pantorrilla_derecha_cm > 0),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- BLOQUE 2 — BIBLIOTECA GLOBAL DE EJERCICIOS Y PLANTILLAS Y RUTINAS
-- ==========================================

-- Diccionario maestro de todos los ejercicios que se pueden realizar en la app
CREATE TABLE IF NOT EXISTS ejercicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    grupo_muscular VARCHAR(50) NOT NULL,
    descripcion TEXT,
    nivel VARCHAR(30),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modelos o estructuras predefinidas de rutinas comerciales que ofrece la plataforma
CREATE TABLE IF NOT EXISTS plantillas_rutina (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    dias INT NOT NULL CHECK (dias BETWEEN 2 AND 6),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Define los días específicos de una plantilla (p. ej. "Día 1: Empuje", "Día 2: Tirón")
CREATE TABLE IF NOT EXISTS dias_plantilla (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plantilla_id UUID NOT NULL
	REFERENCES plantillas_rutina(id)
	ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    orden INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vincula los ejercicios que corresponden a cada día de la plantilla con sus series y repeticiones
CREATE TABLE IF NOT EXISTS ejercicios_plantilla (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dia_plantilla_id UUID NOT NULL REFERENCES dias_plantilla(id) ON DELETE CASCADE,
    ejercicio_id UUID NOT NULL REFERENCES ejercicios(id) ON DELETE CASCADE,
    series INT NOT NULL,
    reps_min INT,
    reps_max INT,
    orden INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- BLOQUE 3 — RUTINAS PERSONALIZADAS DEL USUARIO
-- ==========================================

-- Cabecera de la rutina asignada a un usuario específico (puede clonarse de una plantilla)
CREATE TABLE IF NOT EXISTS rutinas_usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    plantilla_origen_id UUID REFERENCES plantillas_rutina(id),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Estructura de días específicos creados o personalizados para la rutina de un usuario
CREATE TABLE IF NOT EXISTS dias_rutina_usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rutina_id UUID NOT NULL REFERENCES rutinas_usuario(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    orden INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ejercicios asignados a los días modificados del usuario con sus objetivos de series/reps
CREATE TABLE IF NOT EXISTS ejercicios_rutina_usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dia_rutina_id UUID NOT NULL REFERENCES dias_rutina_usuario(id) ON DELETE CASCADE,
    ejercicio_id UUID NOT NULL REFERENCES ejercicios(id) ON DELETE CASCADE,
    series INT NOT NULL,
    reps_min INT,
    reps_max INT,
    orden INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- BLOQUE 4 — HISTORIAL DE ENTRENAMIENTOS REALES (LOGS)
-- ==========================================

-- Cabecera que registra el inicio de una sesión de entrenamiento real en el gimnasio
CREATE TABLE IF NOT EXISTS entrenamientos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    rutina_id UUID REFERENCES rutinas_usuario(id),
    dia_rutina VARCHAR(100),
    fecha_entrenamiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ejercicios ejecutados durante la sesión. Guarda un snapshot del nombre para prevenir pérdidas si el original cambia
CREATE TABLE IF NOT EXISTS ejercicios_entrenamiento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entrenamiento_id UUID NOT NULL REFERENCES entrenamientos(id) ON DELETE CASCADE,
    ejercicio_id UUID NOT NULL REFERENCES ejercicios(id) ON DELETE CASCADE,
    nombre_snapshot VARCHAR(100),
    orden INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- El núcleo de las estadísticas: Peso y repeticiones reales levantadas en cada serie individual
CREATE TABLE IF NOT EXISTS series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ejercicio_entrenamiento_id UUID NOT NULL REFERENCES ejercicios_entrenamiento(id) ON DELETE CASCADE,
    serie_numero INT NOT NULL CHECK (serie_numero >0),
    peso NUMERIC(5,2) CHECK (peso >0),
    repeticiones INT NOT NULL CHECK (repeticiones > 0),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);