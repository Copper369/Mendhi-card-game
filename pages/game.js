import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useGameStore from '../store/gameStore';
import GameTable from '../components/GameTable';
import ChatPanel from '../components/ChatPanel';
import RoundResult from '../components/RoundResult';
import MatchDashboard from '../components/MatchDashboard';
import DealingAnimation from '../components/DealingAnimation';
import Celebration from '../components/Celebration';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Game() {
  const router = useRouter();
  const { socket, roomId, room, setRoom, addChatMessage } = useGameStore();
  const [error, setError] = useState('');
  const [roundResult, setRoundResult] = useState(null);
  const [matchDashboard, setMatchDashboard] = useState(null);
  const [trumpNotification, setTrumpNotification] = useState(null);
  const [showDealing, setShowDealing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(null);

  useEffect(() => {
    if (!socket || !roomId) {
      router.push('/');
      return;
    }

    socket.on('joined_room', (roomData) => {
      setRoom(roomData);
    });

    socket.on('game_update', (roomData) => {
      setRoom(roomData);
    });

    socket.on('game_started', (roomData) => {
      setRoom(roomData);
    });

    socket.on('dealing_cards', (roomData) => {
      setShowDealing(true);
      setTimeout(() => setShowDealing(false), 3000);
    });

    socket.on('dealing_remaining_cards', (roomData) => {
      setTrumpNotification({ message: 'Dealing remaining 3 cards...', isDealing: true });
      setTimeout(() => {
        if (trumpNotification?.isDealing) {
          setTrumpNotification(null);
        }
      }, 2000);
    });

    socket.on('trump_selected', ({ trumpSuit, team }) => {
      setTrumpNotification({ trumpSuit, team });
      setTimeout(() => setTrumpNotification(null), 3000);
    });

    socket.on('trick_result', (winner) => {
      console.log('Trick won by:', winner);
    });

    socket.on('round_result', (result) => {
      setRoundResult(result);
      
      // Only show celebration if there's a winner (not a draw)
      if (result.winner && !result.isDraw) {
        setShowCelebration({ winner: result.winner, type: 'round' });
        setTimeout(() => {
          setShowCelebration(null);
          setRoundResult(null);
        }, 4000);
      } else {
        // For draws, just show result screen without celebration
        setTimeout(() => {
          setRoundResult(null);
        }, 5000);
      }
    });

    socket.on('next_round_start', (roomData) => {
      setRoom(roomData);
    });

    socket.on('match_dashboard', (dashboard) => {
      setShowCelebration({ winner: dashboard.matchWinner, type: 'match' });
      setTimeout(() => {
        setShowCelebration(null);
        setMatchDashboard(dashboard);
      }, 4000);
    });

    socket.on('game_reset', (roomData) => {
      setRoom(roomData);
      setMatchDashboard(null);
      router.push('/');
    });

    socket.on('chat_message', (msg) => {
      addChatMessage(msg);
    });

    socket.on('error', (msg) => {
      setError(msg);
      setTimeout(() => setError(''), 3000);
    });

    socket.on('player_disconnect', ({ socketId }) => {
      console.log('Player disconnected:', socketId);
    });

    return () => {
      socket.off('joined_room');
      socket.off('game_update');
      socket.off('game_started');
      socket.off('dealing_cards');
      socket.off('dealing_remaining_cards');
      socket.off('trump_selected');
      socket.off('trick_result');
      socket.off('round_result');
      socket.off('next_round_start');
      socket.off('match_dashboard');
      socket.off('game_reset');
      socket.off('chat_message');
      socket.off('error');
      socket.off('player_disconnect');
    };
  }, [socket, roomId, router, setRoom, addChatMessage]);

  const handleResetGame = () => {
    socket.emit('reset_game', { roomId });
  };

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-green-900">
        <AnimatedBackground />
        <div className="text-white text-xl relative z-10">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 relative overflow-x-hidden">
      <AnimatedBackground />
      
      {/* Header - cardgames.io style */}
      <header className="bg-white bg-opacity-90 shadow-md py-3 sm:py-5 relative z-10">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center font-fredoka text-gray-800 tracking-wider">
            MENDHIKOT.IO
          </h1>
        </div>
      </header>

      {error && (
        <div className="fixed top-20 right-4 bg-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg z-50 text-sm sm:text-base font-fredoka">
          {error}
        </div>
      )}

      {trumpNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg z-50 animate-bounce text-sm sm:text-base font-fredoka">
          {trumpNotification.isDealing ? (
            <span className="font-bold">{trumpNotification.message}</span>
          ) : (
            <>
              <span className="font-bold">
                {trumpNotification.team === 'teamA' ? 'Team A' : 'Team B'}
              </span> chose <span className="font-bold capitalize">{trumpNotification.trumpSuit}</span> as trump!
            </>
          )}
        </div>
      )}

      {showDealing && <DealingAnimation />}
      {showCelebration && <Celebration winner={showCelebration.winner} type={showCelebration.type} />}
      {roundResult && !showCelebration && <RoundResult result={roundResult} onClose={() => setRoundResult(null)} />}
      {matchDashboard && <MatchDashboard dashboard={matchDashboard} onReset={handleResetGame} />}
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 relative z-10">
        <div className="text-center mb-2 sm:mb-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-fredoka">{room.roomName}</h2>
          <p className="text-xs sm:text-sm text-gray-600 font-fredoka">Room ID: {room.roomId}</p>
        </div>

        <GameTable room={room} socket={socket} />
      </div>
      
      {/* Chat as floating icon */}
      <ChatPanel socket={socket} roomId={roomId} />
    </div>
  );
}
