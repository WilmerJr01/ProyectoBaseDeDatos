const express = require('express')

const controllerDB = require('../controllers/dataBase.js')
const controllerAPI = require('../controllers/api.js')
const router = express.Router()

//Metodos de la base de datos

const path = 'database'

//Metodos get

router.get(`/${path}`, controllerDB.getData)

router.get(`/${path}/competitions`, controllerDB.getCompetitions)

router.get(`/${path}/last`, controllerDB.getLastData)

router.get(`/${path}/match/:league/:year`, controllerDB.getMatch)

router.get(`/${path}/team/:league/:year`, controllerDB.getTeams)

router.get(`/${path}/goals/:league/:year`, controllerDB.getGoal)


//Metodos delete

router.delete(`/${path}/delete/:league/:year`, controllerDB.deleteMatches)

//Metodos post
router.post(`/${path}/fill`, controllerDB.fillData)

//Metodos de la API

const path2 = 'api'

//Metodos get

router.get(`/${path2}/competitions`, controllerAPI.getCompetitions)

router.get(`/${path2}/match/:league/:year/:round`, controllerAPI.getMatches)

router.get(`/${path2}/team/:league/:year`, controllerAPI.getTeams)

router.post(`/${path2}/fill/:league/:year`, controllerAPI.saveMatches)

module.exports = router