const axios = require('axios');
const dataenv = require('dotenv').config({path: './config.env'});

exports.getCompetitions = async (req, res) => {
    const APIKEY = process.env.RTDB_KEY;  // Asegúrate de tener esto en tu config.env
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://apiclient.besoccerapps.com/scripts/api/api.php?key=${APIKEY}&tz=Europe/Madrid&req=categories&filter=all&format=json`,
            headers: {}
        };

        const response = await axios(config);

        // Puedes mostrar todo o solo una parte del JSON
        console.log(response.data);

        res.status(200).json(response.data);
        
    } catch (error) {
        console.error('Error al obtener las competiciones:', error.message);
        res.status(500).json({ error: 'Error al obtener datos de competiciones' });
    }
};
