import { useState } from 'react';
import Card from './Card';
import TrumpSelector from './TrumpSelector';
import Lobby from './Lobby';
import TenCards from './TenCards';

export default function GameTable({ room, socket }) {
  const [selectedCard, setSelectedCard] = useState(null);

  const myPlayer = room.players.find(p => p.socketId === socket.id);

  // Show lobby if in lobby phase
  if (room.gameState && room.gameState.phase === 'lobby') {
    return <Lobby room={room} socket={socket} myPlayer={myPlayer} />;
  }

  if (!room.gameState || room.gameState.phase === 'dealing') {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 font-fredoka">
          {room.gameState?.phase === 'dealing' ? 'Dealing cards...' : 'Waiting for game to start...'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-100 rounded-xl border-2 border-blue-300">
            <h3 className="font-bold text-blue-800 mb-2 font-fredoka">Team A</h3>
            <p className="text-sm">{room.players[0]?.name}</p>
            <p className="text-sm">{room.players[2]?.name}</p>
          </div>
          <div className="p-4 bg-red-100 rounded-xl border-2 border-red-300">
            <h3 className="font-bold text-red-800 mb-2 font-fredoka">Team B</h3>
            <p className="text-sm">{room.players[1]?.name}</p>
            <p className="text-sm">{room.players[3]?.name}</p>
          </div>
        </div>
      </div>
    );
  }

  const currentPlayerIndex = room.gameState?.currentTurn ?? 0;
  const myHand = room.gameState?.hands?.find(h => h.playerId === socket.id);
  const isMyTurn = myPlayer && room.players[currentPlayerIndex]?.socketId === socket.id;
  const myTeam = myPlayer ? (myPlayer.position % 2 === 0 ? 'teamA' : 'teamB') : null;
  const trumpChoosingTeam = room.gameState?.trumpChoosingTeam === 0 ? 'teamA' : 'teamB';
  const canChooseTrump = room.gameState?.waitingForTrumpSelection && myTeam === trumpChoosingTeam;

  const playCard = (cardIndex) => {
    if (!isMyTurn || room.gameState?.waitingForTrumpSelection) return;
    socket.emit('play_card', { roomId: room.roomId, cardIndex });
    setSelectedCard(null);
  };

  const getPlayerPosition = (index) => {
    if (!myPlayer) return index;
    const positions = ['bottom', 'left', 'top', 'right'];
    const offset = myPlayer.position;
    return positions[(index - offset + 4) % 4];
  };

  const suitSymbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
  };

  const suitColors = {
    hearts: 'text-red-600',
    diamonds: 'text-red-600',
    clubs: 'text-black',
    spades: 'text-black'
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Top section: Game table and info */}
      <div className="flex-1 flex items-center justify-center px-2 sm:px-4 py-2">
        <div className="relative w-full max-w-4xl" style={{ height: '60vh' }}>
          {/* Green felt table */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-700 rounded-3xl shadow-2xl border-4 sm:border-8 border-gray-700">
            {/* Inner border decoration */}
            <div className="absolute inset-2 sm:inset-4 rounded-2xl border-2 sm:border-4 border-yellow-600 opacity-40"></div>

          {/* Trump Selector */}
          {room.gameState?.waitingForTrumpSelection && canChooseTrump && (
            <TrumpSelector 
              socket={socket} 
              roomId={room.roomId} 
              myHand={myHand}
              trumpChoosingTeam={trumpChoosingTeam}
            />
          )}

          {/* Score Panel - Top Left */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white rounded-xl p-2 sm:p-3 shadow-lg z-10 text-xs sm:text-sm">
            <div className="font-bold mb-1 font-fredoka">Round {room.gameState?.roundNumber ?? 1}</div>
            <div className="space-y-0.5">
              <div className="text-blue-700">Team A: {room.gameState?.teamScores?.teamA ?? 0}</div>
              <div className="text-red-700">Team B: {room.gameState?.teamScores?.teamB ?? 0}</div>
            </div>
          </div>

          {/* Trump Display - Top Center */}
          {room.gameState?.trumpSuit && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-yellow-400 rounded-xl p-2 sm:p-3 shadow-lg z-10 border-2 border-yellow-600">
              <div className="text-xs font-bold text-center font-fredoka">Trump</div>
              <div className={`text-3xl sm:text-4xl ${suitColors[room.gameState.trumpSuit]}`}>
                {suitSymbols[room.gameState.trumpSuit]}
              </div>
            </div>
          )}

          {/* Captured Tens Display - Top Right */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white rounded-xl p-2 sm:p-3 shadow-lg">
            <div className="text-xs font-bold text-center mb-2 font-fredoka">Captured 10s</div>
            <div className="space-y-2">
              <div className="bg-blue-50 rounded p-1.5">
                <div className="text-xs font-semibold text-blue-700 mb-1">Team A</div>
                <div className="flex gap-0.5 flex-wrap">
                  {room.gameState?.tensCaptured?.teamA?.map((card, idx) => (
                    <div key={idx} className="transform scale-[0.25] origin-top-left" style={{ width: '20px', height: '28px' }}>
                      <Card card={card} />
                    </div>
                  ))}
                  {(!room.gameState?.tensCaptured?.teamA || room.gameState.tensCaptured.teamA.length === 0) && (
                    <div className="text-[10px] text-gray-400">None</div>
                  )}
                </div>
              </div>
              <div className="bg-red-50 rounded p-1.5">
                <div className="text-xs font-semibold text-red-700 mb-1">Team B</div>
                <div className="flex gap-0.5 flex-wrap">
                  {room.gameState?.tensCaptured?.teamB?.map((card, idx) => (
                    <div key={idx} className="transform scale-[0.25] origin-top-left" style={{ width: '20px', height: '28px' }}>
                      <Card card={card} />
                    </div>
                  ))}
                  {(!room.gameState?.tensCaptured?.teamB || room.gameState.tensCaptured.teamB.length === 0) && (
                    <div className="text-[10px] text-gray-400">None</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Turn Indicator - Bottom Left */}
          {!room.gameState?.waitingForTrumpSelection && (
            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-yellow-300 rounded-xl p-2 sm:p-3 shadow-lg z-10 border-2 border-yellow-500">
              <div className="text-xs sm:text-sm font-bold font-fredoka">
                {isMyTurn ? '🎯 Your turn!' : `${room.players[currentPlayerIndex]?.name}'s turn`}
              </div>
            </div>
          )}

          {/* Waiting for trump */}
          {room.gameState?.waitingForTrumpSelection && !canChooseTrump && (
            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-orange-400 rounded-xl p-2 sm:p-3 shadow-lg z-10 border-2 border-orange-600">
              <div className="text-xs sm:text-sm font-bold text-white font-fredoka">
                Waiting for {trumpChoosingTeam === 'teamA' ? 'Team A' : 'Team B'}...
              </div>
            </div>
          )}

          {/* Table cards in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {room.gameState?.tableCards?.map((tc, idx) => (
                <div key={idx} className="transform hover:scale-105 transition-transform">
                  <div className="scale-75 sm:scale-100">
                    <Card card={tc.card} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Player avatars around table - OUTSIDE the card area */}
          {room.players.map((player, idx) => {
            const position = getPlayerPosition(idx);
            const isCurrentTurn = idx === currentPlayerIndex;
            const playerTeam = idx % 2 === 0 ? 'teamA' : 'teamB';
            const teamColor = playerTeam === 'teamA' ? 'bg-blue-100 border-blue-400' : 'bg-red-100 border-red-400';
            
            // Position avatars OUTSIDE the table, not overlapping with cards
            const positions = {
              bottom: 'bottom-[-60px] left-1/2 -translate-x-1/2',
              left: 'left-[-80px] top-1/2 -translate-y-1/2',
              top: 'top-[-60px] left-1/2 -translate-x-1/2',
              right: 'right-[-80px] top-1/2 -translate-y-1/2'
            };
            
            // Skip bottom position as that's where we'll show cards
            if (position === 'bottom') return null;
            
            return (
              <div key={idx} className={`absolute ${positions[position]} z-20`}>
                <div className={`${teamColor} border-2 rounded-xl p-2 shadow-lg ${isCurrentTurn && !room.gameState?.waitingForTrumpSelection ? 'ring-2 sm:ring-4 ring-yellow-400 animate-pulse' : ''}`}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-base sm:text-lg mb-1">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-center font-fredoka whitespace-nowrap">{player.name}</div>
                  {player.isAI && <span className="text-[10px] bg-gray-500 text-white px-1 rounded block text-center mt-1">AI</span>}
                </div>
              </div>
            );
          })}

          </div>
        </div>
      </div>
      
      {/* Bottom section: My hand in 4x2 grid */}
      {myHand && myHand.cards && (
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 py-4 px-2 sm:px-4 border-t-4 border-yellow-600">
          <div className="max-w-6xl mx-auto">
            {/* My player info */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className={`${myPlayer && myPlayer.position % 2 === 0 ? 'bg-blue-100 border-blue-400' : 'bg-red-100 border-red-400'} border-2 rounded-xl px-4 py-2 shadow-lg ${isMyTurn && !room.gameState?.waitingForTrumpSelection ? 'ring-2 ring-yellow-400 animate-pulse' : ''}`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                    {myPlayer?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm font-bold font-fredoka">{myPlayer?.name}</div>
                </div>
              </div>
              {isMyTurn && !room.gameState?.waitingForTrumpSelection && (
                <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  YOUR TURN!
                </div>
              )}
            </div>
            
            {/* Cards in 4x2 grid */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-4xl mx-auto">
              {myHand.cards.map((card, idx) => (
                <div
                  key={idx}
                  onClick={() => !room.gameState?.waitingForTrumpSelection && isMyTurn && playCard(idx)}
                  className={`cursor-pointer transform transition-all duration-300 ${
                    isMyTurn && !room.gameState?.waitingForTrumpSelection 
                      ? 'hover:-translate-y-2 hover:scale-105 hover:brightness-110' 
                      : 'opacity-60 grayscale cursor-not-allowed'
                  } ${selectedCard === idx ? '-translate-y-2 scale-105 ring-2 ring-yellow-400' : ''}`}
                  style={{
                    filter: isMyTurn && !room.gameState?.waitingForTrumpSelection ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' : ''
                  }}
                >
                  <Card card={card} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
