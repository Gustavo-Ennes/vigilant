const mongoose = require('../database/connection');

const UserSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    companyName: String,
    createdAt: {type: Date, default: Date.now},

});

module.exports = mongoose.model('user', UserSchema)