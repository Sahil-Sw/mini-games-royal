import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MemoryFlashProps {
  duration: number;
  onComplete: (score: number, time: number) => void;
}

const COLORS = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠"];

const MemoryFlash: React.FC<MemoryFlashProps> = ({ duration, onComplete }) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [isShowing, setIsShowing] = useState(true);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [round, setRound] = useState(1);
  const scoreRef = useRef(0);

  useEffect(() => {
    generateSequence(3); // Start with 3 items

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete(scoreRef.current, duration);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateSequence = (length: number) => {
    const newSequence = Array.from(
      { length },
      () => COLORS[Math.floor(Math.random() * COLORS.length)]
    );
    setSequence(newSequence);
    setUserSequence([]);
    setIsShowing(true);
    setFeedback(null);

    // Show for 2 seconds, then hide
    setTimeout(() => {
      setIsShowing(false);
    }, 2000);
  };

  const handleColorClick = (color: string) => {
    if (isShowing) return;

    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    // Check if correct so far
    const isCorrectSoFar = newUserSequence.every(
      (c, idx) => c === sequence[idx]
    );

    if (!isCorrectSoFar) {
      setFeedback("wrong");
      setTimeout(() => {
        generateSequence(Math.max(3, sequence.length - 1));
        setRound((prev) => prev + 1);
      }, 1500);
      return;
    }

    // Check if complete
    if (newUserSequence.length === sequence.length) {
      setScore((prev) => {
        const newScore = prev + 1;
        scoreRef.current = newScore;
        return newScore;
      });
      setFeedback("correct");
      setTimeout(() => {
        generateSequence(sequence.length + 1);
        setRound((prev) => prev + 1);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-900 to-purple-900">
      {/* Timer */}
      <div className="absolute top-8 right-8 text-4xl font-bold text-white">
        {timeLeft}s
      </div>

      {/* Score */}
      <div className="absolute top-8 left-8">
        <div className="text-4xl font-bold text-yellow-400">Score: {score}</div>
        <div className="text-xl text-gray-300">Round: {round}</div>
      </div>

      {/* Instructions */}
      <div className="text-2xl text-gray-300 mb-8 text-center">
        {isShowing ? "Memorize the sequence!" : "Repeat the sequence!"}
      </div>

      {/* Sequence Display */}
      <div className="mb-12 min-h-[100px] flex items-center justify-center gap-4">
        <AnimatePresence>
          {isShowing &&
            sequence.map((color, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="text-6xl"
              >
                {color}
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* User Input Display */}
      {!isShowing && (
        <div className="mb-8 min-h-[80px] flex items-center gap-3">
          {userSequence.map((color, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-5xl"
            >
              {color}
            </motion.div>
          ))}
        </div>
      )}

      {/* Color Buttons */}
      {!isShowing && (
        <div className="grid grid-cols-3 gap-4">
          {COLORS.map((color) => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleColorClick(color)}
              className="w-24 h-24 text-6xl bg-slate-800/50 rounded-2xl hover:bg-slate-700/50 transition-all"
            >
              {color}
            </motion.button>
          ))}
        </div>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`absolute bottom-20 text-5xl font-bold ${
              feedback === "correct" ? "text-green-400" : "text-red-400"
            }`}
          >
            {feedback === "correct" ? "✓ Correct!" : "✗ Wrong!"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryFlash;
