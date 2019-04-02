const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide');
const Chat = require('../models/test');
const User = require('../models/User');
const Place = require('../models/Place');
const { checkEqual, checkIfEmpty, checkEmptyFields } = require('../helpers/validation')
const { isLoggedIn } = require('../helpers/middlewares');


router.post('/', isLoggedIn(), async (req, res, next) => {

})


module.exports = router;