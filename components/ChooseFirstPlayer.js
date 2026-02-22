export default function ChooseFirstPlayer({ room, socket, myPlayer, onChoose }) {
  const myTeam = myPlayer ? (myPlayer.position % 2 === 0 ? 'teamA' : 'teamB') : null;
  const choosingTeam = room.gameState?.choosingTeam === 0 ? 'teamA' : 'teamB';
  const canChoose = myTeam === choosingTeam;

  // Get team members
  const teamMembers = room.players.filter((p, idx) => {
    const playerTeam = idx % 2 === 0 ? 'teamA' : 'teamB';
    return playerTeam === choosingTeam;
  });

  const handleChoose = () => {
    socket.emit('first_player_chosen', { roomId: room.roomId });
    onChoose();
  };

  if (!canChoose) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-fredoka">
            Waiting for {choosingTeam === 'teamA' ? 'Team A' : 'Team B'}
          </h2>
          <p className="text-gray-600">
            They are choosing who plays first...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-fredoka">
            Your Team Plays First!
          </h2>
          <p className="text-gray-600 mb-4">
            Click the button below if you want to play first, or wait for your teammate to choose.
          </p>
        </div>

        <div className="space-y-3">
          {teamMembers.map((player, idx) => {
            const isMe = player.socketId === socket.id;
            return (
              <div key={idx} className={`p-4 rounded-lg border-2 ${isMe ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-300'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg">{player.name}</div>
                    {isMe && <div className="text-xs text-blue-600">You</div>}
                  </div>
                  {isMe && (
                    <button
                      onClick={handleChoose}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                      I'll Play First
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          💡 Either team member can choose to play first
        </div>
      </div>
    </div>
  );
}
