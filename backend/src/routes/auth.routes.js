const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');

const {
    register,
    login
} = require('../controllers/auth.controller');

router.get(
    '/perfil',
    verificarToken,
    (req, res) => {

        res.json({
            message: 'Ruta protegida',
            usuario: req.usuario
        });

    }
);
    router.post('/register', register);
    router.post('/login', login);

module.exports = router;