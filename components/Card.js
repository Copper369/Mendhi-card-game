export default function Card({ card }) {
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
    <div className="bg-white rounded-lg shadow-lg p-3 w-16 h-24 flex flex-col items-center justify-between border-2 border-gray-300">
      <div className={`text-2xl font-bold ${suitColors[card.suit]}`}>
        {card.rank}
      </div>
      <div className={`text-3xl ${suitColors[card.suit]}`}>
        {suitSymbols[card.suit]}
      </div>
      <div className={`text-xs ${suitColors[card.suit]}`}>
        {card.rank}
      </div>
    </div>
  );
}
