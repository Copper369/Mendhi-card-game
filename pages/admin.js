import { useState, useEffect } from 'react';

export default function AdminPortal() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authenticate = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setAuthToken(data.token);
        setIsAuthenticated(true);
        fetchRooms(data.token);
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Failed to authenticate');
      console.error(err);
    }
    
    setLoading(false);
  };

  const fetchRooms = async (token = authToken) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'}/api/admin/rooms`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.status === 401) {
        setError('Session expired. Please login again.');
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      setError('Failed to fetch rooms');
      console.error(err);
    }
    setLoading(false);
  };

  const deleteRoom = async (roomId) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'}/api/admin/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (res.ok) {
        alert('Room deleted successfully');
        fetchRooms();
      } else {
        alert('Failed to delete room');
      }
    } catch (err) {
      alert('Failed to delete room');
      console.error(err);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthToken('');
    setUsername('');
    setPassword('');
    setRooms([]);
  };

  useEffect(() => {
    if (isAuthenticated && authToken) {
      const interval = setInterval(() => fetchRooms(), 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, authToken]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            🔐 Admin Portal
          </h1>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && authenticate()}
              className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter username"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && authenticate()}
              className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter password"
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <button
            onClick={authenticate}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                🛠️ Room Management
              </h1>
              <p className="text-gray-600 mt-2">Total Rooms: {rooms.length}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchRooms}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                🔄 Refresh
              </button>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center text-white text-xl">Loading...</div>
        )}

        <div className="grid gap-4">
          {rooms.map((room) => (
            <div key={room.roomId} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{room.roomName}</h2>
                  <p className="text-sm text-gray-500">ID: {room.roomId}</p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(room.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteRoom(room.roomId)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                >
                  🗑️ Delete
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm font-semibold text-gray-700">Players</p>
                  <p className="text-2xl font-bold text-blue-600">{room.playerCount}/4</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm font-semibold text-gray-700">Status</p>
                  <p className="text-lg font-bold text-green-600 capitalize">{room.gamePhase}</p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  👑 Admin: {room.adminName}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Players:</p>
                <div className="grid grid-cols-2 gap-2">
                  {room.players.map((player, idx) => (
                    <div key={idx} className="bg-blue-50 rounded p-2 text-sm">
                      {player.name} {player.isAI && <span className="text-xs bg-gray-500 text-white px-1 rounded">AI</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {rooms.length === 0 && !loading && (
          <div className="text-center text-white text-xl">
            No active rooms
          </div>
        )}
      </div>
    </div>
  );
}
