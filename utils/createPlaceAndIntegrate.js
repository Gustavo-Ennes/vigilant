// this function creates shifts to a recent created place
// in the types param: an array with the shifts periods corresponding to that place
// ex: ['morning', afternoon']; in case of shifts == null, all shifts will be attached to days array

const Shift = require('../models/Shift')

function createPayloads(qtdDays, place){
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

async function createShifts(payloads){
  let shifts = []
  for(let i = 0; i < payloads.length; i++){
    let s = await Shift.create(payloads[i])
    shifts.push(s)
  }
  return shifts
}

function createShiftsIdsList(shifts){
  let names = []
  shifts.map(shift => {
    names.push(shift._id)
  })
  return names
}


async function createPlaceAndIntegrate(reqBody){
  const Place = require("../models/Place"),
    Itinerary = require("../models/Itinerary")
  let place = null
  //this function isn't working properly, check this shit
  try{
    const date = new Date()
    console.log(`A place will be created with req.body:\n${reqBody}`)
		place = await Place.create(reqBody)
    console.log(`Let's see the place:\n${JSON.stringify(place)}`)
    let activeItinerary = await Itinerary.findOne({month:date.getMonth() + 1, year: date.getFullYear()})
    console.log(`Active itinerary loaded: ref${activeItinerary.month}/${activeItinerary.year}`)
    console.log(`Active itinerary shifts quantity now: ${activeItinerary.shifts.length}`)
    let numOfDays = new Date(activeItinerary.year, activeItinerary.month, 0).getDate()
    console.log(`The number of days calculated: ${numOfDays}`)
    let payloads = createPayloads(numOfDays, place)
    console.log(`The payloads:\n${JSON.stringify(payloads)}`)
    let shifts = await createShifts(payloads)
    console.log(`Shifts created with payloads:\n${JSON.stringify(shifts)}`)
    let shiftsIds = createShiftsIdsList(shifts)
    console.log(`The shift id list to include to active itinerary:\n${JSON.stringify(shiftsIds)}`)

    console.log(`The itinerary will be updated`)
    await Itinerary.updateOne(
      {_id: activeItinerary._id},
      {$push: {shifts: {$each: shiftsIds}}}
    )
    console.log(`Itinerary updated. Quantity of shifts now: ${activeItinerary.shifts.length}`)
    return place
	}catch(err){
		console.log({error:  "Impossible to create shifts to a recent created place:\n" + err})
	}
}

module.exports = createPlaceAndIntegrate