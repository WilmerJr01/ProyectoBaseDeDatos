const model = require("../models/matchModel.js");
const fs = require("fs");
const fastCsv = require("fast-csv");
const validator = require("./validator.js");

exports.getMatch = (req, res) => {
    const { league, year } = req.params;
    const y = parseInt(year); // Asegurémonos de que el año sea un número

    if (y == 0) {
        model
            .find({
                competition: league,
            })
            .then((matches) => {
                console.log(
                    `Número de partidos encontrados: ${matches.length}`
                );
                res.json(matches);
            })
            .catch((err) => {
                console.error("Error al obtener los partidos:", err);
                res.status(500).json({
                    message: "Error al obtener los partidos",
                    error: err,
                });
            });
    } else {
        console.log(
            `Buscando partidos para la liga: ${league} en el año: ${y}`
        );

        // Convertimos las fechas al formato numérico YYYYMMDD
        const startDate = parseInt(`${y - 1}0801`); // 1 de agosto del año anterior
        const endDate = parseInt(`${y}0701`); // 1 de julio del año actual

        console.log(
            `Fechas de búsqueda: Desde: ${startDate} hasta: ${endDate}`
        );

        model
            .find({
                competition: league,
                date: { $gte: startDate, $lte: endDate },
            })
            .then((matches) => {
                console.log(
                    `Número de partidos encontrados: ${matches.length}`
                );
                res.json(matches);
            })
            .catch((err) => {
                console.error("Error al obtener los partidos:", err);
                res.status(500).json({
                    message: "Error al obtener los partidos",
                    error: err,
                });
            });
    }
};

exports.getGoal = (req, res) => {
    const competencia = req.params.liga; // ej. "spain"
  
    model.aggregate([
      { $match: { competition: competencia } },
      {
        $group: {
          _id: null,
          totalGoles: { $sum: { $add: ["$goalsHome", "$goalsAway"] } }
        }
      }
    ])
    .then(result => {
      const total = result.length > 0 ? result[0].totalGoles : 0;
      res.status(200).json({ totalGoles: total });
    })
    .catch(err => {
      console.error("Error al calcular los goles:", err);
      res.status(500).json({ error: "Error al calcular los goles" });
    });
  };

exports.getData = (req, res) => {
    model
        .find()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: "Internal server error" });
        });
};

exports.getCompetitions = (req, res) => {
    model
        .distinct("competition")
        .then((competitions) => {
            res.status(200).json(competitions);
        })
        .catch((err) => {
            console.error("Error fetching competitions:", err);
            res.status(500).json({ error: "Internal server error" });
        });
};

exports.getLastData = (req, res) => {
    model
        .find()
        .limit(10)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.error("Error fetching last data:", err);
            res.status(500).json({ error: "Internal server error" });
        });
};

exports.getTeams = (req, res) => {
    const { league, year } = req.params;

    const y = parseInt(year); // Asegurémonos de que el año sea un número
    if (y == 0) {
        model
            .distinct("teamHome", { competition: league })
            .then((teams) => {
                console.log(`Equipos encontrados: ${teams.length}`);
                res.json(teams);
            })
            .catch((err) => {
                console.error("Error al obtener los equipos:", err);
                res.status(500).json({
                    message: "Error al obtener los equipos",
                    error: err,
                });
            });
    } else {
        model
            .distinct("teamHome", {
                competition: league,
                date: { $gte: `${y - 1}0801`, $lte: `${y}0701` },
            })
            .then((teams) => {
                console.log(`Equipos encontrados: ${teams.length}`);
                res.json(teams);
            })
            .catch((err) => {
                console.error("Error al obtener los equipos:", err);
                res.status(500).json({
                    message: "Error al obtener los equipos",
                    error: err,
                });
            });
    }
};

exports.deleteMatches = async (req, res) => {
    const { year, league } = req.params;

    const y = parseInt(year); // Asegurémonos de que el año sea un número
    // Construir los límites del año en formato numérico
    const startDate = parseInt(`${y - 1}0801`);
    const endDate = parseInt(`${y}0701`);

    try {
        const result = await model.deleteMany({
            competition: league,
            date: { $gte: startDate, $lte: endDate },
        });

        res.status(200).json({
            message: "Partidos eliminados correctamente",
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error("Error al eliminar partidos:", error.message);
        res.status(500).json({ error: "Error al eliminar partidos" });
    }
};

// Esta función se encarga de leer un archivo CSV y cargar sus datos en la base de datos
exports.fillData = async (req, res) => {
    const filePath = "models/dataset/games.csv";
    const results = [];

    try {
        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(fastCsv.parse({ headers: true }))
                .on("data", (row) => {
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
                        levelCompetition: row.level,
                    };

                    const isValid =
                        validator.validarNulos(newData) &&
                        validator.validarLiga(newData);
                    if (!isValid) return;

                    // Crear una instancia del modelo con los datos validados
                    const instance = new model(newData);

                    results.push(instance);
                })
                .on("end", resolve)
                .on("error", reject);
        });

        // Guardar en la base de datos solo después de procesar todo el CSV
        await model.insertMany(results);
        console.log("Datos insertados correctamente:", results.length, "filas");

        console.log("Lectura del archivo CSV completada");
        return res
            .status(200)
            .json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error durante la carga de datos:", error);
        return res
            .status(500)
            .json({ error: "Error al procesar o guardar los datos" });
    }
};
