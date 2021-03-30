const mongoose = require('../database/connection');

const SessionSchema = new mongoose.Schema({
	cookie: Object,
	user: {type: String, required: true, unique: true}
});

module.exports = mongoose.model("session", SessionSchema)