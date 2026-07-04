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

module.exports = {
    crearPerfil
};