const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  roomName: String,
  createdAt: { type: Date, default: Date.now },
  players: [{
    name: String,
    socketId: String,
    isAI: Boolean
  }],
  gameHistory: [{
    round: Number,
    winner: String,
    scores: Object,
    timestamp: Date
  }]
});

module.exports = mongoose.model('Room', roomSchema);
