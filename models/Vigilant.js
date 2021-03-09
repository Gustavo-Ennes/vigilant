const mongoose = require('../database/connection');

const vigilantSchema = new mongoose.Schema({
    name: String,
    contact: String
});

module.exports = mongoose.model('vigilant', vigilantSchema)