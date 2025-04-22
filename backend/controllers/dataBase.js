const model = require('../models/matchModel.js')
const fs = require('fs')
const fastCsv = require('fast-csv')
const validator = require('./validator.js');

exports.getData = (req, res)  => {
    model.find()
    .then((data) => {
        res.status(200).json(data)
    })
    .catch((err) => {
        console.error('Error fetching data:', err)
        res.status(500).json({ error: 'Internal server error' })
    })
}

exports.getLastData = (req, res) => {
    model.find().limit(10)
    .then((data) => {
        res.status(200).json(data)
    })
    .catch((err) => {
        console.error('Error fetching last data:', err)
        res.status(500).json({ error: 'Internal server error' })
    })
}


// Esta función se encarga de leer un archivo CSV y cargar sus datos en la base de datos
exports.fillData = async (req, res) => {
    const filePath = 'models/dataset/games.csv';
    const results = [];

    try {
        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(fastCsv.parse({ headers: true }))
                .on('data', (row) => {
                   
                    const newData = {
                        date: row.date,
                        teamHome: row.home,
                        teamAway: row.away,
                        goalsHome: parseInt(row.gh, 10),
                        goalsAway: parseInt(row.ga, 10),
                        competition: row.competition,
                        homeCountry: row.home_country,
                        awayCountry: row.away_country,
                        homeContinent: row.home_continent,
                        awayContinent: row.away_continent,
                        levelCompetition: row.level
                    };

                    const isValid = validator.validarNulos(newData) && validator.validarLiga(newData);
                    if (!isValid) return;

                    // Crear una instancia del modelo con los datos validados
                    const instance = new model(newData);

                    results.push(instance);
                })
                .on('end', resolve)
                .on('error', reject);
        });

        // Guardar en la base de datos solo después de procesar todo el CSV
        await model.insertMany(results);
        console.log('Datos insertados correctamente:', results.length, 'filas');


        console.log('Lectura del archivo CSV completada');
        return res.status(200).json({ message: 'Datos actualizados correctamente' });

    } catch (error) {
        console.error('Error durante la carga de datos:', error);
        return res.status(500).json({ error: 'Error al procesar o guardar los datos' });
    }
};
