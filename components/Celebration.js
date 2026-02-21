export default function Celebration({ winner, type = 'round' }) {
  const teamName = winner === 'teamA' ? 'Team A' : 'Team B';
  const teamColor = winner === 'teamA' ? 'text-blue-600' : 'text-red-600';
  const bgColor = winner === 'teamA' ? 'from-blue-400 to-blue-600' : 'from-red-400 to-red-600';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fadeIn p-4">
      <div className="text-center">
        {/* Confetti effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🎉', '🎊', '⭐', '✨', '🏆'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>

        {/* Winner announcement */}
        <div className={`bg-gradient-to-r ${bgColor} text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl transform animate-bounce-in max-w-md`}>
          <div className="text-5xl sm:text-6xl md:text-8xl mb-3 sm:mb-4">🏆</div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 animate-pulse">
            {teamName} Wins!
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold">
            {type === 'round' ? 'Round Victory!' : 'Match Champion!'}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-bounce-in {
          animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .animate-confetti {
          animation: confetti linear forwards;
          font-size: 2rem;
        }
      `}</style>
    </div>
  );
}
