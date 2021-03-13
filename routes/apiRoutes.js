const express = require('express');
const router = express.Router();
const Itinerary = require('../models/Itinerary')
const Vigilant = require('../models/Vigilant')
const Place = require('../models/Place')
const Shift = require('../models/Shift')
const itineraryBuilder = require('../utils/ItineraryBuilder')
const createAndIntegrate = require('../utils/createPlaceAndIntegrate')
const deletePlaceAndUpdateItinerary = require("../utils/deletePlaceAndUpdate")


// get the entire itinerary
// creating one before, if doesnt exists
router.get('/itinerary/', async(req,res,next) => {
	await itineraryBuilder()
	next()
}, async(req, res) =>{
  try {
      let itineraries = await Itinerary.find().sort({"shifts.day": 1});
      console.log(`Itineraries fetched.`);
      res.send({itineraries})
  } catch (err) {
      console.log("Erro at fetching itineraries:\n" + err)
  }
})

//get just the active itinerary(this month itinerary)
router.get("/itinerary/active/", async(req,res,next) => {
  try {
			let date = new Date()
      let activeItinerary = await Itinerary.findOne({month:date.getMonth() + 1, year: date.getFullYear()})
      console.log(`Active itinerary fetched: \nReference:${activeItinerary.month}-${activeItinerary.year} > ${activeItinerary.shifts.length} shifts fetched.`);
      res.send({activeItinerary})
  } catch (err) {
      console.log("Erro at fetching active itinerary:\n" + err)
  }
})

router.get('/shifts/', async(req,res) => {
	try {
		let date = new Date()
		let activeOnly = Object.keys(req.query).includes('active')
		let activeItinerary = await Itinerary.findOne({month:date.getMonth() + 1, year: date.getFullYear()})
		let shifts =  await (activeOnly ? Shift.find({_id: {$in: activeItinerary.shifts}}) : Shift.find())
		console.log(`Shifts fetched: \n${shifts}`)
		res.send({shifts})
	} catch (err) {
			console.log("Erro at fetching shifts:\n" + err)
	}
})

router.get('/place/', async(req,res) => {
    try {
        let places = await Place.find()
        console.log(`Places fetched: \n${places}`)
        res.send({places})
    } catch (err) {
        console.log("Erro at fetching places:\n" + err)
    }
})

router.get('/vigilant/', async(req,res) => {
    try {
        let vigilants = await Vigilant.find();
        console.log(`Vigilants fetched: \n${vigilants}`)
        res.send({vigilants})
    } catch (err) {
        console.log("Erro at fetching vigilants:\n" + err)
    }
})

////////////POSTS///////////////

router.post('/itinerary/', async(req,res) => {
	try{
		const itinerary = await Itinerary.create(req.body)
		res.send({itinerary})
	}catch(err){
		res.status(400).send({error:  "Impossible to create an itinerary.\n" + err})
	}
})

// if another place is created i have to add it 
// and it's shifts to the actual itinerary.
// In the next month, the place will generate it automatically
router.post('/place/',async(req,res,next) =>{

	const place = await createAndIntegrate(req.body)
	res.send({place})
	
})

router.post('/vigilant/', async(req,res) => {
	try{
		const vigilant = await Vigilant.create(req.body);
		res.send({vigilant});
	}catch{
		res.status(400).send({error:  "Impossible to create a vigilant.\n" + err})
	}
})


////////////DELETES////////////


router.delete('/itinerary/', async(req, res) => {
	try{
		await Itinerary.deleteOne({_id: req.query._id});
        const itineraries = await Itinerary.find();
        res.send({itineraries})
	}catch(err){
		console.log(`error: Impossible to delete an itinerary:\n${err}`)
	}
})

router.delete('/place/', async(req, res) => {
	try{
		await deletePlaceAndUpdateItinerary(req.query._id)
		res.send("OK")
	}catch(err){
		console.log(`error: Impossible to delete a place:\n${err}`)
	}
})

router.delete('/vigilant/', async(req, res) => {
	try{
		await Vigilant.deleteOne({_id: req.query._id});
        const vigilants = await Vigilant.find();
        res.send({vigilants})
	}catch(err){
		console.log(`error: Impossible to delete a vigilant:\n${err}`)
	}
})

////////////PUTS

router.put('/itinerary/', async(req,res) => {
	try{
		let body = req.body;
		let itinerary = await Itinerary.findOneAndUpdate({_id: req.query._id}, body)
		res.send({itinerary})
	}catch(err){
		console.log("Impossible to update an intinerary:\n" + err)
	}
})

router.put('/place/', async(req,res) => {
	try{
		let body = req.body;
		let place = await Place.findOneAndUpdate({_id: req.query._id}, body)
		res.send({place})
	}catch(err){
		console.log("Impossible to update a place:\n" + err)
	}
})

router.put('/vigilant/', async(req,res) => {
	try{
		let body = req.body;
		let vigilant = await Vigilant.findOneAndUpdate({_id: req.query._id}, body)
		res.send({vigilant})
	}catch(err){
		console.log("Impossible to update a vigilant:\n" + err)
	}
})

module.exports = router;