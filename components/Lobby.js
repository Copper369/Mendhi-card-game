import { useState } from 'react';

export default function Lobby({ room, socket, myPlayer }) {
  const isReady = room.gameState?.readyPlayers?.includes(socket.id);
  const readyCount = room.gameState?.readyPlayers?.length || 0;
  const isAdmin = room.adminSocketId === socket.id;
  const [maxRounds, setMaxRounds] = useState(room.gameState?.totalRounds || 5);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleReady = () => {
    socket.emit('player_ready', { roomId: room.roomId });
  };

  const handleMaxRoundsChange = (newMax) => {
    setMaxRounds(newMax);
    socket.emit('set_max_rounds', { roomId: room.roomId, maxRounds: newMax });
  };

  const handleDeleteRoom = () => {
    socket.emit('delete_room', { roomId: room.roomId });
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 text-green-800">Game Lobby</h2>
      
      {/* Admin Controls */}
      {isAdmin && (
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg sm:text-xl">👑</span>
            <h3 className="font-bold text-yellow-800 text-sm sm:text-base">Room Admin Controls</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Max Rounds: {maxRounds}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={maxRounds}
                onChange={(e) => handleMaxRoundsChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled={readyCount > 0}
              />
              <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition text-xs sm:text-sm font-semibold"
            >
              Delete Room
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Room?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this room? All players will be disconnected.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleDeleteRoom();
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border-2 border-blue-300">
          <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-3 sm:mb-4 text-center">Team A</h3>
          <div className="space-y-2 sm:space-y-3">
            {[0, 2].map(pos => {
              const player = room.players[pos];
              const playerReady = room.gameState?.readyPlayers?.includes(player?.socketId);
              const playerIsAdmin = room.adminSocketId === player?.socketId;
              return (
                <div key={pos} className="bg-white rounded-lg p-2 sm:p-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm sm:text-base flex items-center gap-1">
                      {player?.name || 'Waiting...'}
                      {playerIsAdmin && <span className="text-xs">👑</span>}
                    </div>
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
              const playerIsAdmin = room.adminSocketId === player?.socketId;
              return (
                <div key={pos} className="bg-white rounded-lg p-2 sm:p-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm sm:text-base flex items-center gap-1">
                      {player?.name || 'Waiting...'}
                      {playerIsAdmin && <span className="text-xs">👑</span>}
                    </div>
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
