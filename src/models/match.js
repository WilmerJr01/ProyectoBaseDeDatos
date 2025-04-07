const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    date: {
        type: Date,
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
    homeContry: {
        type: String,
        required: true
    },
    awayContry: {
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
})

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;