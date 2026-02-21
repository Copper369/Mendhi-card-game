import { useEffect, useState } from 'react';

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const suits = ['♠', '♥', '♦', '♣'];
  const cards = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    suit: suits[Math.floor(Math.random() * suits.length)],
    left: `${Math.random() * 100}%`,
    animationDuration: `${15 + Math.random() * 10}s`,
    animationDelay: `${Math.random() * 5}s`,
    size: `${2 + Math.random() * 2}rem`,
    opacity: 0.1 + Math.random() * 0.2
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {cards.map((card) => (
        <div
          key={card.id}
          className="absolute animate-float"
          style={{
            left: card.left,
            fontSize: card.size,
            opacity: card.opacity,
            animationDuration: card.animationDuration,
            animationDelay: card.animationDelay,
            color: card.suit === '♥' || card.suit === '♦' ? '#ef4444' : '#1f2937'
          }}
        >
          {card.suit}
        </div>
      ))}

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}
