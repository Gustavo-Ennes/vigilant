const express = require('express');
const router = express.Router();
const Itinerary = require('../models/Itinerary')
const Vigilant = require('../models/Vigilant')
const Place = require('../models/Place')
const Shift = require('../models/Shift')
const User = require('../models/User')
const Session = require('../models/Session')
const itineraryBuilder = require('../utils/ItineraryBuilder')
const createAndIntegrate = require('../utils/createPlaceAndIntegrate')
const deletePlaceAndUpdateItinerary = require("../utils/deletePlaceAndUpdate")
const deleteVigilantAndUpdateItinerary = require("../utils/deleteVigilantAndUpdate")
const bcrypt = require('bcrypt');

const hashPassword = async (password, saltRounds = 10) => {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash password
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
    }

    // Return null if error
    return null;
};

const comparePassword = async (password, hash) => {
    try {
        // Compare password
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.log(error);
    }

    // Return false if error
    return false;
};




function requireLogin (req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
};






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
		let text = (activeOnly ? "Active shifts" : "Shifts")
		let activeItinerary = await Itinerary.findOne({month:date.getMonth() + 1, year: date.getFullYear()})
		let shifts =  await (activeOnly ? Shift.find({_id: {$in: activeItinerary.shifts}}) : Shift.find())
		console.log(`${text} fetched: \n${shifts.length}`)
		res.send({shifts})
	} catch (err) {
			console.log("Erro at fetching shifts:\n" + err)
	}
})

router.get('/place/', async(req,res) => {
    try {
        let places = await Place.find()
        console.log(`Places fetched: \n${places.length}`)
        res.send({places})
    } catch (err) {
        console.log("Erro at fetching places:\n" + err)
    }
})

router.get('/vigilant/', async(req,res) => {
    try {
        let vigilants = await Vigilant.find();
        console.log(`Vigilants fetched: \n${vigilants.length}`)
        res.send({vigilants})
    } catch (err) {
        console.log("Erro at fetching vigilants:\n" + err)
    }
})

router.get('/logout/', async(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
    })
    res.status(200).send()

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

router.post("/shifts/", async(req,res)=>{
	try{
		const shift = await Shift.create(req.body);
		res.send({shift});
	}catch{
		res.status(400).send({error:  "Impossible to create a shift.\n" + err})
	}
})

router.post('/user/', async(req,res) => {
	try{
		req.body['password'] = await hashPassword(req.body['password'])
		let u = await User.create(req.body)
		res.status(200).send()
	}catch{
		res.status(400).send({error:  "Impossible to create a user.\n" + err})
	}
})

router.post('/login/', async(req,res) => {
	try{
		let user
		let passTest = false
		console.log("Body: " + JSON.stringify(req.body))
		if(Object.keys(req.body).includes('pass') && Object.keys(req.body).includes('name')){
			user = await User.findOne({name: req.body['name']})
			if(user){
				passTest = await comparePassword(req.body['pass'], user['password'])
				if(passTest){
					req.session.user = user._id
					let s = await Session.findOne({user: user._id})
					if(!s){
						await Session.create(req.body)
					}
				}
			}
		}else{
			console.log("session: " + JSON.stringify(req.session))
			user = await User.findOne({_id: req.session.user})
			console.log("User: " + JSON.stringify(user))
			if(user){
				let session = await Session.find({user: user._id})
				console.log(JSON.stringify(session))
				if(session && req.session.user == user._id){
					passTest = true
				}
			}
		}
		passTest ? res.send(req.session) : res.status(401).send({user: null})
	}catch(err){
		res.status(400).send({error:  "Impossible to login a user.\n" + err})
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
		await deleteVigilantAndUpdateItinerary(req.query._id);
		res.send('ok')
	}catch(err){
		console.log(`error: Impossible to delete a vigilant:\n${err}`)
	}
})

router.delete('/shifts/', async(req, res) => {
	try{
		await Shift.deleteOne({_id: req.query._id});
		const shifts = await Shift.find();
		res.send({shifts})
	}catch(err){
		console.log(`error: Impossible to delete a shift:\n${err}`)
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

router.put('/shifts/', async(req,res) => {
	try{
		let day = new Date().getDate()
		let body = req.body;
		let shift = await Shift.findOne({_id: req.query._id})
		if(shift.day >= day){
			await Shift.update({_id: req.query._id}, body)
			res.send({shift})
		}else{
			res.status(400).send("Impossible to update a yesterday or before shift")
		}
	}catch(err){
		console.log("Impossible to update a shift:\n" + err)
	}
})

module.exports = router;