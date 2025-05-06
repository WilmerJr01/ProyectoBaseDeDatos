const axios = require("axios");
const dataenv = require("dotenv").config({ path: "./config.env" });
const validator = require("./validator.js");
const APIKEY = process.env.RTDB_KEY; // Asegúrate de tener esto en tu config.env
const model = require("../models/matchModel.js");

exports.getCompetitions = async (req, res) => {
    const ligas = [];

    try {
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `https://apiclient.besoccerapps.com/scripts/api/api.php?key=${APIKEY}&tz=Europe/Madrid&req=categories&filter=all&format=json`,
            headers: {},
        };

        const response = await axios(config);
        const data = response.data;

        // Filtrar las competiciones que te interesan
        data.category.forEach((row) => {
            if (validator.validarLigaAPI(row)) {
                const liga = {
                    id: row.id,
                    name: row.name,
                    country: row.country,
                    continent: row.continent,
                    level: row.level,
                };
                ligas.push(liga);
            }
        });

        console.log("Ligas filtradas:", ligas);

        res.status(200).json(ligas);
    } catch (error) {
        console.error("Error al obtener las competiciones:", error.message);
        res.status(500).json({
            error: "Error al obtener datos de competiciones",
        });
    }
};

exports.getMatches = async (req, res) => {
    const { league, year, round } = req.params;

    const category = validator.interceptor(league);

    try {
        const response = await axios.get(
            `https://apiclient.besoccerapps.com/scripts/api/api.php`,
            {
                //format=json&req=matchs&league=1&year=2023&round=1
                params: {
                    key: APIKEY,
                    tz: "Europe/Madrid",
                    req: "matchs",
                    league: category,
                    round: round,
                    year: year,
                    format: "json",
                },
            }
        );

        const data = response.data;

        const partidos = data.match;

        matches = [];

        partidos.forEach((row) => {
            const match = {
                date: row.date,
                teamHome: row.local,
                teamAway: row.visitor,
                goalsHome: parseInt(row.local_goals, 10),
                goalsAway: parseInt(row.visitor_goals, 10),
                competition: league,
                homeCountry: league,
                awayCountry: league,
                homeContinent: "Europe",
                awayContinent: "Europe",
                levelCompetition: "national",
            };
            matches.push(match);
        });

        console.log("Partidos filtrados:", matches);

        res.status(200).json(data);
    } catch (error) {
        console.error("Error al obtener los partidos:", error.message);
        res.status(500).json({ error: "Error al obtener datos de partidos" });
    }
};

exports.getTeams = async (req, res) => {
    const { league, year } = req.params;
    const category = validator.interceptor(league);

    try {
        const response = await axios.get(
            `https://apiclient.besoccerapps.com/scripts/api/api.php`,
            {
                params: {
                    key: APIKEY,
                    tz: "Europe/Madrid",
                    req: "tables",
                    league: category,
                    format: "json",
                    year: year,
                },
            }
        );

        const data = response.data;

        const table = data.table;

        teams = [];

        table.forEach((row) => {
            const team = row.team;
            teams.push(team);
        });

        res.status(200).json(teams);
    } catch (error) {
        console.error("Error al obtener los equipos:", error.message);
        res.status(500).json({ error: "Error al obtener datos de equipos" });
    }
};

exports.saveMatches = async (req, res) => {
    const { league, year } = req.params;
    const category = validator.interceptor(league);

    const today = new Date();
    const todayNumber =
        today.getFullYear() * 10000 +
        (today.getMonth() + 1) * 100 +
        today.getDate();

    let savedMatches = [];

    try {
        // Primero obtenemos todos los datos de los partidos en paralelo
        const roundsPromises = [];
        for (let round = 1; round <= 38; round++) {
            roundsPromises.push(
                axios.get(
                    "https://apiclient.besoccerapps.com/scripts/api/api.php",
                    {
                        params: {
                            key: APIKEY,
                            tz: "Europe/Madrid",
                            req: "matchs",
                            league: category,
                            round: round,
                            year: year,
                            format: "json",
                        },
                    }
                )
            );
        }

        // Esperamos a que todas las promesas se resuelvan
        const roundsResponses = await Promise.all(roundsPromises);

        // Procesamos los resultados de forma concurrente
        const matchPromises = roundsResponses.flatMap((response, index) => {
            const data = response.data;
            if (!data.match) return [];

            return data.match.map(async (row) => {
                const [yyyy, mm, dd] = row.date.split("/").map(Number);
                const matchDate = yyyy * 10000 + mm * 100 + dd;

                if (matchDate >= todayNumber) return null;

                let homeTeam = "";
                let awayTeam = "";

                // Convertimos los nombres con la función equipos
                if (league === "england") {
                    homeTeam = validator.equiposEngland(row.local);
                    awayTeam = validator.equiposEngland(row.visitor);
                }

                if (league === "spain") {
                    homeTeam = validator.equiposSpain(row.local);
                    awayTeam = validator.equiposSpain(row.visitor);
                }

                if (!homeTeam || !awayTeam) return null; // Ignora si no se encuentra el nombre

                const exists = await model.findOne({
                    date: matchDate,
                    teamHome: homeTeam,
                    teamAway: awayTeam,
                });

                if (exists) return null;

                const match = new model({
                    date: matchDate,
                    teamHome: homeTeam,
                    teamAway: awayTeam,
                    goalsHome: isNaN(parseInt(row.local_goals))
                        ? null
                        : parseInt(row.local_goals),
                    goalsAway: isNaN(parseInt(row.visitor_goals))
                        ? null
                        : parseInt(row.visitor_goals),
                    competition: league,
                    homeCountry: league,
                    awayCountry: league,
                    homeContinent: "Europe",
                    awayContinent: "Europe",
                    levelCompetition: "national",
                });

                await match.save();
                savedMatches.push(match);
            });
        });

        // Esperamos a que todas las promesas de guardar los partidos se resuelvan
        await Promise.all(matchPromises);

        res.status(200).json({
            message: "Partidos guardados correctamente",
            total: savedMatches.length,
            matches: savedMatches,
        });
    } catch (error) {
        console.error("Error al guardar partidos:", error.message);
        res.status(500).json({ error: "Error al guardar partidos" });
    }
};

exports.actualizarLigas = async () => {
  const urls = [
      "http://localhost:3000/api/fill/spain/2025",
      "http://localhost:3000/api/fill/england/2025",
  ];

  let partidosActualizados = 0; // Variable para contar los partidos actualizados

  try {
      const responses = await Promise.all(
          urls.map((url) =>
              axios.post(url).then(
                  (res) => ({ url, success: true, data: res.data }),
                  (err) => ({ url, success: false, error: err.message })
              )
          )
      );

      responses.forEach((result) => {
          if (result.success) {
              console.log(
                  `[${new Date().toISOString()}] Actualización exitosa: ${
                      result.url
                  }`
              );

              // Contamos los partidos actualizados si la respuesta es exitosa
              partidosActualizados += result.data.matchesUpdated || 0;
          } else {
              console.error(
                  `[${new Date().toISOString()}] Error en ${result.url}: ${
                      result.error
                  }`
              );
          }
      });

      // Retornamos el número de partidos actualizados
      console.log(
          `[${new Date().toISOString()}] Total de partidos actualizados: ${partidosActualizados}`
      );

      return partidosActualizados;

  } catch (err) {
      console.error(
          `[${new Date().toISOString()}] Error inesperado:`,
          err.message
      );
      return 0; // En caso de error, retornamos 0
  }
};
