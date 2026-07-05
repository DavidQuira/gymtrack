const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');

const {
    crearPerfil,
    obtenerPerfil
} = require('../controllers/perfil.controller');


router.post(
    '/',
    verificarToken,
    crearPerfil
);

router.get(
    '/',
    verificarToken,
    obtenerPerfil
);


module.exports = router;