const express = require('express')

const controllerDB = require('../controllers/dataBase.js')
const controllerAPI = require('../controllers/api.js')
const router = express.Router()

const path = 'database'

router.get(`/${path}`, controllerDB.getData)

router.post(`/${path}/fill`, controllerDB.fillData)

router.get(`/${path}/last`, controllerDB.getLastData)

const path2 = 'api'

router.get(`/${path2}/competitions`, controllerAPI.getCompetitions)

router.get(`/${path2}/:league/:year/:round`, controllerAPI.getMatches)

module.exports = router