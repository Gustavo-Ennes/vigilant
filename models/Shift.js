const mongoose = require('../database/connection');

const ShiftSchema = new mongoose.Schema({
    day: Number,
    placeID: mongoose.ObjectId,
    vigilantID: mongoose.ObjectId,
    reference: String
})

module.exports = mongoose.model("shift", ShiftSchema)