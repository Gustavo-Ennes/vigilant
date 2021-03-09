// this function creates shifts to a recent created place
// in the types param: an array with the shifts periods corresponding to that place
// ex: ['morning', afternoon']; in case of shifts == null, all shifts will be attached to days array

function createShifts(qtdDays, place){
  let shifts = []
  for(let i = 1; i <= qtdDays; i++){
    place.references.map(ref =>{
      shifts.push({
        day: i,
        placeID: place._id,
        vigilantID: null,
        reference: ref
      })
    })
  }
  return shifts  
}


async function createPlaceAndIntegrate(reqBody){
  const Place = require("../models/Place"),
    Itinerary = require("../models/Itinerary")
  let place = null

  try{
    const date = new Date()
		place = await Place.create(reqBody)
    let activeItinerary = await Itinerary.findOne({month:date.getMonth(), year: date.getFullYear()})
    let numOfDays = new Date(date.getFullYear(), date.getMonth(), 0).getDate()
    let shifts = createShifts(numOfDays, place)

    await Itinerary.updateOne(
      {_id: activeItinerary._id},
      {$push: {shifts: {$each: shifts}}}
    )
    return place
	}catch(err){
    Place.findByIdAndDelete({_id: place._id})
		console.log({error:  "Impossible to create shifts to a recent created place:\n" + err})
	}
}

module.exports = createPlaceAndIntegrate