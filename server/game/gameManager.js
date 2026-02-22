const { createDeck, shuffleDeck, dealCards } = require('./deck');

const rooms = new Map();
let ioInstance = null;

function setIO(io) {
  ioInstance = io;
}

function createRoom(roomName) {
  const roomId = Math.random().toString(36).substring(7);
  const room = {
    roomId,
    roomName: roomName || `Room ${roomId}`,
    players: [],
    gameState: null,
    chatHistory: []
  };
  rooms.set(roomId, room);
  return room;
}

function joinRoom(roomId, socketId, playerName) {
  const room = rooms.get(roomId);
  if (!room) return { success: false, message: 'Room not found' };
  
  // Check if room already has 4 human players
  const humanPlayers = room.players.filter(p => !p.isAI);
  if (humanPlayers.length >= 4) return { success: false, message: 'Room full' };
  
  // Check if player already in room
  if (room.players.find(p => p.socketId === socketId)) {
    return { success: false, message: 'Already in room' };
  }
  
  // Replace AI or add new player
  const aiIndex = room.players.findIndex(p => p.isAI);
  if (aiIndex !== -1) {
    room.players[aiIndex] = {
      socketId,
      name: playerName,
      isAI: false,
      position: aiIndex
    };
  } else {
    room.players.push({
      socketId,
      name: playerName,
      isAI: false,
      position: room.players.length
    });
  }

  // Add AI players to fill remaining slots
  while (room.players.length < 4) {
    room.players.push({
      socketId: `ai-${Math.random().toString(36).substring(7)}`,
      name: `AI Player ${room.players.length + 1}`,
      isAI: true,
      position: room.players.length
    });
  }

  return { success: true, room };
}

function startGame(roomId) {
  const room = rooms.get(roomId);
  if (!room || room.players.length !== 4) return;

  // Set game to lobby state first
  room.gameState = {
    phase: 'lobby', // lobby, dealing, trump_selection, playing
    hands: [],
    currentTurn: 0,
    trumpSuit: null,
    trumpChoosingTeam: 0,
    waitingForTrumpSelection: false,
    tableCards: [],
    capturedCards: { teamA: [], teamB: [] },
    tensCaptured: { teamA: [], teamB: [] }, // Store actual ten cards
    tricksWon: { teamA: 0, teamB: 0 },
    teamScores: { teamA: 0, teamB: 0 },
    leadSuit: null,
    trickNumber: 0,
    roundNumber: 1,
    lastRoundWinner: null,
    totalRounds: 5,
    readyPlayers: []
  };
  
  return room;
}

function playerReady(roomId, socketId) {
  const room = rooms.get(roomId);
  if (!room || !room.gameState) return { success: false };

  if (!room.gameState.readyPlayers.includes(socketId)) {
    room.gameState.readyPlayers.push(socketId);
  }

  // If all players ready, start dealing
  if (room.gameState.readyPlayers.length === 4) {
    dealCardsToPlayers(roomId);
    return { success: true, allReady: true, room };
  }

  return { success: true, allReady: false, room };
}

function dealCardsToPlayers(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  const deck = shuffleDeck(createDeck());
  
  // Deal only 5 cards initially
  const initialHands = [];
  for (let i = 0; i < 4; i++) {
    initialHands.push(deck.splice(0, 5));
  }

  // Store remaining deck for later
  room.gameState.remainingDeck = deck;
  room.gameState.phase = 'dealing';
  room.gameState.hands = initialHands.map((hand, i) => ({ 
    playerId: room.players[i].socketId, 
    cards: hand 
  }));

  // After dealing animation, move to trump selection
  setTimeout(() => {
    room.gameState.phase = 'trump_selection';
    room.gameState.waitingForTrumpSelection = true;
  }, 3000); // 3 second dealing animation
}

function chooseTrump(roomId, socketId, suit) {
  const room = rooms.get(roomId);
  if (!room || !room.gameState) return { success: false, message: 'Game not started' };
  
  if (!room.gameState.waitingForTrumpSelection) {
    return { success: false, message: 'Trump already selected' };
  }

  // Check if player is from the team that should choose
  const playerPosition = room.players.findIndex(p => p.socketId === socketId);
  const playerTeam = playerPosition % 2 === 0 ? 0 : 1;
  
  if (playerTeam !== room.gameState.trumpChoosingTeam) {
    return { success: false, message: 'Not your team\'s turn to choose trump' };
  }

  const validSuits = ['hearts', 'diamonds', 'clubs', 'spades'];
  if (!validSuits.includes(suit)) {
    return { success: false, message: 'Invalid suit' };
  }

  room.gameState.trumpSuit = suit;
  room.gameState.waitingForTrumpSelection = false;
  
  // Deal remaining 3 cards to each player
  if (room.gameState.remainingDeck && room.gameState.remainingDeck.length >= 12) {
    for (let i = 0; i < 4; i++) {
      const playerHand = room.gameState.hands[i];
      const additionalCards = room.gameState.remainingDeck.splice(0, 3);
      playerHand.cards.push(...additionalCards);
    }
  }
  
  room.gameState.phase = 'playing';

  return { success: true, room, trumpSuit: suit };
}

