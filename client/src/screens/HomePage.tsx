import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSocket } from '../contexts/SocketContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { isConnected } = useSocket();

  const menuItems = [
    { label: 'Create Game', path: '/create', icon: '🎮', color: 'from-blue-500 to-purple-500' },
    { label: 'Join Game', path: '/join', icon: '🚀', color: 'from-purple-500 to-pink-500' },
    { label: 'Single Player', path: '/single-player', icon: '🎯', color: 'from-pink-500 to-red-500' },
    { label: 'How to Play', path: '/how-to-play', icon: '📖', color: 'from-green-500 to-teal-500' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Connection Status */}
      <div className="absolute top-4 right-4">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
          <span className="text-sm font-medium">{isConnected ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Minigame
        </h1>
        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          Battle Royale
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Compete in fast-paced minigames with friends! Team up or go solo in the ultimate multiplayer showdown.
        </p>
      </motion.div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.path}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(item.path)}
            className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${item.color} shadow-2xl hover:shadow-3xl transition-all`}
          >
            <div className="flex items-center gap-4">
              <span className="text-6xl">{item.icon}</span>
              <span className="text-3xl font-bold text-white">{item.label}</span>
            </div>
            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-12 text-center text-gray-400"
      >
        <p className="text-sm">Up to 10 players • Cross-platform • Real-time multiplayer</p>
      </motion.div>
    </div>
  );
};

export default HomePage;

