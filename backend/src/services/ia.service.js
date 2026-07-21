const pool = require('../config/db');
const openRouter = require('../config/openrouter');

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
        tipo,
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
        dias_min,
        dias_max
        FROM plantillas_rutina
        ORDER BY dias_min, nombre
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

    - Selecciona la plantilla más adecuada según el perfil del usuario.
    - Utiliza únicamente los ejercicios proporcionados.
    - No inventes ejercicios.
    - Utiliza el tipo de ejercicio proporcionado (Compuesto o Aislamiento) únicamente para decidir el orden.
    - Los ejercicios compuestos deben ir al inicio de la sesión.
    - Los ejercicios de aislamiento deben ir al final.
    - Cada día debe contener entre 5 y 7 ejercicios.
    - Los ejercicios compuestos deben tener máximo 3 series.
    - Los ejercicios de aislamiento deben tener entre 2 y 3 series.
    - El descanso para ejercicios compuestos es de 3 minutos.
    - El descanso para ejercicios de aislamiento es de 2 minutos.
    - El descanso debe devolverse como un número entero (2 o 3), nunca como texto.
    - Los nombres de los días deben ser únicos (ejemplo: Upper 1, Lower 1, Upper 2, Lower 2).
    - La rutina debe ser segura y coherente con el nivel del usuario.


    ### ejercicios disponibles: 

    ${contexto.ejercicios.map(e =>
        `- ${e.nombre} | Grupo: ${e.grupo_muscular} | Tipo: ${e.tipo}`
    ).join('\n')}


    ### plantillas disponibles:
    ${contexto.plantillas.map(p => `- ${p.nombre}: ${p.descripcion} (${p.dias_min}-${p.dias_max} días)`).join('\n')}


   
    ### Formato de respuesta

    Responde únicamente con un objeto JSON válido.

    Cada ejercicio debe tener exactamente esta estructura:

    EJEMPLO:

    {
    "nombre": "Press banca",
    "tipo": "Compuesto",
    "series": 3,
    "reps_min": 8,
    "reps_max": 12,
    "descanso": 3
    }

    El campo "tipo" debe ser exactamente "Compuesto" o "Aislamiento", utilizando únicamente el valor proporcionado en la lista de ejercicios.


    No incluyas explicaciones.

    No escribas texto fuera del JSON.

    No uses Markdown.

    Todas las claves deben llevar comillas dobles.


    La respuesta completa debe seguir esta estructura:

    EJEMPLO:

{
  "rutina": {
    "plantilla": "Upper Lower",
    "dias": [
      {
        "dia": "Upper 1",
        "ejercicios": [
          {
            "nombre": "Press banca",
            "tipo": "Compuesto",
            "series": 3,
            "reps_min": 8,
            "reps_max": 12,
            "descanso": 3
          }
        ]
      }
    ]
  }
}

    `;
    const response = await openRouter.post('/chat/completions', {
        "model": "deepseek/deepseek-chat",
        messages: [
            {
                role: 'system',
                content: 'Eres un entrenador personal experto en entrenamiento de fuerza e hipertrofia. Responde únicamente con JSON válido siguiendo exactamente el formato solicitado.'
            },
            {
                role: 'user',
                content: prompt
            }
        ]
    });

    const respuesta = response.data.choices[0].message.content;

    const inicio = respuesta.indexOf("{");
    const fin = respuesta.lastIndexOf("}");

    const json = respuesta.substring(inicio, fin + 1);

    console.log(json);

    const datos = JSON.parse(json);

    await guardarRutinaIA(usuario_id, datos);

    return datos;

};

const guardarRutinaIA = async (usuario_id, rutinaIA) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // Buscar la plantilla utilizada por la IA
        const plantilla = await client.query(
            `
            SELECT id
            FROM plantillas_rutina
            WHERE nombre = $1
            `,
            [rutinaIA.rutina.plantilla]
        );

        // Guardar la rutina
        const rutinaGuardada = await client.query(
            `
            INSERT INTO rutinas_usuario
            (
                usuario_id,
                plantilla_origen_id,
                nombre,
                descripcion,
                generada_por_ia
            )
            VALUES ($1, $2, $3, $4, true)
            RETURNING id
            `,
            [
                usuario_id,
                plantilla.rows[0].id,
                rutinaIA.rutina.plantilla,
                'Rutina generada por IA'
            ]
        );

        const rutina_id = rutinaGuardada.rows[0].id;

        // Recorrer los días
        for (let i = 0; i < rutinaIA.rutina.dias.length; i++) {

            const dia = rutinaIA.rutina.dias[i];

            const diaGuardado = await client.query(
                `
                INSERT INTO dias_rutina_usuario
                (
                    rutina_id,
                    nombre,
                    orden
                )
                VALUES ($1, $2, $3)
                RETURNING id
                `,
                [
                    rutina_id,
                    dia.dia,
                    i + 1
                ]
            );

            const dia_rutina_id = diaGuardado.rows[0].id;

            // Recorrer ejercicios del día
            for (let j = 0; j < dia.ejercicios.length; j++) {

                const ejercicio = dia.ejercicios[j];

                const ejercicioDB = await client.query(
                    `
                    SELECT id
                    FROM ejercicios
                    WHERE nombre = $1
                    `,
                    [ejercicio.nombre]
                );

                if (ejercicioDB.rows.length === 0) {
                    throw new Error(`No existe el ejercicio: ${ejercicio.nombre}`);
                }

                await client.query(
                    `
                    INSERT INTO ejercicios_rutina_usuario
                    (
                        dia_rutina_id,
                        ejercicio_id,
                        series,
                        reps_min,
                        reps_max,
                        descanso,
                        orden
                    )
                    VALUES ($1,$2,$3,$4,$5,$6,$7)
                    `,
                    [
                        dia_rutina_id,
                        ejercicioDB.rows[0].id,
                        ejercicio.series,
                        ejercicio.reps_min,
                        ejercicio.reps_max,
                        ejercicio.descanso,
                        j + 1
                    ]
                );
            }
        }

        await client.query("COMMIT");

        return rutina_id;

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }

};

module.exports = {
    generarRutinaIA,
    obtenerContextoIA,
    guardarRutinaIA
};

