const express = require('express');
const router = express.Router();

const { listarRutinas } = require('../controllers/rutina.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, listarRutinas);

module.exports = router;