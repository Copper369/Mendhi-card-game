require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const gameManager = require('./game/gameManager');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mendhikot')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// REST API routes
app.get('/api/rooms', (req, res) => {
  const rooms = gameManager.getAllRooms();
  res.json(rooms);
});

app.post('/api/rooms', (req, res) => {
  const { roomName, playerName } = req.body;
  const room = gameManager.createRoom(roomName);
  res.json(room);
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('join_room', ({ roomId, playerName }) => {
    console.log(`Player ${playerName} attempting to join room ${roomId}`);
    const result = gameManager.joinRoom(roomId, socket.id, playerName);
    if (result.success) {
      socket.join(roomId);
      socket.emit('joined_room', result.room);
      
      // Notify room about join/reconnection
      if (result.reconnected) {
        io.to(roomId).emit('player_reconnected', { 
          playerName,
          message: `${playerName} has reconnected!`
        });
      }
      
      io.to(roomId).emit('game_update', result.room);
      console.log(`Room ${roomId} now has ${result.room.players.length} players`);
      
      if (result.room.players.length === 4 && !result.room.gameState) {
        console.log(`All players joined room ${roomId}, entering lobby`);
        const updatedRoom = gameManager.startGame(roomId);
        io.to(roomId).emit('game_started', updatedRoom);
      }
    } else {
      console.log(`Failed to join room: ${result.message}`);
      socket.emit('error', result.message);
    }
  });

  socket.on('player_ready', ({ roomId }) => {
    const result = gameManager.playerReady(roomId, socket.id);
    if (result.success) {
      io.to(roomId).emit('game_update', result.room);
      
      if (result.allReady) {
        io.to(roomId).emit('dealing_cards', result.room);
        
        // After dealing animation, trigger trump selection
        setTimeout(() => {
          io.to(roomId).emit('game_update', gameManager.getRoom(roomId));
          gameManager.triggerAI(roomId, io);
        }, 3500);
      }
    }
  });

  socket.on('choose_trump', ({ roomId, suit }) => {
    const result = gameManager.chooseTrump(roomId, socket.id, suit);
    if (result.success) {
      const playerPosition = result.room.players.findIndex(p => p.socketId === socket.id);
      const team = playerPosition % 2 === 0 ? 'teamA' : 'teamB';
      io.to(roomId).emit('trump_selected', { trumpSuit: suit, team });
      
      // Notify that remaining cards are being dealt
      io.to(roomId).emit('dealing_remaining_cards', result.room);
      
      // After a short delay, update game state with all cards
      setTimeout(() => {
        io.to(roomId).emit('game_update', result.room);
        
        // Trigger AI if current player is AI
        setTimeout(() => {
          gameManager.triggerAI(roomId, io);
        }, 1000);
      }, 1500); // 1.5 second animation for remaining cards
    } else {
      socket.emit('error', result.message);
    }
  });

  socket.on('play_card', ({ roomId, cardIndex }) => {
    const result = gameManager.playCard(roomId, socket.id, cardIndex);
    if (result.success) {
      io.to(roomId).emit('game_update', result.room);
      
      if (result.trickComplete) {
        setTimeout(() => {
          io.to(roomId).emit('trick_result', result.trickWinner);
          gameManager.nextTrick(roomId);
          const updatedRoom = gameManager.getRoom(roomId);
          io.to(roomId).emit('game_update', updatedRoom);
          
          if (result.roundComplete) {
            io.to(roomId).emit('round_result', result.roundResult);
            
            // Check if match is complete or start next round
            setTimeout(() => {
              const nextRoundResult = gameManager.nextRound(roomId);
              if (nextRoundResult.matchComplete) {
                io.to(roomId).emit('match_dashboard', nextRoundResult.dashboard);
              } else {
                io.to(roomId).emit('next_round_start', nextRoundResult.room);
                io.to(roomId).emit('dealing_cards', nextRoundResult.room);
                
                // After dealing animation, trigger trump selection
                setTimeout(() => {
                  io.to(roomId).emit('game_update', gameManager.getRoom(roomId));
                  gameManager.triggerAI(roomId, io);
                }, 3500);
              }
            }, 5000);
          } else {
            // Trigger AI for next trick
            gameManager.triggerAI(roomId, io);
          }
        }, 2000);
      } else {
        // Check if next player is AI
        gameManager.triggerAI(roomId, io);
      }
    } else {
      socket.emit('error', result.message);
    }
  });

  socket.on('reset_game', ({ roomId }) => {
    const result = gameManager.resetGame(roomId);
    if (result.success) {
      io.to(roomId).emit('game_reset', result.room);
    }
  });

  socket.on('chat_message', ({ roomId, message }) => {
    const room = gameManager.getRoom(roomId);
    if (room) {
      const player = room.players.find(p => p.socketId === socket.id);
      const chatMsg = {
        playerName: player?.name || 'Unknown',
        message,
        timestamp: Date.now()
      };
      room.chatHistory.push(chatMsg);
      io.to(roomId).emit('chat_message', chatMsg);
    }
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    gameManager.handleDisconnect(socket.id, io);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { io };
