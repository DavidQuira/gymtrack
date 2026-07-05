const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');

const {
    crearPerfil,
    obtenerPerfil,
    actualizarPerfil
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

router.put(
    '/',
    verificarToken,
    actualizarPerfil
);


module.exports = router;