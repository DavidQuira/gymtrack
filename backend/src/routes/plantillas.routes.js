const express = require('express');
const router = express.Router();

const {
    obtenerPlantillas
} = require('../controllers/plantillas.controller');

router.get(
    '/',
    obtenerPlantillas
);

module.exports = router;