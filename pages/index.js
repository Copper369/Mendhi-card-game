import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useGameStore from '../store/gameStore';
import { io } from 'socket.io-client';

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [rooms, setRooms] = useState([]);
  const [activeTab, setActiveTab] = useState('create');
  const { setSocket, setPlayerName: setStoreName, setRoomId } = useGameStore();

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'}/api/rooms`);
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    }
  };

  const createRoom = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          roomName: roomName || 'New Room'
        })
      });
      const room = await res.json();
      joinRoom(room.roomId);
    } catch (err) {
      console.error('Failed to create room:', err);
      alert('Failed to create room');
    }
  };

  const joinRoom = (roomId) => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
    setSocket(socket);
    setStoreName(playerName);
    setRoomId(roomId);
    
    socket.emit('join_room', { roomId, playerName });
    router.push('/game');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 relative">
      {/* Admin Portal Link */}
      <a
        href="/admin"
        className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition text-xs sm:text-sm font-semibold"
      >
        🔐 Admin
      </a>
      
      <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 max-w-3xl w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 text-green-800">Mendhikot Online</h1>
        <p className="text-center text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">32-Card Multiplayer Game</p>
        
        <div className="mb-4 sm:mb-6">
          <label className="block text-xs sm:text-sm font-medium mb-2">Your Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
            placeholder="Enter your name"
          />
        </div>

        <div className="flex gap-2 mb-4 sm:mb-6 border-b">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 sm:py-3 text-sm sm:text-base font-semibold transition ${
              activeTab === 'create'
                ? 'text-green-700 border-b-2 border-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Create Room
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-2 sm:py-3 text-sm sm:text-base font-semibold transition ${
              activeTab === 'join'
                ? 'text-green-700 border-b-2 border-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Join Room
          </button>
        </div>

        {activeTab === 'create' ? (
          <div>
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-medium mb-2">Room Name (Optional)</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                placeholder="My Game Room"
              />
            </div>

            <button
              onClick={createRoom}
              className="w-full bg-green-600 text-white py-3 sm:py-4 rounded-lg hover:bg-green-700 transition font-semibold text-base sm:text-lg"
            >
              Create New Room
            </button>

            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-800">
                <strong>Note:</strong> AI players will automatically fill empty seats. Share the room ID with friends to play together!
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-xl font-semibold">Available Rooms</h2>
              <button
                onClick={fetchRooms}
                className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium"
              >
                🔄 Refresh
              </button>
            </div>
            
            {rooms.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
                <p className="text-sm sm:text-base text-gray-500 mb-2">No rooms available</p>
                <p className="text-xs sm:text-sm text-gray-400">Create a new room to start playing!</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                {rooms.map((room) => (
                  <div key={room.roomId} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 p-3 sm:p-4 border-2 rounded-lg hover:bg-gray-50 transition">
                    <div>
                      <p className="font-semibold text-base sm:text-lg">{room.roomName}</p>
                      <p className="text-xs sm:text-sm text-gray-500">Room ID: {room.roomId}</p>
                      <p className="text-xs sm:text-sm font-medium text-green-600">{room.playerCount}/4 players</p>
                    </div>
                    <button
                      onClick={() => joinRoom(room.roomId)}
                      disabled={room.playerCount >= 4}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition text-sm sm:text-base"
                    >
                      {room.playerCount >= 4 ? 'Full' : 'Join'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
