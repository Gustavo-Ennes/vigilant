

const Itinerary = require('../models/Itinerary'),
      Place = require('../models/Place')
      Shift = require('../models/Shift')



// for each day and for each place and for each reference of place
// a shift will be created. Total shifts will be (qtdDays * qtdPlaces * qtdPlaceReferences)
// and will return an array with the shift id's created
async function createShifts(numOfDays, places){
  var ids = []
  console.log(`Creating shifts: ${numOfDays} days, ${places.length} places.`)
  try{
    for(let i = 1; i <= numOfDays; i++){
      for(let j = 0; j < places.length; j++){
        for(let k = 0; k < places[j].references.length; k++){
          let payload = {
            day: i,
            placeID: places[j]._id,
            reference: places[j].references[k],
            vigilantID: null,
          }
          let shift = await Shift.create(payload)
          ids.push(shift._id)
        }
      }
    }
  }catch(err){
    console.error("Error creating shifts to actual itinerary:\n" + err)
  }
  console.log(`${ids.length} shifts created.`)
  return ids
}



///DONT USE ARROW FUNCTIONS TO DEFINE METHODS IN NODE, animal!
async function build(){
  const date = new Date()
  const hasToRun = (await Itinerary.findOne({month:date.getMonth() + 1, year:date.getFullYear()})) === null ? true : false
  const places = await Place.find()
  if(hasToRun){
    console.log("Creating this month itinerary....")
    const date = new Date()
    let numOfDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    let payload = {
      month: date.getMonth() + 1,
      year: date.getFullYear()
    }
    let shifts = await createShifts(numOfDays, places)
    console.log("Shifts ids:\n" + shifts.length)
    payload.shifts = shifts
    await Itinerary.create(payload)
    console.log(`Itinerary created: ${numOfDays} days, ${shifts.length} shifts.`)
  }else{
    console.log("Active itinerary already created.")
  }
}


module.exports = build