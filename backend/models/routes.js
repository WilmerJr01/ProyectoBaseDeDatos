const express = require("express");

const controllerDB = require("../controllers/dataBase.js");
const controllerAPI = require("../controllers/api.js");
const router = express.Router();

//Metodos de la base de datos

const path = "database";

//Metodos get

router.get(`/${path}`, controllerDB.getData);

router.get(`/${path}/competitions`, controllerDB.getCompetitions);

router.get(`/${path}/last`, controllerDB.getLastData);

router.get(`/${path}/matchSimple/:league/:year`, controllerDB.getMatchSimple);

router.get(`/${path}/matchDetail/:league/:year`, controllerDB.getMatchDetail);

router.get(`/${path}/team/:league/:year`, controllerDB.getTeams);

router.get(`/${path}/goals/:league/:year`, controllerDB.getGoal);

router.get(`/${path}/goalsByTeam/:league/:team`, controllerDB.getGoalByTeam);

router.get(`/${path}/find/:league/:date/:teamHome/:teamAway`,controllerDB.getFindMatch);

router.get(`/${path}/matchTeam/:league/:yearInicial/:yearFinal/:team`, controllerDB.getMatchTeam);

router.get(`/${path}/goalsByYear/:yearInicial/:yearFinal/:league`, controllerDB.getGoalsByYear);

router.get(`/${path}/matchByYear/:yearInicial/:yearFinal/:league`, controllerDB.getmacthByYear);

router.get(`/${path}/goalsByYearTeam/:yearInicial/:yearFinal/:league/:team`, controllerDB.getGoalsByYearTeam);

router.get(`/${path}/matchByYearTeam/:yearInicial/:yearFinal/:league/:team`, controllerDB.getMatchByYearTeam);

router.get(`/${path}/compareGoals/:league/:yearInicial/:yearFinal/:team1/:team2`,controllerDB.compareGoalsByYear);

router.get(`/${path}/competitionsInfo`, controllerDB.getCompetitionsInfo);

router.get(`/${path}/enfrentamiento/:league/:equipo1/:equipo2`, controllerDB.enfrentamiento);


//Metodos delete

router.delete(`/${path}/delete/:league/:year`, controllerDB.deleteMatches);

//Metodos post
router.post(`/${path}/fill`, controllerDB.fillData);

//Metodos de la API

const path2 = "api";

//Metodos get

router.get(`/${path2}/competitions`, controllerAPI.getCompetitions);

router.get(`/${path2}/match/:league/:year/:round`, controllerAPI.getMatches);

router.get(`/${path2}/team/:league/:year`, controllerAPI.getTeams);

router.post(`/${path2}/fill/:league/:year`, controllerAPI.saveMatches);

module.exports = router;
