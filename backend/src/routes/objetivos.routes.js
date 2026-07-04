const express = require('express');
const router = express.Router();



const { obtener_objetivos } = require('../controllers/objetivos.controller');

router.get('/', obtener_objetivos);

module.exports = router;