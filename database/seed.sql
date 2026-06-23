-- Inserción de los objetivos por defecto de la plataforma
INSERT INTO objetivos (nombre) VALUES
('Perder grasa'),
('Ganar masa muscular'),
('Recomposición corporal'),
('Ganar fuerza'),
('Salud general'),
('Rendimiento deportivo');

-- Carga inicial de la biblioteca organizada por grupos musculares
INSERT INTO ejercicios (nombre, grupo_muscular, descripcion, nivel) VALUES
-- PECHO
('Press banca', 'Pecho', 'Ejercicio compuesto multiarticular para el desarrollo del pectoral mayor, tríceps y deltoides anterior', 'intermedio'),
('Press inclinado con mancuernas', 'Pecho', 'Empuje multiarticular con inclinación enfocado en el haz clavicular (zona alta) del pectoral', 'intermedio'),
('Aperturas en máquina', 'Pecho', 'Ejercicio de aislamiento para pectoral en máquina contractor (Pec Deck) que maximiza el estímulo en aducción', 'principiante'),
('Fondos en paralelas', 'Pecho', 'Movimiento compuesto de empuje enfocado en la parte inferior del pectoral y tríceps', 'intermedio'),
-- ESPALDA
('Remo con barra', 'Espalda', 'Ejercicio de tirón horizontal libre para dar densidad a la espalda alta y dorsal ancho', 'intermedio'),
('Jalón al pecho en máquina', 'Espalda', 'Movimiento de tirón vertical ideal para el desarrollo del dorsal ancho y amplitud de la espalda', 'principiante'),
('Remo agarre abierto', 'Espalda', 'Variación de remo en polea o máquina que enfatiza el trabajo en los trapecios, romboides y deltoides posterior', 'intermedio'),
('Remo unilateral para dorsales', 'Espalda', 'Remo a una mano en polea o con mancuerna enfocado en optimizar el recorrido y contracción del dorsal', 'intermedio'),
('Remo en T', 'Espalda', 'Ejercicio compuesto de tracción horizontal apoyado que aporta gran densidad a toda la espalda', 'intermedio'),
-- PIERNAS
('Sentadilla', 'Piernas', 'Ejercicio básico y fundamental de empuje de piernas enfocado en cuádriceps y glúteos', 'intermedio'),
('Curl femoral sentado', 'Piernas', 'Aislamiento en máquina enfocado en la flexión de rodilla para trabajar la musculatura isquiosural', 'principiante'),
('Prensa de piernas', 'Piernas', 'Ejercicio compuesto en máquina que permite mover cargas pesadas para cuádriceps, glúteos e isquiotibiales', 'principiante'),
('Extensión de cuádriceps', 'Piernas', 'Ejercicio analítico y de aislamiento en máquina ideal para fatigar los cuádriceps de forma segura', 'principiante'),
('Elevación de talones', 'Piernas', 'Ejercicio de aislamiento enfocado en el desarrollo de los gemelos y el sóleo en la pantorrilla', 'principiante'),
('Peso muerto con mancuernas', 'Piernas', 'Movimiento bisagra de cadera ideal para trabajar la cadena posterior, isquiotibiales y glúteos', 'intermedio'),
-- ABDOMEN
('Crunch abdominal', 'Abdomen', 'Flexión de tronco básica sobre suelo o colchoneta para el estímulo directo del recto abdominal', 'principiante'),
-- BÍCEPS
('Curl predicador', 'Bíceps', 'Ejercicio de aislamiento para bíceps que elimina el balanceo al apoyar los brazos en el banco', 'principiante'),
('Curl de bíceps en banco inclinado', 'Bíceps', 'Flexión de codo que pone énfasis en la cabeza larga del bíceps debido a la posición de estiramiento inicial', 'intermedio'),
('Curl Bayesian', 'Bíceps', 'Curl de bíceps de espaldas a la polea baja, manteniendo una tensión constante durante todo el rango de movimiento', 'avanzado'),
('Curl martillo', 'Bíceps', 'Flexión de codo con agarre neutro para enfatizar el desarrollo del braquiorradial y braquial anterior', 'principiante'),
-- TRÍCEPS
('Extensiones en polea alta', 'Tríceps', 'Ejercicio de aislamiento con cuerda o barra para trabajar de forma directa la musculatura del tríceps', 'principiante'),
('Rompecráneos con barra Z', 'Tríceps', 'Extensión de codo tumbado en banco plano o inclinado que genera un gran estímulo en la cabeza larga del tríceps', 'intermedio'),
-- HOMBRO
('Elevaciones laterales', 'Hombro', 'Aislamiento con mancuernas enfocado en el estímulo del deltoides medio para dar amplitud', 'principiante'),
('Press militar', 'Hombro', 'Empuje vertical con barra que trabaja el deltoides anterior, trapecios y la estabilidad del core', 'intermedio'),
('Face pull', 'Hombro', 'Ejercicio con polea alta hacia la cara para el deltoides posterior, rotadores y salud escapular', 'principiante');

-- Inserción de los sistemas de entrenamiento predefinidos
INSERT INTO plantillas_rutina (nombre, descripcion, dias) VALUES
('Push Pull Legs', 'División clásica que agrupa los músculos por patrones de movimiento: empuje (pecho, hombros, tríceps), jalón (espalda, bíceps) y un día exclusivo para el tren inferior.', 3),
('Upper Lower', 'Enfoque eficiente que divide el entrenamiento en sesiones dedicadas exclusivamente al tren superior (torso) y al tren inferior (piernas y core), ideal para un buen balance.', 4),
('Full Body', 'Entrenamiento de cuerpo completo en cada sesión, diseñado para estimular todos los grupos musculares principales mediante ejercicios compuestos, ideal para optimizar el tiempo.', 3),
('Torso Pierna', 'Rutina de alta frecuencia que alterna días enfocados en la musculatura del tronco (pecho, espalda, hombros) con días específicos para el desarrollo del tren inferior.', 4),
('Arnold Split', 'Distribución clásica enfocada en la estética que empareja pecho/espalda, hombros/brazos y piernas, permitiendo un alto volumen de trabajo para antagonistas.', 5),
('Bro Split', 'Rutina tradicional de culturismo que dedica una sesión exclusiva a un solo grupo muscular por día (ej. pecho, espalda, piernas, hombros, brazos) para una máxima congestión.', 5);
