const pool = require('../config/db');


const obtenerPlantillas = async (req, res) => {
    try {

        const plantillas = await pool.query(`
            
            
            SELECT 
            id,
            nombre,
            descripcion,
            dias
            FROM plantillas_rutina
            ORDER BY dias, nombre
            
            `);

        return res.status(200).json(plantillas.rows);

    } catch (error) {

        console.error('Error al obtener las plantillas:', error);
        return res.status(500).json({ error: 'Error al obtener las plantillas' });
    }

}

module.exports = {
    obtenerPlantillas
};