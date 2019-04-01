const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide');
const Chat = require('../models/test');
const User = require('../models/User');
const { checkEqual, checkIfEmpty, checkEmptyFields } = require('../helpers/validation')
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


// ------------- EDIT GUIDE (ADD PLACES) --------------------
router.put('/guide/:id', isLoggedIn(), async(req, res, next) => {
  const { _id: userId } = req.session.currentUser;
  const { id } = req.params;
  const { location, name, what, description } = req.body;
  const place = { location, name, what, description }
  try {
    if(checkEmptyFields(location, name, what, description)){
      next(error)
    }
    const guide = await Guide.findById(id).populate('creator')
    const creatorId = guide.creator._id;
    if(checkEqual(creatorId, userId)){
      const updateGuide = await Guide.findByIdAndUpdate(id, {$push: {places: place}}, {new: true});
      res.json(updateGuide)
    }
    res.json({message: 'Not your guide, cant update it'})
  }catch(error){
    next(error)
  }
})

// --------- ADD MAIN IMAGE ------------
router.put(`/image/:id`, isLoggedIn(), async (req, res, next) => {
  const { id } = req.params;
  const { image } = req.body;
  const newImage = {
    image
  }
  try {
    const addImage = await Guide.findByIdAndUpdate(id, newImage)
    res.json(addImage)
  } catch(error) {
    next(error)
  }
})

// ---------- COMMENTS -------------

router.put('/comments/:id', isLoggedIn(), async (req, res, next) => {
  const { _id } = req.session.currentUser;
  const { id } = req.params;
  const { message } = req.body;
  try {
    const user = await User.findById(_id);
    const { username } = user;
    const newComment = {
      creator: _id,
      name: username,
      comment: message
    }
    const comment = await Guide.findByIdAndUpdate(id, {$push: { comments: newComment }}, { new: true });
    res.json(comment)
  } catch(error) {
    next(error)
  }
});

// --------------- DELETE COMMENT ---------

router.delete('/comments/:guide/:id', isLoggedIn(), async (req, res, next) => {
  const { id, guide } = req.params;
  const comment = {
    _id: id
  }
  try {
    const removeComment = await Guide.findByIdAndUpdate(guide, {$pull: {comments: comment}}, {new: true}) 
    res.json(removeComment)
  } catch(error) {
    next(error)
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

// ------------- CREATE NEW CHAT ------------

router.post('/chat/:id', isLoggedIn(), async (req, res, next) => {
  const { _id } = req.session.currentUser;
  const { id } = req.params;
  const newChat = {
    creator: _id,
    participant: id
  }
  try {
    const checkChat = await Chat.find(newChat)
    if(checkIfEmpty(checkChat)){
      const chat = await Chat.create(newChat, { new: true })
      res.json(chat)
    }
  } catch(error) {
    next(error)
  }
})

// ------- ADD MESSAGE TO CHAT ---------
router.put('/chat/:id', isLoggedIn(), async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.session.currentUser;
  const { message } = req.body;
  const searchChat = {
    creator: _id,
    participant: id
  }
  try {
    const { username } = await User.findById(_id);
    const findChat = await Chat.find(searchChat);
    const { _id: chatId } = findChat[0]
    const newMessage = {
      author: username,
      message: message
    }
    if(!checkIfEmpty(message)){   
      const addMessage = await Chat.findByIdAndUpdate(chatId, {$push: { messages: newMessage } }, { new: true })
      res.json(addMessage);
      next()
    }
    next()
  } catch(error) {
    next(error)
  }
});

// --------- REPLAY MESSAGE ----

router.put('/replay/:id', isLoggedIn(), async (req, res, next) => {
  const { id: chatId } = req.params;
  const { _id } = req.session.currentUser;
  const { message } = req.body;
  try {
    const { username } = await User.findById(_id)
    const newMessage = {
      author: username,
      message: message
    }
    const replay = await Chat.findByIdAndUpdate(chatId, {$push: { messages: newMessage } }, { new: true })
    console.log(replay)
    res.json(replay);
  } catch(error) {
    next(error)
  }
})

// --------- GET REPLAY ---------

router.get('/replay/:id', isLoggedIn(), async (req, res, next) => {
  const { id } = req.params;
  console.log(id)
  try {
    const chat =  await Chat.findById(id).populate('messages').populate('creator').populate('participants')
    console.log(chat)
    res.json(chat)
  } catch(error){
    console.log(error)
  }
});
// ----------- GET CHAT ---------

router.get('/chat/:id', isLoggedIn(), async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.session.currentUser;
  const searchChat = {
    creator: _id,
    participant: id
  }
  try {
    const chat = await Chat.find(searchChat);
    res.json(chat)
  } catch(error) {
    next(error)
  }
})



//------ DELETE MESSAGE FROM CHAT ------
router.delete('/chat/:id/:participant', isLoggedIn(), async (req, res, next) => {
  const { id, participant } = req.params;
  const chat = {
    participant
  }
  try {
    const findChat = await Chat.find(chat)
    const { _id } = findChat[0]
    const removeChat = await Chat.findByIdAndUpdate(_id, {$pull: { messages: { _id: id } } }, { new: true })
    res.json(removeChat)
  } catch(error){
    console.log(error)
  }
})

// -------- DELETE REPLAY -------
router.delete('/replay/:chat/:message', isLoggedIn(), async (req, res, next) => {
  const { chat, message } = req.params;
  try {
    const remove = await Chat.findByIdAndUpdate(chat, {$pull: { messages: { _id: message } }}, { new: true })
    res.json(remove)
  } catch(error) {
    next(error)
  }
})



//----------------- GET SPECIFIC GUIDE -------------
router.get('/guide/:id', isLoggedIn(), async (req, res, next) => {
  const { id } = req.params;
  try {
    const guide = await Guide.findById(id).populate('comments').populate('creator');
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

  //----------------GET PARTICIPANT ---------------------
  router.get('/participant/:id', isLoggedIn(), async(req, res, next) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      res.json(user)
    }catch(error){
      next(error)
    }
  })

  // ----------- GET  MESSAGES -------

  router.get('/messages/:user', isLoggedIn(), async(req, res, next) => {
    const { _id } = req.session.currentUser;
    const { user } = req.params;
    const message = {
      [user]: _id
    }
    try {
      const chat = await Chat.find(message).populate('creator').populate('participant').populate('messages')
      res.json(chat)
    } catch(error) {
      console.log(error)
    }
  })



module.exports = router;