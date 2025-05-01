const mongoose = require('mongoose');
const DateOnly = require('mongoose-dateonly')(mongoose);

const matchSchema = new mongoose.Schema({
    date: {
        type: Number,
        required: true
    },
    teamHome: {
        type: String,
        required: true
    },
    teamAway: {
        type: String,
        required: true
    },
    goalsHome: {
        type: Number,
        required: true
    },
    goalsAway: {
        type: Number,
        required: true
    }, 
    competition: {
        type: String,
        required: true
    },
    homeCountry: {
        type: String,
        required: true
    },
    awayCountry: {
        type: String,
        required: true
    },
    homeContinent: {
        type: String,
        required: true
    },
    awayContinent: {
        type: String,
        required: true
    },
    levelCompetition: {
        type: String,
        required: true
    }
}, {
    versionKey: false

})

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;