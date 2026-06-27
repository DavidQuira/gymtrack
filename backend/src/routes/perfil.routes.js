const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/auth.middleware');

const {
    crearPerfil
} = require('../controllers/perfil.controller');

router.post(
    '/',
    verificarToken,
    crearPerfil
);

module.exports = router;