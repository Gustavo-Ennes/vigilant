const mongoose = require('../database/connection');

const itinerarySchema = new mongoose.Schema({
    month: Number,
    year: Number,
    shifts: Array
});

module.exports = mongoose.model("itinerary", itinerarySchema)