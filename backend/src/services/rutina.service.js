const pool = require('../config/db');

const obtenerRutinas = async (usuario_id) => {

    const resultado = await pool.query(
        `
        SELECT
            id,
            nombre,
            descripcion,
            activa,
            generada_por_ia,
            fecha_creacion
        FROM rutinas_usuario
        WHERE usuario_id = $1
        ORDER BY fecha_creacion DESC
        `,
        [usuario_id]
    );

    return resultado.rows;
};

module.exports = {
    obtenerRutinas
};