function playCard(roomId, socketId, cardIndex) {
  const room = rooms.get(roomId);
  if (!room || !room.gameState) return { success: false, message: 'Game not started' };

  if (room.gameState.waitingForTrumpSelection) {
    return { success: false, message: 'Waiting for trump selection' };
  }

  const currentPlayer = room.players[room.gameState.currentTurn];
  if (currentPlayer.socketId !== socketId) {
    return { success: false, message: 'Not your turn' };
  }

  const playerHand = room.gameState.hands.find(h => h.playerId === socketId);
  if (!playerHand || cardIndex >= playerHand.cards.length) {
    return { success: false, message: 'Invalid card' };
  }

  const card = playerHand.cards[cardIndex];
  
  // Validate card play - must follow suit if possible
  if (room.gameState.tableCards.length > 0 && room.gameState.leadSuit) {
    const hasLeadSuit = playerHand.cards.some(c => c.suit === room.gameState.leadSuit);
    if (hasLeadSuit && card.suit !== room.gameState.leadSuit) {
      return { success: false, message: 'Must follow suit' };
    }
  }

  // Set lead suit for this trick
  if (room.gameState.tableCards.length === 0) {
    room.gameState.leadSuit = card.suit;
  }

  // Play card
  playerHand.cards.splice(cardIndex, 1);
  room.gameState.tableCards.push({ card, playerId: socketId, position: room.gameState.currentTurn });

  const trickComplete = room.gameState.tableCards.length === 4;
  let trickWinner = null;
  let roundComplete = false;
  let roundResult = null;
  let earlyTermination = false;

  if (trickComplete) {
    trickWinner = determineTrickWinner(room.gameState);
    const winnerTeam = trickWinner.position % 2 === 0 ? 'teamA' : 'teamB';
    room.gameState.capturedCards[winnerTeam].push(...room.gameState.tableCards.map(tc => tc.card));
    
    // Count tens captured in this trick
    const tens = room.gameState.tableCards.filter(tc => tc.card.rank === '10').map(tc => tc.card);
    if (tens.length > 0) {
      room.gameState.tensCaptured[winnerTeam].push(...tens);
    }
    room.gameState.tricksWon[winnerTeam]++;
    
    room.gameState.currentTurn = trickWinner.position;
    
    // Check for early termination conditions
    const teamATens = room.gameState.tensCaptured.teamA.length;
    const teamBTens = room.gameState.tensCaptured.teamB.length;
    
    // Condition 1: One team has all 4 tens (winner!)
    if (teamATens === 4 || teamBTens === 4) {
      roundComplete = true;
      earlyTermination = true;
      roundResult = calculateRoundWinner(room.gameState);
    }
    // Condition 2: Both teams have at least 1 ten (dismissed - impossible to win)
    else if (teamATens >= 1 && teamBTens >= 1) {
      roundComplete = true;
      earlyTermination = true;
      roundResult = calculateRoundWinner(room.gameState);
    }
    // Normal check: all cards played
    else {
      roundComplete = room.gameState.hands.every(h => h.cards.length === 0);
      if (roundComplete) {
        roundResult = calculateRoundWinner(room.gameState);
      }
    }

    if (roundComplete && roundResult) {
      // Only update scores if there's a winner (not a draw)
      if (roundResult.winner) {
        room.gameState.lastRoundWinner = roundResult.winner;
        room.gameState.teamScores[roundResult.winner]++;
      } else {
        // Draw - no score change, keep last winner for next round start
        if (!room.gameState.lastRoundWinner) {
          room.gameState.lastRoundWinner = 'teamA';
        }
      }
    }
  } else {
    room.gameState.currentTurn = (room.gameState.currentTurn + 1) % 4;
  }

  return { 
    success: true, 
    room, 
    trickComplete, 
    trickWinner, 
    roundComplete,
    roundResult,
    earlyTermination
  };
}

