const mongoose = require('../database/connection');

const vigilantSchema = new mongoose.Schema({
    name: String,
    contact: String,
    workedHours: Number
});

module.exports = mongoose.model('vigilant', vigilantSchema)