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
import SpinBottle from '../components/SpinBottle';

export default function Game() {
  const router = useRouter();
  const { socket, roomId, room, setRoom, addChatMessage } = useGameStore();
  const [error, setError] = useState('');
  const [roundResult, setRoundResult] = useState(null);
  const [matchDashboard, setMatchDashboard] = useState(null);
  const [trumpNotification, setTrumpNotification] = useState(null);
  const [showDealing, setShowDealing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [showSpinBottle, setShowSpinBottle] = useState(false);

  // Prevent accidental page leave
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (room && room.gameState) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your game progress will be lost.';
        return e.returnValue;
      }
    };

    const handleRouteChange = (url) => {
      if (room && room.gameState && url !== router.asPath) {
        setShowLeaveConfirm(true);
        setPendingNavigation(url);
        router.events.emit('routeChangeError');
        throw 'Route change aborted by user confirmation';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [room, router]);

  const handleLeaveGame = () => {
    setShowLeaveConfirm(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
    } else {
      router.push('/');
    }
  };

  const handleCancelLeave = () => {
    setShowLeaveConfirm(false);
    setPendingNavigation(null);
  };

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

    socket.on('spin_bottle_start', (roomData) => {
      setShowSpinBottle(true);
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

    socket.on('player_reconnected', ({ playerName, message }) => {
      console.log('Player reconnected:', playerName);
      setTrumpNotification({ message, isReconnect: true });
      setTimeout(() => {
        if (trumpNotification?.isReconnect) {
          setTrumpNotification(null);
        }
      }, 3000);
    });

    return () => {
      socket.off('joined_room');
      socket.off('game_update');
      socket.off('game_started');
      socket.off('dealing_cards');
      socket.off('spin_bottle_start');
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
      socket.off('player_reconnected');
    };
  }, [socket, roomId, router, setRoom, addChatMessage, trumpNotification]);

  const handleResetGame = () => {
    socket.emit('reset_game', { roomId });
  };

  const handleSpinBottleComplete = (selectedTeam) => {
    setShowSpinBottle(false);
    socket.emit('spin_bottle_complete', { roomId, selectedTeam });
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
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 ${trumpNotification.isReconnect ? 'bg-green-400' : 'bg-yellow-400'} text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg z-50 animate-bounce text-sm sm:text-base font-fredoka`}>
          {trumpNotification.isDealing || trumpNotification.isReconnect ? (
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
      {showSpinBottle && <SpinBottle players={room.players} onComplete={handleSpinBottleComplete} />}
      {showCelebration && <Celebration winner={showCelebration.winner} type={showCelebration.type} />}
      {roundResult && !showCelebration && <RoundResult result={roundResult} onClose={() => setRoundResult(null)} />}
      {matchDashboard && <MatchDashboard dashboard={matchDashboard} onReset={handleResetGame} />}
      
      {/* Leave Game Confirmation Dialog */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full animate-bounce-in">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 font-fredoka">Leave Game?</h2>
              <p className="text-gray-600">
                Are you sure you want to leave? Your game is in progress and you'll lose your spot.
              </p>
              <p className="text-sm text-blue-600 mt-2">
                💡 You can rejoin with the same name to continue playing!
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelLeave}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition"
              >
                Stay in Game
              </button>
              <button
                onClick={handleLeaveGame}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Leave Game
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 relative z-10">
        <div className="text-center mb-2 sm:mb-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-fredoka">{room.roomName}</h2>
          <p className="text-xs sm:text-sm text-gray-600 font-fredoka">Room ID: {room.roomId}</p>
        </div>

        <GameTable room={room} socket={socket} />
      </div>
      
      {/* Chat as floating icon */}
      <ChatPanel socket={socket} roomId={roomId} />
      
      <style jsx>{`
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
