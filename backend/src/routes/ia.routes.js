const express = require('express');
const router = express.Router();


const verificarToken = require('../middlewares/auth.middleware');
const { generarRutina } = require('../controllers/ia.controller');




router.post(
    '/generar-rutina',
    verificarToken,
    generarRutina);

module.exports = router;