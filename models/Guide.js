const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId


const guideSchema = new Schema({
  creator: {
    type: ObjectId,
    required: true
  },
  location: {
    type: String
  },
  title: {
    type: String
  },
  places: [{
    name: String,
    description: String,
    what: String,
    location: String
  }],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Guide = mongoose.model('Guide', guideSchema);

module.exports = Guide;