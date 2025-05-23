const model = require("../models/matchModel.js");
const fs = require("fs");
const fastCsv = require("fast-csv");
const validator = require("./validator.js");
const { CLIENT_RENEG_LIMIT } = require("tls");

exports.getMatchSimple = (req, res) => {
  const { league, year } = req.params;
  const y = parseInt(year); // Asegurémonos de que el año sea un número

  // Si el año es 0, queremos todos los partidos registrados
  if (y === 0) {
    model
      .aggregate([
        { $match: { competition: league } }, // Filtrar por liga
        {
          $group: {
            _id: null,
            firstDate: { $min: "$date" }, // Obtener la primera fecha
            totalMatches: { $count: {} }, // Contar el total de partidos
          },
        },
      ])
      .then((result) => {
        if (result.length === 0) {
          return res
            .status(404)
            .json({ message: "No se encontraron partidos" });
        }

        const firstDate = result[0].firstDate;
        const totalMatches = result[0].totalMatches;

        res.json({ firstDate, totalMatches }); // Devolver los resultados
      })
      .catch((err) => {
        console.error("Error al obtener las fechas de los partidos:", err);
        res.status(500).json({
          message: "Error al obtener las fechas de los partidos",
          error: err,
        });
      });
  } else {
    // Convertir el año proporcionado en un rango de fechas (primer y último día del año)
    const startDate = parseInt(`${y}0101`); // 1 de enero del año
    const endDate = parseInt(`${y}1231`); // 31 de diciembre del año

    model
      .aggregate([
        {
          $match: {
            competition: league,
            date: { $gte: startDate, $lte: endDate }, // Filtrar por rango de fechas
          },
        },
        {
          $group: {
            _id: null,
            firstDate: { $min: "$date" }, // Obtener la primera fecha dentro del rango
            totalMatches: { $count: {} }, // Contar el total de partidos dentro del rango
          },
        },
      ])
      .then((result) => {
        if (result.length === 0) {
          return res
            .status(404)
            .json({ message: "No se encontraron partidos en este año" });
        }

        const firstDate = result[0].firstDate;
        const totalMatches = result[0].totalMatches;

        res.json({ firstDate, totalMatches }); // Devolver los resultados
      })
      .catch((err) => {
        console.error("Error al obtener las fechas de los partidos:", err);
        res.status(500).json({
          message: "Error al obtener las fechas de los partidos",
          error: err,
        });
      });
  }
};

