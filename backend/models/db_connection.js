const mongoose = require('mongoose');
const dataenv = require('dotenv').config({path: './config.env'});

module.exports = () => {
    const connect = () => {
        mongoose.connect(process.env.DB_CONNECTION)
        .then(() => {
            console.log('MongoDB connected successfully!')
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err)
        })
    }

    connect()
}
