const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//registro de usuario
const register = async (req, res) => {
    try {

        const {
            nombre,
            apellido,
            correo,
            telefono,
            contrasena
        } = req.body;

        // Validar campos
        if (
            !nombre ||
            !apellido ||
            !correo ||
            !contrasena
        ) {
            return res.status(400).json({
                message: 'Faltan campos obligatorios'
            });
        }

        // Verificar si existe el correo
        const usuarioExistente = await pool.query(
            'SELECT id FROM usuarios WHERE correo = $1',
            [correo]
        );

        if (usuarioExistente.rows.length > 0) {
            return res.status(409).json({
                message: 'El correo ya está registrado'
            });
        }

        // Encriptar contraseña
        const hash = await bcrypt.hash(contrasena, 10);

        // Insertar usuario
        const nuevoUsuario = await pool.query(
            `
            INSERT INTO usuarios
            (
                nombre,
                apellido,
                correo,
                telefono,
                contrasena
            )
            VALUES ($1,$2,$3,$4,$5)
            RETURNING id, nombre, apellido, correo
            `,
            [
                nombre,
                apellido,
                correo,
                telefono,
                hash
            ]
        );

        return res.status(201).json({
            message: 'Usuario registrado correctamente',
            usuario: nuevoUsuario.rows[0]
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message
        });
    }
};

//login
const login = async (req, res) => {
    try {

        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({
                message: 'Correo y contraseña son obligatorios'
            });
        }

        // Buscar usuario por correo
        const usuario = await pool.query(
            `
    SELECT *
    FROM usuarios
    WHERE correo = $1
    `,
            [correo]
        );

        // Verificar si existe
        if (usuario.rows.length === 0) {
            return res.status(401).json({
                message: 'Credenciales inválidas'
            });
        }

        const usuarioEncontrado = usuario.rows[0];

        // Comparar contraseñas
        const contrasenaValida = await bcrypt.compare(
            contrasena,
            usuarioEncontrado.contrasena
        );

        if (!contrasenaValida) {
            return res.status(401).json({
                message: 'Credenciales inválidas'
            });
        }

        return res.status(200).json({
            message: 'Login exitoso'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message
        });
    }
};



module.exports = {
    register,
    login
};