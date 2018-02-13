
var mongoose = require('mongoose');

var roomEnum = ['Java','JavaScript', 'Python','Scala'];


var ChatSchema = new mongoose.Schema({
  room: {String, enum: roomEnum},
  nickname: String,
  message: String,
  updated_at: { type: Date, default: Date.now },
  liked_count: {type: Number, default: 0 },
  liked_by:[]
});

module.exports = mongoose.model('Chat', ChatSchema);
