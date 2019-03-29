const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide')
const User = require('../models/User')
const { checkEqual, checkIfEmpty } = require('../helpers/validation')
const { isLoggedIn } = require('../helpers/middlewares');



// ----------- CREATE GUIDE -----------------
router.post('/guide', isLoggedIn(), async (req, res, next) => {
  const { _id } = req.session.currentUser;
  const { location, title } = req.body;
  try {
    const newUser = await User.findById(_id)
    const guide = {
      location,
      title,
      creator: newUser._id
    }
    const newGuide = await Guide.create(guide)
    res.json(newGuide)
  }catch(error){
    next(error)
  }
})


// ------------- EDIT GUIDE --------------------
router.put('/guide/:id', isLoggedIn(), async(req, res, next) => {
  const { _id: userId } = req.session.currentUser;
  const { id } = req.params;
  const { location, name, what, description } = req.body;
  const place = { location, name, what, description }
  try {
    const guide = await Guide.findById(id).populate('creator')
    const creatorId = guide.creator._id;
    if(checkEqual(creatorId, userId)){
      const updateGuide = await Guide.findByIdAndUpdate(id, {$push: {places: place}}, {new: true});
      console.log(updateGuide)
      res.json(updateGuide)
    }
    res.json({message: 'Not your guide, cant update it'})
  }catch(error){
    res.json(error)
  }
})

// ------------- DELETE PLACE IN GUIDE -------

router.put('/places/:id/:place', isLoggedIn(), async (req, res, next) => {
  const { id, place } = req.params;
  const remove = {
    _id: place
  }
  try {
    const deletePlace = await Guide.findByIdAndUpdate(id, {$pull: {places: remove }}, {new: true})
    res.json(deletePlace)
    console.log(deletePlace)
  }catch(error){
    console.log(error)
  }
})

//------------ ADD/REMOVE GUIDES TO/FROM FAVORITE ------------
router.put('/favorites/:id', isLoggedIn(), async(req, res, next) => {
  const { id } = req.params;
  const { _id } = req.session.currentUser;
  try{
    const guide = await Guide.findById(id);
    const hasFavorite = await User.find({favorites: guide._id})
    if(checkIfEmpty(hasFavorite)){
      const addToFavorite = await User.findByIdAndUpdate(_id, {$push: {favorites: guide}}, {new: true})  
      res.json(addToFavorite)
    }
    if(!checkIfEmpty(hasFavorite)){
      const removeFavorite = await User.findByIdAndUpdate(_id, {$pull: {favorites: guide._id}}, {new: true})
      res.json(removeFavorite)
    }
  } catch(error){
    next(error)
  }
})

// -------------------- DELETE GUIDES ---------------
router.delete('/:id', isLoggedIn(), async (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.session.currentUser;
  try {
    const guide = await Guide.findById(id).populate('creator')
    const creatorId = guide.creator._id;
    if(checkEqual(creatorId, userId)){
      await Guide.findByIdAndDelete(id)
      res.status(200).json({message: 'Guide Deleted!'})
    }
    if(!checkEqual(creatorId, userId)){
      res.json({message: 'This is not your Guide, you can`t delete it!'})
    }
  } catch(error){
    next(error)
  }
})

//----------------- GET SPECIFIC GUIDE -------------
router.get('/guide/:id', isLoggedIn(), async (req, res, next) => {
  const { id } = req.params;
  try {
    const guide = await Guide.findById(id);
    res.json(guide)
  } catch(error){
    next(error)
  }
})

// ----------------- GET ALL GUIDES ----------------
  router.get('/guides', isLoggedIn(), async(req, res, next) => {
    try {
      const guides = await Guide.find()
      res.json(guides)
    }catch(error) {
      next(error)
    }
  })

//------------------ GET GUIDES CREATED BY ME --------------
  router.get('/guides/user', isLoggedIn(), async(req, res, next) => {
    const { _id } = req.session.currentUser;
    try{
      const guides = await Guide.find({creator: _id})
      res.json(guides)
    }catch(error){
      next(error)
    }
  })

// ------------ GET FAVORITES ---------------
router.get('/favorites', isLoggedIn(), async (req, res, next) => {
  const { _id } = req.session.currentUser;
  try {
    const favorites = await User.findById(_id).populate('favorites');
    console.log(favorites);
    res.json(favorites)
  } catch(error){
    console.log(error)
  }
})


//----------------GET USER ---------------------
  router.get('/user', isLoggedIn(), async(req, res, next) => {
    const { _id } = req.session.currentUser;
    try {
      const user = await User.findById(_id);
      res.json(user)
    }catch(error){
      next(error)
    }
  })


module.exports = router;