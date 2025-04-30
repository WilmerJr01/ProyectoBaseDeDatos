const express = require('express')

const controllerDB = require('../controllers/dataBase.js')
const controllerAPI = require('../controllers/api.js')
const router = express.Router()

const path = 'database'

router.get(`/${path}`, controllerDB.getData)

router.post(`/${path}/fill`, controllerDB.fillData)

router.get(`/${path}/last`, controllerDB.getLastData)

router.get(`/${path}/match/:league/:year`, controllerDB.getLeagueYear)

router.get(`/${path}/team/:league/:year`, controllerDB.getTeams)

router.delete(`/${path}/delete/:league/:year`, controllerDB.deleteMatches)

const path2 = 'api'

router.get(`/${path2}/competitions`, controllerAPI.getCompetitions)

router.get(`/${path2}/match/:league/:year/:round`, controllerAPI.getMatches)

router.get(`/${path2}/team/:league/:year`, controllerAPI.getTeams)

router.post(`/${path2}/fill/:league/:year`, controllerAPI.saveMatches)

module.exports = router