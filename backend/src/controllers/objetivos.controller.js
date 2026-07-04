const pool = require('../config/db');

const obtener_objetivos = async (req, res) => {

    try {
        const objetivos = await pool.query(`
        SELECT *
        FROM objetivos
        ORDER BY nombre
        
        `);


        return res.json(objetivos.rows);


    } catch (error) {
        console.error('Error al obtener los objetivos:', error);
        return res.status(500).json({
            error: 'Error al obtener los objetivos'

        });

    }

};

module.exports = {
    obtener_objetivos
};