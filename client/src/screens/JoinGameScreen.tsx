import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSocket } from '../contexts/SocketContext';
import { useGameStore } from '../store/gameStore';
import { detectPlatform } from '../utils/platform';
import { storage } from '../utils/storage';

const JoinGameScreen = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { setCurrentRoom, setLoading, setError } = useGameStore();
  
  const [playerName, setPlayerName] = useState(storage.getPlayerName() || '');
  const [roomCode, setRoomCode] = useState('');

  const handleJoin = () => {
    if (!socket || !playerName.trim() || !roomCode.trim()) {
      setError('Please enter your name and room code');
      return;
    }

    setLoading(true);
    storage.setPlayerName(playerName);

    socket.emit('room:join', roomCode.toUpperCase(), playerName, detectPlatform(), (response) => {
      setLoading(false);
      
      if (response.success && response.room) {
        setCurrentRoom(response.room);
        navigate(`/lobby/${response.room.code}`);
      } else {
        setError(response.error || 'Failed to join room');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl"
      >
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Join Game
        </h1>

        {/* Player Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            maxLength={20}
            className="w-full px-4 py-3 bg-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Room Code */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">Room Code</label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="w-full px-4 py-3 bg-slate-700 rounded-lg text-white text-center text-2xl font-bold tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Join Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleJoin}
          disabled={!playerName.trim() || roomCode.length !== 6}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
        >
          Join Game Room
        </motion.button>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300">
            💡 Ask the host for the room code to join their game!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default JoinGameScreen;

