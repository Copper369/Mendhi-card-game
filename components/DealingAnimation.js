export default function DealingAnimation() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-8 animate-pulse">
          Dealing Cards...
        </h2>
        
        {/* Card deck in center */}
        <div className="relative w-64 h-40 mx-auto mb-8">
          {/* Deck pile */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="text-6xl">🂠</div>
          </div>
          
          {/* Cards flying to 4 positions */}
          {[...Array(8)].map((_, i) => {
            const positions = [
              { top: '100%', left: '50%', transform: 'translate(-50%, 20px)' }, // Bottom (player)
              { top: '50%', left: '0%', transform: 'translate(-80px, -50%)' },   // Left
              { top: '0%', left: '50%', transform: 'translate(-50%, -80px)' },   // Top
              { top: '50%', left: '100%', transform: 'translate(20px, -50%)' }   // Right
            ];
            const pos = positions[i % 4];
            const delay = i * 0.15;
            
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl animate-deal-card"
                style={{
                  animationDelay: `${delay}s`,
                  '--target-top': pos.top,
                  '--target-left': pos.left,
                  '--target-transform': pos.transform
                }}
              >
                🂠
              </div>
            );
          })}
        </div>
        
        <p className="text-xl text-gray-300">
          Shuffling and distributing...
        </p>
      </div>

      <style jsx>{`
        @keyframes deal-card {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2) rotate(360deg);
          }
          100% {
            opacity: 0;
            top: var(--target-top);
            left: var(--target-left);
            transform: var(--target-transform) scale(0.8);
          }
        }
        .animate-deal-card {
          animation: deal-card 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
