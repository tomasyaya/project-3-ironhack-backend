const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide');
const Chat = require('../models/test');
const User = require('../models/User');
const Place = require('../models/Place');
const { checkEqual, checkIfEmpty, checkEmptyFields } = require('../helpers/validation')
const { isLoggedIn } = require('../helpers/middlewares');



// --------- CREATE NEW PLACE ---------
router.post('/:id', isLoggedIn(), async (req, res, next) => {
  const { name, location, what, description } = req.body;
  const { id } = req.params;
  const place = {
    creator: id,
    name,
    location,
    type: what,
    description
  }
  if(checkEmptyFields(name, location, what, description)){
    next(error)
    return
  }
  try {
    const newPlace = await Place.create(place)
    res.json(newPlace)
  } catch(error) {
    next(error)
  }
})

// --------- GET PLACES -----------
router.get('/:id', isLoggedIn(), async (req, res, next) => {
  const { id } = req.params;
  try {
    const places = await Place.find({creator: id})
    res.json(places)
  } catch(error){
    next(error)
  }
})

//-------- DELETE PLACE -------
router.delete(`/:id`, isLoggedIn(), async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedPlace = await Place.findByIdAndDelete(id)
    res.json(deletedPlace)
  } catch(error) {
    next(error)
  }
})

// ------- GET PLACE --------
router.get('/one/:id', isLoggedIn(), async (req, res, next) => {
  const { id } = req.params;
  try {
    const place = await Place.findById(id).populate('images')
    res.json(place)
  } catch(error) {
    next(error)
  }
})

// --------- ADD IMAGE ------------
router.put(`/:id`, isLoggedIn(), async (req, res, next) => {
  const { id } = req.params;
  const { image } = req.body;
  const newImage = {
    url: image
  }
  console.log(newImage)
  try {
    const addImage = await Place.findByIdAndUpdate(id, {$push: { images: newImage } }, { new: true })
    console.log(addImage)
    res.json(addImage)
  } catch(error) {
    next(error)
  }
})



module.exports = router;