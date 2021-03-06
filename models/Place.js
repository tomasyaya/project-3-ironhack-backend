const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId


const placeSchema = new Schema({
  creator: {
    type: ObjectId,
    ref: 'Guide'
  },
  name: {
    type: String
  },
  location: {
    type: String
  },
  description: {
    type: String
  },
  type: {
    type: String
  },
  images: [{
    url: {
      type: String
    }
  }],
  comments: [{
    creator: {
      type: ObjectId,
      ref: 'User'
    },
    message: {
      type: String,
    },
    author: {
      type: String
    }
  }],
  likes: [{
    user: {
      type: ObjectId,
      ref: 'User'
    },
    like: {
      type: Number
    },
    place: {
      type: ObjectId,
      ref: 'Place'
    }
  }],
  reviews: [{
    user: {
      type: ObjectId,
      ref: 'User'
    },
    review: {
      type: Number
    }
  }]
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;