const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
  name: String,
  socketId: String,
  messages: [{ type: String }],
  
});

const ChatModel = mongoose.model('messages', chatSchema);

module.exports = ChatModel;

