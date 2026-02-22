import { useEffect, useState } from 'react';

export default function SpinBottle({ players, onComplete }) {
  const [spinning, setSpinning] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    // Randomly select team (0 = Team A, 1 = Team B)
    const team = Math.random() < 0.5 ? 0 : 1;
    
    // Calculate rotation: 3-5 full spins + angle to point at selected team
    const fullSpins = 3 + Math.floor(Math.random() * 3); // 3-5 spins
    const teamAngle = team === 0 ? 0 : 180; // Team A at top, Team B at bottom
    const finalRotation = fullSpins * 360 + teamAngle;
    
    // Start spinning
    setTimeout(() => {
      setRotation(finalRotation);
    }, 100);

    // Stop spinning and show result
    setTimeout(() => {
      setSpinning(false);
      setSelectedTeam(team);
    }, 3500);

    // Complete animation
    setTimeout(() => {
      onComplete(team);
    }, 5000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 font-fredoka animate-pulse">
          Spinning to Choose Trump Selector...
        </h2>

        {/* Game Table with Players */}
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 mx-auto mb-8">
          {/* Player positions around the circle */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-blue-100 border-2 border-blue-400 rounded-full w-16 h-16 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-700">A</span>
            </div>
            <div className="text-white text-xs mt-1 font-semibold">Team A</div>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div className="bg-red-100 border-2 border-red-400 rounded-full w-16 h-16 flex items-center justify-center">
              <span className="text-2xl font-bold text-red-700">B</span>
            </div>
            <div className="text-white text-xs mt-1 font-semibold">Team B</div>
          </div>

          {/* Spinning Bottle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="transition-transform duration-[3000ms] ease-out"
              style={{
                transform: `rotate(${rotation}deg)`,
                transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
              }}
            >
              {/* Bottle SVG */}
              <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-2xl">
                {/* Bottle body */}
                <ellipse cx="60" cy="60" rx="20" ry="35" fill="#8B4513" opacity="0.8" />
                {/* Bottle neck pointing up */}
                <rect x="55" y="20" width="10" height="25" fill="#654321" rx="2" />
                {/* Bottle cap */}
                <rect x="53" y="15" width="14" height="8" fill="#FFD700" rx="2" />
                {/* Highlight */}
                <ellipse cx="55" cy="50" rx="8" ry="15" fill="white" opacity="0.3" />
              </svg>
            </div>
          </div>

          {/* Center circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-yellow-400 border-dashed opacity-50"></div>
          </div>
        </div>

        {/* Result */}
        {!spinning && selectedTeam !== null && (
          <div className="animate-bounce-in">
            <div className={`text-4xl sm:text-5xl font-bold mb-4 ${selectedTeam === 0 ? 'text-blue-400' : 'text-red-400'}`}>
              {selectedTeam === 0 ? '🔵 Team A' : '🔴 Team B'}
            </div>
            <div className="text-2xl text-white font-fredoka">
              Will Choose Trump First!
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
