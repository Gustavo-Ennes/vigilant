const mongoose = require('../database/connection');

const placeSchema = new mongoose.Schema({
    name: String,
    address: String,
    references: Array
});

module.exports = mongoose.model('place', placeSchema)