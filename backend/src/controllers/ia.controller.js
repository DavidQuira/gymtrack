const {
    generarRutinaIA,
    guardarRutinaIA
} = require('../services/ia.service');

const generarRutina = async (req, res) => {

    try {

        const usuario_id = req.usuario.id;

        // Generar la rutina con IA
        const rutinaIA = await generarRutinaIA(usuario_id);

        // Guardarla en la base de datos
        const rutina_id = await guardarRutinaIA(usuario_id, rutinaIA);

        return res.status(200).json({
            message: "Rutina generada correctamente.",
            rutina_id,
            rutina: rutinaIA.rutina
        });

    } catch (error) {

        console.error("Error al generar la rutina:", error);

        return res.status(500).json({
            message: "Error al generar la rutina"
        });

    }

};

module.exports = {
    generarRutina
};