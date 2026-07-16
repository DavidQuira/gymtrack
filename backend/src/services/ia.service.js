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


const contexto = {
    perfil: perfil.rows[0],
    ejercicios: ejercicios.rows

};

return contexto;


};



const generarRutinaIA = async (usuario_id) => {

   const contexto = await obtenerContextoIA(usuario_id);

   return contexto;

};





module.exports = {
    generarRutinaIA,
    obtenerContextoIA

};