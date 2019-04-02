const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId


const guideSchema = new Schema({
  creator: {
    type: ObjectId,
    required: true,
    ref: 'User'
  },
  location: {
    type: String
  },
  title: {
    type: String
  },
  locations: [{
    type: ObjectId,
    ref: 'Place'
  }],
  comments: [{
    creator: ObjectId,
    name: String,
    comment: String
  }],
  places: [{
    name: String,
    description: String,
    what: String,
    location: String,
  }],
  image: {
    type: String
  },
  reviews: [{
    review: {
      type: Number
    },
    creator: {
      type: ObjectId,
      require: true
    },
    likes: {
      type: Number
    }
  }]
});

const Guide = mongoose.model('Guide', guideSchema);

module.exports = Guide;