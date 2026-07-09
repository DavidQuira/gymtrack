require ('dotenv').config();

console.log(process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const perfilRoutes = require('./routes/perfil.routes');
const objetivosRoutes = require('./routes/objetivos.routes');
const plantillasRoutes = require('./routes/plantillas.routes');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

//rutas 
app.use('/auth', authRoutes);
app.use('/perfil', perfilRoutes);
app.use('/objetivos', objetivosRoutes);
app.use('/plantillas', plantillasRoutes);
// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        mensaje: 'Bienvenido a la API de GymTrack'
    });
});

module.exports = app;