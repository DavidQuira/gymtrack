const { generarRutinaIA } = require('../services/ia.service');

const generarRutina = async (req, res) => {

    try {

        const usuario_id = req.usuario.id;

        const respuesta = await generarRutinaIA(usuario_id);

        return res.status(200).json(respuesta);

    } catch (error) {

        console.error('Error al generar la rutina:', error);

        return res.status(500).json({
            message: 'Error al generar la rutina'
        });

    }

};

module.exports = {
    generarRutina
};