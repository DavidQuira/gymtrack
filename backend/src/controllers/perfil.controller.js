const crearPerfil = (req, res) => {

    const usuario_id = req.usuario.id;

    return res.json({
        mensaje: 'Llegué al controlador de perfil',
        usuario_id
    });

};

module.exports = {
    crearPerfil
};