function determineTrickWinner(gameState) {
  const leadSuit = gameState.leadSuit;
  const trumpSuit = gameState.trumpSuit;
  let winner = gameState.tableCards[0];
  
  for (let i = 1; i < gameState.tableCards.length; i++) {
    const current = gameState.tableCards[i];
    
    // Trump beats everything
    if (current.card.suit === trumpSuit && winner.card.suit !== trumpSuit) {
      winner = current;
    }
    // Both trump - higher value wins
    else if (current.card.suit === trumpSuit && winner.card.suit === trumpSuit) {
      if (current.card.value > winner.card.value) {
        winner = current;
      }
    }
    // No trump involved - follow lead suit
    else if (winner.card.suit !== trumpSuit && current.card.suit === leadSuit && current.card.value > winner.card.value) {
      winner = current;
    }
  }
  
  return winner;
}

function calculateRoundWinner(gameState) {
  const teamATens = gameState.tensCaptured.teamA.length;
  const teamBTens = gameState.tensCaptured.teamB.length;
  
  let winner = null;
  let reason;
  
  // ONLY win if team captures ALL 4 tens
  if (teamATens === 4) {
    winner = 'teamA';
    reason = 'Captured all 4 tens!';
  } else if (teamBTens === 4) {
    winner = 'teamB';
    reason = 'Captured all 4 tens!';
  } else {
    // Any split (3-1, 2-2, 1-3) is a draw
    winner = null;
    reason = `Round is a draw (Team A: ${teamATens} tens, Team B: ${teamBTens} tens)`;
  }
  
  return {
    winner,
    reason,
    teamATens: gameState.tensCaptured.teamA,
    teamBTens: gameState.tensCaptured.teamB,
    teamATricks: gameState.tricksWon.teamA,
    teamBTricks: gameState.tricksWon.teamB,
    isDraw: winner === null
  };
}

function nextRound(roomId) {
  const room = rooms.get(roomId);
  if (!room || !room.gameState) return { success: false };

  // Check if match is complete
  if (room.gameState.roundNumber >= room.gameState.totalRounds) {
    return { success: true, matchComplete: true, dashboard: getMatchDashboard(room) };
  }

  // Determine which team starts based on last round winner
  const startingTeam = room.gameState.lastRoundWinner === 'teamA' ? 0 : 1;
  const startingPosition = startingTeam === 0 ? 0 : 1;

  // IMPORTANT: Alternate trump choosing team each round
  // Round 1: Team A (0), Round 2: Team B (1), Round 3: Team A (0), etc.
  const trumpChoosingTeam = room.gameState.roundNumber % 2 === 0 ? 1 : 0;

  // Reset for new round but keep scores
  room.gameState.phase = 'dealing';
  room.gameState.hands = [];
  room.gameState.currentTurn = startingPosition;
  room.gameState.trumpSuit = null;
  room.gameState.trumpChoosingTeam = trumpChoosingTeam; // Alternate each round
  room.gameState.waitingForTrumpSelection = false;
  room.gameState.tableCards = [];
  room.gameState.capturedCards = { teamA: [], teamB: [] };
  room.gameState.tensCaptured = { teamA: [], teamB: [] };
  room.gameState.tricksWon = { teamA: 0, teamB: 0 };
  room.gameState.leadSuit = null;
  room.gameState.trickNumber = 0;
  room.gameState.roundNumber++;

  // Deal cards with animation - only 5 cards initially
  const deck = shuffleDeck(createDeck());
  const initialHands = [];
  for (let i = 0; i < 4; i++) {
    initialHands.push(deck.splice(0, 5));
  }
  
  // Store remaining deck for later
  room.gameState.remainingDeck = deck;
  room.gameState.hands = initialHands.map((hand, i) => ({ 
    playerId: room.players[i].socketId, 
    cards: hand 
  }));

  // After dealing animation, move to trump selection
  setTimeout(() => {
    room.gameState.phase = 'trump_selection';
    room.gameState.waitingForTrumpSelection = true;
  }, 3000);

  return { success: true, room, matchComplete: false };
}

function getMatchDashboard(room) {
  return {
    totalRounds: room.gameState.roundNumber,
    teamAWins: room.gameState.teamScores.teamA,
    teamBWins: room.gameState.teamScores.teamB,
    matchWinner: room.gameState.teamScores.teamA > room.gameState.teamScores.teamB ? 'teamA' : 'teamB',
    teamAPlayers: [room.players[0].name, room.players[2].name],
    teamBPlayers: [room.players[1].name, room.players[3].name]
  };
}

function resetGame(roomId) {
  const room = rooms.get(roomId);
  if (!room) return { success: false };

  // Reset everything except players
  room.gameState = null;
  room.chatHistory = [];

  return { success: true, room };
}

