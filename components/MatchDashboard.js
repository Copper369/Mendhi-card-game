export default function MatchDashboard({ dashboard, onReset }) {
  const winner = dashboard.matchWinner;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2">
          🏆 Match Complete! 🏆
        </h1>
        
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center mb-6 sm:mb-8">
          {winner === 'teamA' ? '🔵 Team A Wins the Match!' : '🔴 Team B Wins the Match!'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className={`rounded-lg p-4 sm:p-6 text-center ${winner === 'teamA' ? 'bg-blue-200 ring-2 sm:ring-4 ring-blue-500' : 'bg-blue-100'}`}>
            <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-2 sm:mb-3">Team A</h3>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm text-gray-700">{dashboard.teamAPlayers[0]}</p>
              <p className="text-xs sm:text-sm text-gray-700">{dashboard.teamAPlayers[1]}</p>
            </div>
            <div className="mt-3 sm:mt-4 text-3xl sm:text-4xl font-bold text-blue-700">
              {dashboard.teamAWins}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">rounds won</div>
          </div>

          <div className={`rounded-lg p-4 sm:p-6 text-center ${winner === 'teamB' ? 'bg-red-200 ring-2 sm:ring-4 ring-red-500' : 'bg-red-100'}`}>
            <h3 className="text-lg sm:text-xl font-bold text-red-800 mb-2 sm:mb-3">Team B</h3>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm text-gray-700">{dashboard.teamBPlayers[0]}</p>
              <p className="text-xs sm:text-sm text-gray-700">{dashboard.teamBPlayers[1]}</p>
            </div>
            <div className="mt-3 sm:mt-4 text-3xl sm:text-4xl font-bold text-red-700">
              {dashboard.teamBWins}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">rounds won</div>
          </div>
        </div>

        <div className="text-center mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-gray-600">Total Rounds Played: <span className="font-bold">{dashboard.totalRounds}</span></p>
        </div>

        <button
          onClick={onReset}
          className="w-full bg-green-600 text-white py-3 sm:py-4 rounded-lg hover:bg-green-700 transition font-semibold text-base sm:text-lg"
        >
          Return to Lobby
        </button>
      </div>
    </div>
  );
}
