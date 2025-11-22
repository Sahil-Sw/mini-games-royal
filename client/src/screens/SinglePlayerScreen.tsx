import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MINIGAME_CONFIGS, type MiniGameType } from "@shared/index";
import { storage } from "../utils/storage";

const SinglePlayerScreen = () => {
  const navigate = useNavigate();
  const stats = storage.getSinglePlayerStats();

  const handlePlayGame = (gameType: MiniGameType) => {
    navigate("/single-player/game", { state: { gameType } });
  };

  const minigameIcons: Record<MiniGameType, string> = {
    "speed-math": "🧮",
    "reaction-dash": "⚡",
    "color-code": "🎨",
    "memory-flash": "🧠",
    "word-sprint": "⌨️",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Back to Home
          </button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
              Single Player
            </h1>
            <p className="text-gray-300 text-lg">
              Practice your skills and beat your personal best!
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400">
                {stats.gamesPlayed}
              </div>
              <div className="text-gray-400 text-sm">Games Played</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {stats.totalScore}
              </div>
              <div className="text-gray-400 text-sm">Total Score</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400">
                {Object.keys(stats.bestScores).length}
              </div>
              <div className="text-gray-400 text-sm">Games Mastered</div>
            </div>
          </motion.div>
        </div>

        {/* Game Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Choose a Minigame
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(MINIGAME_CONFIGS) as MiniGameType[]).map(
              (gameType, index) => {
                const config = MINIGAME_CONFIGS[gameType];
                const bestScore = storage.getBestScore(gameType);

                return (
                  <motion.div
                    key={gameType}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 cursor-pointer hover:bg-slate-700/50 transition-all"
                    onClick={() => handlePlayGame(gameType)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-5xl">{minigameIcons[gameType]}</div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          config.difficulty === "easy"
                            ? "bg-green-500/20 text-green-400"
                            : config.difficulty === "medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {config.difficulty?.toUpperCase()}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                      {config.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {config.description}
                    </p>

                    {bestScore ? (
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">
                          Personal Best
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-yellow-400">
                            {bestScore.score}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(bestScore.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <div className="text-sm text-gray-400">
                          Not played yet
                        </div>
                      </div>
                    )}

                    <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:scale-105 transition-transform">
                      Play Now
                    </button>
                  </motion.div>
                );
              }
            )}
          </div>
        </div>

        {/* Recent Games */}
        {stats.recentGames.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Recent Games</h2>
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6">
              <div className="space-y-3">
                {stats.recentGames.slice(0, 5).map((game, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-700/50 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {minigameIcons[game.gameType]}
                      </div>
                      <div>
                        <div className="text-white font-bold">
                          {MINIGAME_CONFIGS[game.gameType].name}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {new Date(game.date).toLocaleDateString()} at{" "}
                          {new Date(game.date).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-400">
                        {game.score}
                      </div>
                      <div className="text-gray-400 text-sm">{game.time}s</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SinglePlayerScreen;
