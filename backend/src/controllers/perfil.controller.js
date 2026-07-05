const pool = require('../config/db');

const crearPerfil = async (req, res) => {

    const usuario_id = req.usuario.id;

    try {

        const {
            objetivo_id,
            experiencia,
            dias_disponibles,
            altura_cm,
            edad,
            sexo
        } = req.body;




        const perfilExistente = await pool.query(
            `
         SELECT id
         FROM perfiles_usuario
         WHERE usuario_id = $1
         `,
            [usuario_id]
        );

        if (perfilExistente.rows.length > 0) {
            return res.status(409).json({
                message: 'El usuario ya tiene un perfil creado'
            });
        }



        const nuevoPerfil = await pool.query(
            `
    INSERT INTO perfiles_usuario (usuario_id,
         objetivo_id,
         experiencia,
         dias_disponibles,
         altura_cm,
         edad,
         sexo
          )
           VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *
         `,
            [
                usuario_id,
                objetivo_id,
                experiencia,
                dias_disponibles,
                altura_cm,
                edad,
                sexo
            ]
        );


        return res.status(201).json({
            message: 'Perfil creado correctamente',
            perfil: nuevoPerfil.rows[0]
        });

    } catch (error) {
        console.error('Error al crear el perfil:', error);
        return res.status(500).json({
            message: 'Error al crear el perfil'
        });
    }

};


const obtenerPerfil = async (req, res) => {

    const usuario_id = req.usuario.id;

    try {
        const perfil = await pool.query(
            `
        SELECT *
        FROM perfiles_usuario
        WHERE usuario_id = $1
        `,
            [usuario_id]
        );

        if (perfil.rows.length === 0) {
            return res.status(404).json({
                message: 'No se encontró un perfil para este usuario'
            });
        }

        return res.status(200).json({
            message: 'Perfil obtenido correctamente',
            perfil: perfil.rows[0]
        });

    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        return res.status(500).json({
            message: 'Error al obtener el perfil'
        });
    }


}


module.exports = {
    crearPerfil,
    obtenerPerfil
};