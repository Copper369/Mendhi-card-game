import Card from './Card';

export default function RoundResult({ result, onClose }) {
  const isDraw = result.isDraw || !result.winner;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3 sm:mb-4">
          {isDraw ? (
            '🤝 Round Draw!'
          ) : (
            result.winner === 'teamA' ? '🔵 Team A Wins!' : '🔴 Team B Wins!'
          )}
        </h2>
        
        <div className="bg-gray-100 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-center text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4">{result.reason}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className={`${isDraw ? 'bg-gray-100' : result.winner === 'teamA' ? 'bg-blue-100' : 'bg-blue-50'} rounded-lg p-3 sm:p-4`}>
              <div className="text-xs sm:text-sm text-gray-600 mb-2 text-center font-semibold">Team A</div>
              <div className={`text-xl sm:text-2xl font-bold ${result.winner === 'teamA' ? 'text-blue-700' : 'text-gray-600'} text-center mb-2`}>
                {result.teamATens?.length || 0} tens
              </div>
              <div className="flex gap-0.5 sm:gap-1 justify-center flex-wrap mb-2">
                {result.teamATens && result.teamATens.length > 0 ? (
                  result.teamATens.map((card, idx) => (
                    <div key={idx} className="transform scale-[0.35] sm:scale-50">
                      <Card card={card} />
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-400">No tens</div>
                )}
              </div>
              <div className="text-xs sm:text-sm text-center text-gray-600">{result.teamATricks} tricks won</div>
            </div>
            
            <div className={`${isDraw ? 'bg-gray-100' : result.winner === 'teamB' ? 'bg-red-100' : 'bg-red-50'} rounded-lg p-3 sm:p-4`}>
              <div className="text-xs sm:text-sm text-gray-600 mb-2 text-center font-semibold">Team B</div>
              <div className={`text-xl sm:text-2xl font-bold ${result.winner === 'teamB' ? 'text-red-700' : 'text-gray-600'} text-center mb-2`}>
                {result.teamBTens?.length || 0} tens
              </div>
              <div className="flex gap-0.5 sm:gap-1 justify-center flex-wrap mb-2">
                {result.teamBTens && result.teamBTens.length > 0 ? (
                  result.teamBTens.map((card, idx) => (
                    <div key={idx} className="transform scale-[0.35] sm:scale-50">
                      <Card card={card} />
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-400">No tens</div>
                )}
              </div>
              <div className="text-xs sm:text-sm text-center text-gray-600">{result.teamBTricks} tricks won</div>
            </div>
          </div>
        </div>

        {isDraw && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
            <p className="text-center text-xs sm:text-sm text-gray-700">
              <span className="font-bold">⚠️ No winner this round!</span><br/>
              A team must capture all 4 tens to win.
            </p>
          </div>
        )}

        <p className="text-center text-gray-600 text-xs sm:text-sm">
          Next round starting soon...
        </p>
      </div>
    </div>
  );
}
