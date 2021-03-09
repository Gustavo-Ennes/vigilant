const Itinerary = require('../models/Itinerary'),
  Place = require('../models/Place')


async function deleteAndUpdate(placeID){
  try{
    console.log("Deleting a place and updating actual itinerary...")
    await Place.findByIdAndDelete({_id: placeID})
    await Itinerary.findByIdAndUpdate(
      {_id: placeID},
      {$pull: {shifts: {_id: placeID}}}
    )
    console.log("...done.")
  }catch(err){
    console.log("Error at deleting and updating itinerary::\n " + err)
  }
}

module.exports = deleteAndUpdate