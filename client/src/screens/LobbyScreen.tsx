import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSocket } from '../contexts/SocketContext';
import { useGameStore } from '../store/gameStore';

const LobbyScreen = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { currentRoom, currentPlayer, setCurrentRoom } = useGameStore();

  useEffect(() => {
    if (!socket || !currentRoom) {
      navigate('/');
      return;
    }

    // Listen for room updates
    socket.on('room:updated', (room) => {
      setCurrentRoom(room);
    });

    socket.on('game:stateChanged', (state) => {
      if (state === 'countdown' || state === 'playing') {
        navigate(`/game/${roomCode}`);
      }
    });

    return () => {
      socket.off('room:updated');
      socket.off('game:stateChanged');
    };
  }, [socket, currentRoom, roomCode, navigate, setCurrentRoom]);

  const handleReady = () => {
    if (socket) {
      socket.emit('lobby:ready', !currentPlayer?.isReady);
    }
  };

  const handleStartGame = () => {
    if (socket && currentPlayer?.isHost) {
      socket.emit('lobby:startGame');
    }
  };

  if (!currentRoom) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  const isHost = currentPlayer?.isHost;
  const allReady = currentRoom.players.every(p => p.isReady || p.isHost);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Game Lobby</h1>
              <p className="text-gray-400">Room Code: <span className="text-2xl font-bold text-purple-400">{currentRoom.code}</span></p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Leave
            </button>
          </div>
        </div>

        {/* Players */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Players ({currentRoom.players.length}/{currentRoom.config.maxPlayers})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentRoom.players.map((player) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg ${
                  player.isReady ? 'bg-green-500/20 border-2 border-green-500' : 'bg-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{player.avatar || '👤'}</span>
                    <div>
                      <div className="font-medium text-white">
                        {player.name}
                        {player.isHost && <span className="ml-2 text-xs bg-yellow-500 px-2 py-1 rounded">HOST</span>}
                      </div>
                      <div className="text-sm text-gray-400">{player.platform}</div>
                    </div>
                  </div>
                  {player.isReady && <span className="text-green-400">✓ Ready</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Game Settings */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Game Settings</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{currentRoom.config.mode.toUpperCase()}</div>
              <div className="text-sm text-gray-400">Mode</div>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{currentRoom.config.numberOfRounds}</div>
              <div className="text-sm text-gray-400">Rounds</div>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{currentRoom.config.numberOfTeams || 'N/A'}</div>
              <div className="text-sm text-gray-400">Teams</div>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-pink-400">{currentRoom.config.enabledMinigames.length}</div>
              <div className="text-sm text-gray-400">Minigames</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          {!isHost && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReady}
              className={`flex-1 py-4 rounded-lg font-bold text-white text-lg transition-all ${
                currentPlayer?.isReady
                  ? 'bg-gray-600 hover:bg-gray-700'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg'
              }`}
            >
              {currentPlayer?.isReady ? 'Not Ready' : 'Ready!'}
            </motion.button>
          )}
          
          {isHost && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartGame}
              disabled={!allReady || currentRoom.players.length < 2}
              className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              Start Game
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LobbyScreen;

