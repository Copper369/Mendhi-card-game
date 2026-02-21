export default function Lobby({ room, socket, myPlayer }) {
  const isReady = room.gameState?.readyPlayers?.includes(socket.id);
  const readyCount = room.gameState?.readyPlayers?.length || 0;

  const handleReady = () => {
    socket.emit('player_ready', { roomId: room.roomId });
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 text-green-800">Game Lobby</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border-2 border-blue-300">
          <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-3 sm:mb-4 text-center">Team A</h3>
          <div className="space-y-2 sm:space-y-3">
            {[0, 2].map(pos => {
              const player = room.players[pos];
              const playerReady = room.gameState?.readyPlayers?.includes(player?.socketId);
              return (
                <div key={pos} className="bg-white rounded-lg p-2 sm:p-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm sm:text-base">{player?.name || 'Waiting...'}</div>
                    {player?.isAI && <span className="text-[10px] sm:text-xs bg-gray-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">AI</span>}
                  </div>
                  {playerReady && <span className="text-green-600 font-bold text-sm sm:text-base">✓ Ready</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4 sm:p-6 border-2 border-red-300">
          <h3 className="text-lg sm:text-xl font-bold text-red-800 mb-3 sm:mb-4 text-center">Team B</h3>
          <div className="space-y-2 sm:space-y-3">
            {[1, 3].map(pos => {
              const player = room.players[pos];
              const playerReady = room.gameState?.readyPlayers?.includes(player?.socketId);
              return (
                <div key={pos} className="bg-white rounded-lg p-2 sm:p-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm sm:text-base">{player?.name || 'Waiting...'}</div>
                    {player?.isAI && <span className="text-[10px] sm:text-xs bg-gray-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">AI</span>}
                  </div>
                  {playerReady && <span className="text-green-600 font-bold text-sm sm:text-base">✓ Ready</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-center mb-4 sm:mb-6">
        <p className="text-gray-600 mb-2 text-sm sm:text-base">Players Ready: {readyCount}/4</p>
        {readyCount === 4 && (
          <p className="text-green-600 font-bold animate-pulse text-sm sm:text-base">Starting game...</p>
        )}
      </div>

      {!isReady && myPlayer && !myPlayer.isAI && (
        <button
          onClick={handleReady}
          className="w-full bg-green-600 text-white py-3 sm:py-4 rounded-lg hover:bg-green-700 transition font-bold text-base sm:text-lg"
        >
          I'm Ready!
        </button>
      )}

      {isReady && (
        <div className="text-center">
          <p className="text-green-600 font-semibold text-sm sm:text-base">You are ready! Waiting for others...</p>
        </div>
      )}
    </div>
  );
}