exports.getMatchDetail = (req, res) => {
  const { league, year } = req.params;
  const y = parseInt(year); // Asegurémonos de que el año sea un número

  if (y == 0) {
    model
      .find({
        competition: league,
      })
      .then((matches) => {
        console.log(`Número de partidos encontrados: ${matches.length}`);
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
    console.log(`Buscando partidos para la liga: ${league} en el año: ${y}`);

    // Convertimos las fechas al formato numérico YYYYMMDD
    const startDate = parseInt(`${y}0101`); // 1 de enero del año
    const endDate = parseInt(`${y}1231`); // 31 de diciembre del año

    console.log(`Fechas de búsqueda: Desde: ${startDate} hasta: ${endDate}`);

    model
      .find({
        competition: league,
        date: { $gte: startDate, $lte: endDate },
      })
      .then((matches) => {
        console.log(`Número de partidos encontrados: ${matches.length}`);
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

exports.getFindMatch = async (req, res) => {
  const { league, date, teamHome, teamAway } = req.params;
  const y = parseInt(date); // Asegurémonos de que el año sea un número

  model
    .findOne({
      competition: league,
      date: y,
      teamHome: teamHome,
      teamAway: teamAway,
    })
    .then((match) => {
      if (match) {
        console.log(`Partido encontrado: ${match}`);
        res.json(match);
      } else {
        console.log("No se encontró el partido");
        res.status(200).json({ message: "Partido no encontrado" });
      }
    })
    .catch((err) => {
      console.error("Error al buscar el partido:", err);
      res.status(500).json({
        message: "Error al buscar el partido",
        error: err,
      });
    });
};

exports.getGoal = async (req, res) => {
  const { league, year } = req.params;

  try {
    // Si el año es 0, no limitamos por fechas
    let startDate = 0;
    let endDate = new Date().getFullYear() * 10000 + 1231; // Último día del año actual (ej. 20251231)

    if (year !== "0") {
      // Si el año no es 0, calculamos las fechas como antes
      startDate = parseInt(`${year}0101`, 10); // Primer día del año
      endDate = parseInt(`${parseInt(year) + 1}0101`, 10); // Primer día del siguiente año
    }

    // Verificar que las fechas sean correctas
    console.log(
      `Buscando goles para la liga ${league}, desde ${startDate} hasta ${endDate}`
    );

    const result = await model.aggregate([
      {
        $match: {
          competition: league,
          date: { $gte: startDate, $lt: endDate }, // Rango de fechas
        },
      },
      {
        $group: {
          _id: null,
          totalGoalsHome: {
            $sum: "$goalsHome", // Sumamos los goles del equipo local
          },
          totalGoalsAway: {
            $sum: "$goalsAway", // Sumamos los goles del equipo visitante
          },
        },
      },
    ]);

    const totalGoalsHome = result[0]?.totalGoalsHome || 0;
    const totalGoalsAway = result[0]?.totalGoalsAway || 0;

    const totalGoals = totalGoalsHome + totalGoalsAway; // Suma total de goles

    res
      .status(200)
      .json({ league, year, totalGoalsHome, totalGoalsAway, totalGoals });
  } catch (error) {
    console.error("Error al calcular los goles:", error.message);
    res.status(500).json({ error: "No se pudieron calcular los goles" });
  }
};

exports.getGoalByTeam = (req, res) => {
  const { league, team } = req.params;

  model
    .aggregate([
      {
        $match: {
          competition: league,
          $or: [{ teamHome: team }, { teamAway: team }],
        },
      },
      {
        $group: {
          _id: null,
          totalGoals: {
            $sum: {
              $cond: [
                { $eq: ["$teamHome", team] },
                "$goalsHome",
                {
                  $cond: [{ $eq: ["$teamAway", team] }, "$goalsAway", 0],
                },
              ],
            },
          },
        },
      },
    ])
    .then((result) => {
      const totalGoals = result[0]?.totalGoals || 0;
      res.status(200).json({ league, team, totalGoals });
    })
    .catch((err) => {
      console.error("Error al obtener los goles del equipo:", err);
      res.status(500).json({
        message: "Error al obtener los goles del equipo",
        error: err,
      });
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
    .sort({ date: -1 }) // Ordenar por fecha descendente
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

exports.getCompetitionsInfo = async (req, res) => {
  try {
    const resultado = await model.aggregate([
      {
        $project: {
          competition: 1,
          levelCompetition: 1,
          homeContinent: 1,
          awayContinent: 1,
          goalsHome: 1,
          goalsAway: 1
        }
      },
      {
        $addFields: {
          continent: {
            $cond: [
              { $eq: ["$levelCompetition", "national"] },
              "$homeContinent",
              {
                $cond: [
                  { $eq: ["$homeContinent", "$awayContinent"] },
                  "$homeContinent",
                  "world"
                ]
              }
            ]
          },
          totalGoals: {
            $add: [
              { $ifNull: ["$goalsHome", 0] },
              { $ifNull: ["$goalsAway", 0] }
            ]
          }
        }
      },
      {
        $group: {
          _id: "$competition",
          continent: { $first: "$continent" },
          totalGoals: { $sum: "$totalGoals" }
        }
      },
      {
        $project: {
          _id: 0,
          competition: "$_id",
          continent: 1,
          totalGoals: 1
        }
      }
    ]);

    res.json(resultado);
  } catch (err) {
    console.error("Error al obtener la información de competiciones:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


exports.enfrentamiento = async (req, res) => {
  const { league, equipo1, equipo2 } = req.params;

  try {
    const partidos = await model.find({
      competition: league,
      $or: [
        { teamHome: equipo1, teamAway: equipo2 },
        { teamHome: equipo2, teamAway: equipo1 }
      ]
    });

    let golesEquipo1 = 0;
    let golesEquipo2 = 0;
    let victoriasEquipo1 = 0;
    let victoriasEquipo2 = 0;
    let empates = 0;

    let mayorVictoriaEquipo1 = null; // { golesFavor, golesContra, fecha }
    let mayorVictoriaEquipo2 = null;

    for (const partido of partidos) {
      const { teamHome, teamAway, goalsHome, goalsAway, date } = partido;

      let esEquipo1Local = teamHome === equipo1 && teamAway === equipo2;
      let esEquipo1Visitante = teamHome === equipo2 && teamAway === equipo1;

      let goles1 = esEquipo1Local ? goalsHome : goalsAway;
      let goles2 = esEquipo1Local ? goalsAway : goalsHome;

      // Goles totales
      golesEquipo1 += goles1;
      golesEquipo2 += goles2;

      // Resultado
      if (goles1 > goles2) {
        victoriasEquipo1++;
        let diferencia = goles1 - goles2;
        if (!mayorVictoriaEquipo1 || diferencia > (mayorVictoriaEquipo1.golesFavor - mayorVictoriaEquipo1.golesContra)) {
          mayorVictoriaEquipo1 = {
            golesFavor: goles1,
            golesContra: goles2,
            fecha: date
          };
        }
      } else if (goles1 < goles2) {
        victoriasEquipo2++;
        let diferencia = goles2 - goles1;
        if (!mayorVictoriaEquipo2 || diferencia > (mayorVictoriaEquipo2.golesFavor - mayorVictoriaEquipo2.golesContra)) {
          mayorVictoriaEquipo2 = {
            golesFavor: goles2,
            golesContra: goles1,
            fecha: date
          };
        }
      } else {
        empates++;
      }
    }

    res.json({
      enfrentamientos: partidos.length,
      golesEquipo1,
      golesEquipo2,
      victoriasEquipo1,
      victoriasEquipo2,
      empates,
      mayorVictoriaEquipo1: mayorVictoriaEquipo1
        ? {
            marcador: `${mayorVictoriaEquipo1.golesFavor}-${mayorVictoriaEquipo1.golesContra}`,
            fecha: mayorVictoriaEquipo1.fecha
          }
        : null,
      mayorVictoriaEquipo2: mayorVictoriaEquipo2
        ? {
            marcador: `${mayorVictoriaEquipo2.golesFavor}-${mayorVictoriaEquipo2.golesContra}`,
            fecha: mayorVictoriaEquipo2.fecha
          }
        : null
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los enfrentamientos' });
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
            validator.validarNulos(newData) && validator.validarLiga(newData);
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

exports.getGoalsByYear = async (req, res) => {
  const { yearInicial, yearFinal, league } = req.params;
  console.log("Liga recibida:", league);

  try {
    // Si no se proporcionan años o son "0", no aplicar filtro de fechas
    const startDate =
      yearInicial && yearInicial !== "0"
        ? parseInt(`${yearInicial}0101`, 10)
        : null;
    const endDate =
      yearFinal && yearFinal !== "0" ? parseInt(`${yearFinal}1231`, 10) : null;

    // Crear el filtro condicional para el rango de fechas
    const matchStage = { competition: league };
    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = startDate;
      if (endDate) dateFilter.$lte = endDate;
      matchStage.date = dateFilter;
    }

    const result = await model.aggregate([
      {
        $match: matchStage, // Aplicar el filtro condicional
      },
      {
        $group: {
          _id: {
            year: {
              $substr: [{ $toString: "$date" }, 0, 4], // Extraer el año de la fecha
            },
          },
          totalGoalsHome: { $sum: "$goalsHome" },
          totalGoalsAway: { $sum: "$goalsAway" },
        },
      },
      {
        $project: {
          year: "$_id.year",
          totalGoals: { $add: ["$totalGoalsHome", "$totalGoalsAway"] },
          _id: 0,
        },
      },
      {
        $sort: { year: 1 }, // Ordenar por año ascendente
      },
    ]);

    const years = result.map((item) => item.year);
    const goals = result.map((item) => item.totalGoals);

    res.status(200).json({ years, goals });
  } catch (error) {
    console.error("Error al obtener los goles por año:", error.message);
    res.status(500).json({ error: "No se pudieron obtener los goles por año" });
  }
};

exports.getGoalsByYearTeam = async (req, res) => {
  const { league, team, yearInicial, yearFinal } = req.params;
  console.log("Liga recibida:", league);
  console.log("Equipo recibido:", team);

  // Determinar el rango de años
  const startYear =
    yearInicial && yearInicial !== "0" ? parseInt(yearInicial) : 0;
  const endYear =
    yearFinal && yearFinal !== "0"
      ? parseInt(yearFinal)
      : new Date().getFullYear();

  try {
    const result = await model.aggregate([
      {
        $match: {
          competition: league,
          $or: [{ teamHome: team }, { teamAway: team }],
        },
      },
      {
        $addFields: {
          year: { $substr: [{ $toString: "$date" }, 0, 4] },
          goles: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$teamHome", team] },
                  then: "$goalsHome",
                },
                {
                  case: { $eq: ["$teamAway", team] },
                  then: "$goalsAway",
                },
              ],
              default: 0,
            },
          },
        },
      },
      {
        $match: {
          ...(startYear || endYear
            ? {
                year: {
                  ...(startYear ? { $gte: startYear.toString() } : {}),
                  ...(endYear ? { $lte: endYear.toString() } : {}),
                },
              }
            : {}),
        },
      },
      {
        $group: {
          _id: "$year",
          totalGoals: { $sum: "$goles" },
        },
      },
      {
        $project: {
          year: "$_id",
          totalGoals: 1,
          _id: 0,
        },
      },
      {
        $sort: { year: 1 },
      },
    ]);
    console.log("Resultados de la agregación:", result);

    const years = result.map((item) => item.year);
    const goals = result.map((item) => item.totalGoals);

    res.status(200).json({ years, goals });
  } catch (error) {
    console.error(
      "Error al obtener los goles por año del equipo:",
      error.message
    );
    res
      .status(500)
      .json({ error: "No se pudieron obtener los goles por año del equipo" });
  }
};

exports.getmacthByYear = async (req, res) => {
  const { yearInicial, yearFinal, league } = req.params;
  console.log("Liga recibida:", league);

  try {
    // Si no se proporcionan años o son "0", no aplicar filtro de fechas
    const startDate =
      yearInicial && yearInicial !== "0"
        ? parseInt(`${yearInicial}0101`, 10)
        : null;
    const endDate =
      yearFinal && yearFinal !== "0" ? parseInt(`${yearFinal}1231`, 10) : null;

    // Crear el filtro condicional para el rango de fechas
    const matchStage = { competition: league };
    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = startDate;
      if (endDate) dateFilter.$lte = endDate;
      matchStage.date = dateFilter;
    }

    const result = await model.aggregate([
      {
        $match: matchStage, // Aplicar el filtro condicional
      },
      {
        $group: {
          _id: {
            year: {
              $substr: [{ $toString: "$date" }, 0, 4], // Extraer el año de la fecha
            },
          },
          totalMatches: { $count: {} },
        },
      },
      {
        $project: {
          year: "$_id.year",
          totalMatches: 1,
          _id: 0,
        },
      },
      {
        $sort: { year: 1 }, // Ordenar por año ascendente
      },
    ]);

    const years = result.map((item) => item.year);
    const matches = result.map((item) => item.totalMatches);

    res.status(200).json({ years, matches });
  } catch (error) {
    console.error("Error al obtener los partidos por año:", error.message);
    res
      .status(500)
      .json({ error: "No se pudieron obtener los partidos por año" });
  }
};

exports.getMatchByYearTeam = async (req, res) => {
  const { league, team, yearInicial, yearFinal } = req.params;
  console.log("Liga recibida:", league);
  console.log("Equipo recibido:", team);

  // Determinar el rango de años
  const startYear =
    yearInicial && yearInicial !== "0" ? parseInt(yearInicial) : 0;
  const endYear =
    yearFinal && yearFinal !== "0"
      ? parseInt(yearFinal)
      : new Date().getFullYear();

  try {
    const result = await model.aggregate([
      {
        $match: {
          competition: league,
          $or: [{ teamHome: team }, { teamAway: team }],
        },
      },
      {
        $addFields: {
          year: { $substr: [{ $toString: "$date" }, 0, 4] },
        },
      },
      {
        $match: {
          ...(startYear || endYear
            ? {
                year: {
                  ...(startYear ? { $gte: startYear.toString() } : {}),
                  ...(endYear ? { $lte: endYear.toString() } : {}),
                },
              }
            : {}),
        },
      },
      {
        $group: {
          _id: "$year",
          totalMatches: { $count: {} },
        },
      },
      {
        $project: {
          year: "$_id",
          totalMatches: 1,
          _id: 0,
        },
      },
      {
        $sort: { year: 1 },
      },
    ]);
    console.log("Resultados de la agregación:", result);

    const years = result.map((item) => item.year);
    const matches = result.map((item) => item.totalMatches);

    res.status(200).json({ years, matches });
  } catch (error) {
    console.error(
      "Error al obtener los partidos por año del equipo:",
      error.message
    );
    res.status(500).json({
      error: "No se pudieron obtener los partidos por año del equipo",
    });
  }
};

exports.getMatchTeam = (req, res) => {
  const { league, yearInicial, yearFinal, team } = req.params;

  const fechaInicio = parseInt(`${yearInicial}0101`);

  const finalYear =
    yearFinal === "0" ? new Date().getFullYear() : parseInt(yearFinal);
  const fechaFin = parseInt(`${finalYear}1231`);

  model
    .find(
      {
        competition: league,
        date: { $gte: fechaInicio, $lte: fechaFin },
        $or: [{ teamHome: team }, { teamAway: team }],
      },
      { date: 1, _id: 0 }
    )
    .sort({ date: 1 })
    .then((matches) => {
      const fechas = matches.map((m) => m.date);
      res.status(200).json(fechas);
    })
    .catch((err) => {
      console.error("Error al obtener las fechas de los partidos:", err);
      res.status(500).json({
        message: "Error al obtener las fechas",
        error: err,
      });
    });
};

const compareGoalsByYear = async (req, res) => {
  const { league, yearInicial, yearFinal, team1, team2 } = req.params;

  console.log("Parámetros recibidos:", {
    league,
    yearInicial,
    yearFinal,
    team1,
    team2,
  });

  try {
    const startYear =
      yearInicial && yearInicial !== "0" ? parseInt(yearInicial) : 0;
    const endYear =
      yearFinal && yearFinal !== "0"
        ? parseInt(yearFinal)
        : new Date().getFullYear();

    const goalsTeam1 = await getGoalsByTeamAndYear(
      league,
      startYear,
      endYear,
      team1
    );
    const goalsTeam2 = await getGoalsByTeamAndYear(
      league,
      startYear,
      endYear,
      team2
    );

    console.log("Goles equipo 1:", goalsTeam1);
    console.log("Goles equipo 2:", goalsTeam2);

    const years = [
      ...new Set([
        ...goalsTeam1.map((g) => g.year),
        ...goalsTeam2.map((g) => g.year),
      ]),
    ].sort();

    const formattedGoalsTeam1 = years.map((year) => {
      const goalData = goalsTeam1.find((g) => g.year === year);
      return goalData ? goalData.totalGoals : 0;
    });

    const formattedGoalsTeam2 = years.map((year) => {
      const goalData = goalsTeam2.find((g) => g.year === year);
      return goalData ? goalData.totalGoals : 0;
    });

    res.status(200).json({
      years,
      goalsTeam1: formattedGoalsTeam1,
      goalsTeam2: formattedGoalsTeam2,
    });
  } catch (error) {
    console.error("Error al comparar los goles:", error.message);
    res
      .status(500)
      .json({ error: "Error al comparar los goles", details: error.message });
  }
};

// Función auxiliar para obtener los goles por equipo y año
const getGoalsByTeamAndYear = async (league, startYear, endYear, team) => {
  const matchStage = {
    competition: league,
    $or: [{ teamHome: team }, { teamAway: team }],
  };

  if (startYear || endYear) {
    const dateFilter = {};
    if (startYear) dateFilter.$gte = parseInt(`${startYear}0101`);
    if (endYear) dateFilter.$lte = parseInt(`${endYear}1231`);
    matchStage.date = dateFilter;
  }

  console.log("Filtro de consulta:", JSON.stringify(matchStage, null, 2));

  const result = await model.aggregate([
    { $match: matchStage },
    {
      $addFields: {
        year: { $substr: [{ $toString: "$date" }, 0, 4] },
        goles: {
          $switch: {
            branches: [
              { case: { $eq: ["$teamHome", team] }, then: "$goalsHome" },
              { case: { $eq: ["$teamAway", team] }, then: "$goalsAway" },
            ],
            default: 0,
          },
        },
      },
    },
    {
      $group: {
        _id: "$year",
        totalGoals: { $sum: "$goles" },
      },
    },
    {
      $project: {
        year: "$_id",
        totalGoals: 1,
        _id: 0,
      },
    },
    { $sort: { year: 1 } },
  ]);

  console.log("Resultados de la consulta:", result);
  return result;
};

module.exports = {
  ...exports,
  compareGoalsByYear,
};
