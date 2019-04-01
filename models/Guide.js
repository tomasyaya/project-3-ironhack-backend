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
    image: String,
    images: [{
      image_url: {
        type: String
      }
    }],
    comments: [{
      creator: {
        type: ObjectId,
        ref: 'User'
      },
      author: {
        type: String
      },
      message: {
        type: String
      }
    }]
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