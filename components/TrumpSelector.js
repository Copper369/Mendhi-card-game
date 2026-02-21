export default function TrumpSelector({ socket, roomId, myHand, trumpChoosingTeam }) {
  const suits = [
    { name: 'hearts', symbol: '♥', color: 'text-red-600', bg: 'bg-red-100 hover:bg-red-200' },
    { name: 'diamonds', symbol: '♦', color: 'text-red-600', bg: 'bg-red-100 hover:bg-red-200' },
    { name: 'clubs', symbol: '♣', color: 'text-black', bg: 'bg-gray-100 hover:bg-gray-200' },
    { name: 'spades', symbol: '♠', color: 'text-black', bg: 'bg-gray-100 hover:bg-gray-200' }
  ];

  const selectTrump = (suit) => {
    socket.emit('choose_trump', { roomId, suit });
  };

  // Count cards by suit
  const suitCounts = myHand ? {
    hearts: myHand.cards.filter(c => c.suit === 'hearts').length,
    diamonds: myHand.cards.filter(c => c.suit === 'diamonds').length,
    clubs: myHand.cards.filter(c => c.suit === 'clubs').length,
    spades: myHand.cards.filter(c => c.suit === 'spades').length
  } : {};

  const teamColor = trumpChoosingTeam === 'teamA' ? 'border-blue-400 bg-blue-50' : 'border-red-400 bg-red-50';
  const teamName = trumpChoosingTeam === 'teamA' ? 'Team A' : 'Team B';

  return (
    <div className={`fixed top-2 right-2 sm:top-4 sm:right-4 ${teamColor} rounded-xl shadow-2xl p-2 sm:p-4 max-w-[280px] sm:max-w-xs w-auto z-50 border-2 sm:border-4 animate-pulse-border`}>
      <div className="flex items-center justify-center mb-1 sm:mb-2">
        <span className="text-sm sm:text-lg font-bold">{teamName}'s Turn</span>
      </div>
      <h3 className="text-xs sm:text-md font-bold text-center mb-1">Choose Trump Suit</h3>
      
      <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-3">
        {suits.map((suit) => (
          <button
            key={suit.name}
            onClick={() => selectTrump(suit.name)}
            className={`${suit.bg} border-2 border-gray-300 rounded-lg p-2 sm:p-3 transition transform hover:scale-105 active:scale-95`}
          >
            <div className={`text-2xl sm:text-3xl ${suit.color} text-center mb-0.5 sm:mb-1`}>
              {suit.symbol}
            </div>
            <div className="text-[10px] sm:text-xs text-center font-semibold capitalize">
              {suit.name}
            </div>
            {myHand && (
              <div className="text-[9px] sm:text-xs text-center text-gray-600">
                {suitCounts[suit.name]} cards
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="bg-yellow-50 rounded-lg p-1.5 sm:p-2 text-[10px] sm:text-xs text-gray-700 border border-yellow-200">
        <p className="font-semibold">💡 Tip:</p>
        <p className="hidden sm:block">Choose suit with strong cards!</p>
        <p className="sm:hidden">Pick strong suit!</p>
      </div>

      <style jsx>{`
        @keyframes pulse-border {
          0%, 100% { 
            border-color: ${trumpChoosingTeam === 'teamA' ? '#60a5fa' : '#f87171'};
            box-shadow: 0 0 20px ${trumpChoosingTeam === 'teamA' ? 'rgba(96, 165, 250, 0.5)' : 'rgba(248, 113, 113, 0.5)'};
          }
          50% { 
            border-color: ${trumpChoosingTeam === 'teamA' ? '#3b82f6' : '#ef4444'};
            box-shadow: 0 0 30px ${trumpChoosingTeam === 'teamA' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(239, 68, 68, 0.8)'};
          }
        }
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
