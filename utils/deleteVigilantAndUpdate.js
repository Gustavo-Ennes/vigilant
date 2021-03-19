const Vigilant = require("../models/Vigilant"),
	Shift = require('../models/Shift')


async function deleteAndUpdateItinerary(vigilantID){
	let date = new Date()
	// delete the vigilant
	await Vigilant.remove({_id: vigilantID})
	// change vigilantID to null to all shifts with this vigilantID
    await Shift.updateMany({vigilantID: vigilantID, day: {$gte: date.getDate()}}, {vigilantID: null})
}

module.exports = deleteAndUpdateItinerary