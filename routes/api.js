const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide')
const User = require('../models/User')
const { checkEqual } = require('../helpers/validation')



// ----------- CREATE GUIDE -----------------
router.post('/guide', async (req, res, next) => {
  const { _id } = req.session.currentUser;
  const { location, title } = req.body;
  try {
    const newUser = await User.findById(_id)
    console.log(newUser._id)
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
router.put('/guide/:id', async(req, res, next) => {
  const { _id: userId } = req.session.currentUser;
  const { id } = req.params;
  const { location, name, what, description } = req.body;
  const place = { location, name, what, description }
  try {
    const guide = await Guide.findById(id).populate('creator')
    const creatorId = guide.creator._id;
    if(checkEqual(creatorId, userId)){
      const updateGuide = await Guide.findByIdAndUpdate(id, {$push: {places: place}}, {new: true});
      res.json(updateGuide)
    }
    res.json({message: 'Not your guide, cant update it'})
  }catch(error){
    res.json(error)
  }
})

  // ----------------- GET ALL GUIDES ----------------
  router.get('/guides',  async(req, res, next) => {
    try {
      const guides = await Guide.find()
      res.json(guides)
    }catch(error) {
      next(error)
    }
  })

  //------------------ GET GUIDES CREATED BY ME --------------

  router.get('/guides/user', async(req, res, next) => {
    const { _id } = req.session.currentUser;
    try{
      const guides = await Guide.find({creator: _id})
      res.json(guides)
    }catch(error){
      next(error)
    }
  })


  //----------------GET USER ---------------------
  router.get('/user', async(req, res, next) => {
    const { _id } = req.session.currentUser;
    try {
      const user = await User.findById(_id);
      console.log(user)
      res.json(user)
    }catch(error){
      next(error)
    }
  })


module.exports = router;