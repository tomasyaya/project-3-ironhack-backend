const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const chatSchema = new Schema({
  creator: {
    type: ObjectId,
    ref: 'User'
  },
  participant: {
    type: ObjectId,
    ref: 'User'
  },
  messages:[{
    title: {
      type: String
    },
    message: {
      type: String
    },
    author: {
      type: String
    }
  }],
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;