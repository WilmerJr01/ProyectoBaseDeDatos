const axios = require("axios");
const dataenv = require("dotenv").config({ path: "./config.env" });
const validator = require("./validator.js");
const APIKEY = process.env.RTDB_KEY; // Asegúrate de tener esto en tu config.env

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
    res.status(500).json({ error: "Error al obtener datos de competiciones" });
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
        homeContinent: 'Europe',
        awayContinent: 'Europe',
        levelCompetition: 'national'
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
