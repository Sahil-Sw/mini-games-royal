import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { MiniGameType } from '@shared/index';
import { getMiniGameComponent } from '../minigames/registry';
import { storage } from '../utils/storage';

const SinglePlayerGameScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { gameType } = location.state as { gameType: MiniGameType };

  const [countdown, setCountdown] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [finalTime, setFinalTime] = useState<number | null>(null);

  useEffect(() => {
    if (!gameType) {
      navigate('/single-player');
      return;
    }

    // Countdown before game starts
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameType, navigate]);

  const handleGameComplete = (score: number, time: number) => {
    setFinalScore(score);
    setFinalTime(time);
    setIsPlaying(false);

    // Save score to localStorage
    storage.saveSinglePlayerScore(gameType, score, time);
  };

  const handlePlayAgain = () => {
    setCountdown(3);
    setFinalScore(null);
    setFinalTime(null);
    setIsPlaying(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBackToMenu = () => {
    navigate('/single-player');
  };

  if (!gameType) {
    return null;
  }

  const gameInfo = getMiniGameComponent(gameType);
  const MiniGameComponent = gameInfo.component;
  const bestScore = storage.getBestScore(gameType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AnimatePresence mode="wait">
        {/* Countdown */}
        {countdown > 0 && !isPlaying && finalScore === null && (
          <motion.div
            key="countdown"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center"
          >
            <div className="text-white text-2xl mb-8">{gameInfo.name}</div>
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="text-9xl font-bold text-white"
            >
              {countdown}
            </motion.div>
          </motion.div>
        )}

        {/* Game */}
        {isPlaying && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MiniGameComponent
              duration={30}
              onComplete={handleGameComplete}
            />
          </motion.div>
        )}

        {/* Results */}
        {finalScore !== null && (
          <motion.div
            key="results"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Game Complete!
                </h2>
                <p className="text-gray-400">{gameInfo.name}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">Your Score</div>
                  <div className="text-4xl font-bold text-yellow-400">{finalScore}</div>
                </div>

                {bestScore && (
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">Personal Best</div>
                    <div className="text-2xl font-bold text-green-400 flex items-center justify-between">
                      <span>{bestScore.score}</span>
                      {finalScore! > bestScore.score && (
                        <span className="text-sm text-yellow-400">🎊 New Record!</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePlayAgain}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
                >
                  Play Again
                </button>
                <button
                  onClick={handleBackToMenu}
                  className="w-full bg-slate-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-600 transition-colors"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SinglePlayerGameScreen;

