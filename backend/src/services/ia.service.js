const pool = require('../config/db');

const obtenerContextoIA = async (usuario_id) => {
    const perfil = await pool.query(
        `
    SELECT
        objetivos.nombre AS objetivo,
        experiencia,
        dias_disponibles,
        altura_cm,
        edad,
        sexo
    FROM perfiles_usuario
    INNER JOIN objetivos
    ON perfiles_usuario.objetivo_id = objetivos.id
    WHERE perfiles_usuario.usuario_id = $1
    `,
        [usuario_id]
    );

    const ejercicios = await pool.query(
        `
    SELECT 
        nombre,
        grupo_muscular,
        nivel
    FROM ejercicios
    ORDER BY grupo_muscular, nombre
    `
    );

    const plantillas = await pool.query(
        `
    SELECT 
        nombre,
        descripcion,
        dias
        FROM plantillas_rutina
        ORDER BY dias, nombre
    `
    );



    const contexto = {
        perfil: perfil.rows[0],
        plantillas: plantillas.rows,
        ejercicios: ejercicios.rows

    };

    return contexto;


};



const generarRutinaIA = async (usuario_id) => {

    const contexto = await obtenerContextoIA(usuario_id);


    const prompt = `
   Eres un entrenador personal experto en entrenamiento de fuerza y hipertrofia.

   Tu tarea es generar una rutina de entrenamiento personalizada para un usuario
   basado en la información proporcionada.

   ### perfil del usuario:

    objetivo: ${contexto.perfil.objetivo}
    experiencia: ${contexto.perfil.experiencia}
    dias disponibles: ${contexto.perfil.dias_disponibles}
    altura (cm): ${contexto.perfil.altura_cm}
    edad: ${contexto.perfil.edad}
    sexo: ${contexto.perfil.sexo}

    ### reglas para generar la rutina:

    - Selecciona la plantilla más adecuada.
    - Utiliza únicamente los ejercicios proporcionados.
    - No inventes ejercicios.
    - Cada entrenamiento debe contener entre 5 y 7 ejercicios.
    - Prioriza ejercicios compuestos al inicio.
    - Coloca ejercicios de aislamiento al final.
    - La rutina debe ser segura y coherente con el nivel del usuario.


    ### ejercicios disponibles: 

    ${contexto.ejercicios.map(e => `- ${e.nombre} (${e.grupo_muscular})`).join('\n')}


    ### plantillas disponibles:
    ${contexto.plantillas.map(p => `- ${p.nombre}: ${p.descripcion} (${p.dias} días)`).join('\n')}


    ### formato de respuesta:

    - Responde unicamente en formato JSON.

    `;

    return {
        prompt
    };

};

module.exports = {
    generarRutinaIA,
    obtenerContextoIA

};