function nextTrick(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  
  room.gameState.tableCards = [];
  room.gameState.leadSuit = null;
  room.gameState.trickNumber++;
}

function getRoom(roomId) {
  return rooms.get(roomId);
}

function getAllRooms() {
  return Array.from(rooms.values()).map(r => ({
    roomId: r.roomId,
    roomName: r.roomName,
    playerCount: r.players.filter(p => !p.isAI).length
  }));
}

function handleDisconnect(socketId, io) {
  for (const [roomId, room] of rooms.entries()) {
    const playerIndex = room.players.findIndex(p => p.socketId === socketId);
    if (playerIndex !== -1) {
      room.players[playerIndex].isAI = true;
      room.players[playerIndex].name = `AI (disconnected)`;
      io.to(roomId).emit('player_disconnect', { socketId });
      io.to(roomId).emit('game_update', room);
    }
  }
}

function triggerAI(roomId, io) {
  const room = rooms.get(roomId);
  if (!room || !room.gameState) return;
  
  // Check if waiting for trump selection
  if (room.gameState.waitingForTrumpSelection) {
    const currentPlayer = room.players[room.gameState.currentTurn];
    const playerTeam = room.gameState.currentTurn % 2;
    
    if (currentPlayer && currentPlayer.isAI && playerTeam === room.gameState.trumpChoosingTeam) {
      setTimeout(() => {
        // AI chooses random suit
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const chosenSuit = suits[Math.floor(Math.random() * suits.length)];
        const result = chooseTrump(roomId, currentPlayer.socketId, chosenSuit);
        if (result.success && io) {
          io.to(roomId).emit('trump_selected', { trumpSuit: chosenSuit, team: playerTeam });
          io.to(roomId).emit('game_update', result.room);
          // Trigger AI to play if still AI turn
          setTimeout(() => triggerAI(roomId, io), 1000);
        }
      }, 1500);
    }
    return;
  }
  
  const currentPlayer = room.players[room.gameState.currentTurn];
  if (currentPlayer && currentPlayer.isAI) {
    setTimeout(() => {
      playAICard(roomId, currentPlayer, io);
    }, 1500);
  }
}

function playAICard(roomId, aiPlayer, io) {
  const room = rooms.get(roomId);
  if (!room || !room.gameState) return;
  
  const playerHand = room.gameState.hands.find(h => h.playerId === aiPlayer.socketId);
  if (!playerHand || playerHand.cards.length === 0) return;

  let cardIndex = 0;
  const leadSuit = room.gameState.leadSuit;

  if (leadSuit) {
    const suitCards = playerHand.cards
      .map((card, idx) => ({ card, idx }))
      .filter(c => c.card.suit === leadSuit);
    
    if (suitCards.length > 0) {
      const highestOnTable = Math.max(...room.gameState.tableCards
        .filter(tc => tc.card.suit === leadSuit)
        .map(tc => tc.card.value));
      
      const winningCards = suitCards.filter(c => c.card.value > highestOnTable);
      if (winningCards.length > 0) {
        cardIndex = winningCards[0].idx;
      } else {
        cardIndex = suitCards[suitCards.length - 1].idx;
      }
    } else {
      const tenIndex = playerHand.cards.findIndex(c => c.rank === '10');
      cardIndex = tenIndex !== -1 ? tenIndex : 0;
    }
  } else {
    const nonTens = playerHand.cards
      .map((card, idx) => ({ card, idx }))
      .filter(c => c.card.rank !== '10');
    
    if (nonTens.length > 0) {
      nonTens.sort((a, b) => b.card.value - a.card.value);
      cardIndex = nonTens[0].idx;
    } else {
      cardIndex = 0;
    }
  }

  const result = playCard(roomId, aiPlayer.socketId, cardIndex);
  if (result.success && io) {
    io.to(roomId).emit('game_update', result.room);
    
    if (result.trickComplete) {
      setTimeout(() => {
        io.to(roomId).emit('trick_result', result.trickWinner);
        nextTrick(roomId);
        io.to(roomId).emit('game_update', getRoom(roomId));
        
        if (result.roundComplete) {
          io.to(roomId).emit('round_end', result.scores);
        }
      }, 2000);
    } else {
      triggerAI(roomId, io);
    }
  }
}

module.exports = {
  createRoom,
  joinRoom,
  startGame,
  playCard,
  nextTrick,
  getRoom,
  getAllRooms,
  handleDisconnect,
  triggerAI,
  setIO,
  chooseTrump,
  nextRound,
  resetGame,
  playerReady,
  dealCardsToPlayers
};
