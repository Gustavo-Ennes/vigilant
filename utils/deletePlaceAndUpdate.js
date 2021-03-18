const Itinerary = require('../models/Itinerary'),
  Place = require('../models/Place')
  Shift = require('../models/Shift')
  ObjectId = require('mongoose').Types.ObjectId;

function getShiftsIdList(shifts){
  let list = []
  for(let i = 0; i < shifts.length; i++){
    list.push(shifts[i]._id)
  }
  return list
}


async function deleteAndUpdate(placeID){
  try{
    let date = new Date()

    console.log("Deleting a place and updating actual itinerary...")

    await Place.findByIdAndDelete({_id: placeID})
    let shiftsRelated = await  Shift.find({placeID: placeID})
    let shiftList = getShiftsIdList(shiftsRelated)
    let iti = await Itinerary.findOne({year:date.getFullYear(), month: date.getMonth() + 1})
    await Itinerary.findOneAndUpdate({_id: iti._id},{$pull: {"shifts": {$in: shiftList}}})
    await Shift.deleteMany({placeID: placeID})

    console.log("...done.")
  }catch(err){
    console.log("Error at deleting and updating itinerary::\n " + err)
  }
}

module.exports = deleteAndUpdate