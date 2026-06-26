require ('dotenv').config();

console.log(process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

//rutas 
app.use('/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        mensaje: 'Bienvenido a la API de GymTrack'
    });
});

module.exports = app;