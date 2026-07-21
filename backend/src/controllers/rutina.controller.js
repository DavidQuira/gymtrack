const { obtenerRutinas } = require('../services/rutina.service');

const listarRutinas = async (req, res) => {

    try {

        const usuario_id = req.usuario.id;

        const rutinas = await obtenerRutinas(usuario_id);

        return res.status(200).json(rutinas);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: 'Error al obtener las rutinas.'
        });

    }

};

module.exports = {
    listarRutinas
};