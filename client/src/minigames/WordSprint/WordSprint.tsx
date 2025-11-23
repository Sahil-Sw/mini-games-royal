import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useBroadcastGameState } from "../../hooks/useBroadcastGameState";

interface WordSprintProps {
  duration: number;
  onComplete: (score: number, time: number) => void;
  isActive?: boolean;
  spectateState?: any;
}

const WORDS = [
  "REACT",
  "TYPESCRIPT",
  "JAVASCRIPT",
  "PYTHON",
  "DEVELOPER",
  "COMPUTER",
  "KEYBOARD",
  "MONITOR",
  "GAMING",
  "VICTORY",
  "CHAMPION",
  "BATTLE",
  "ROYALE",
  "MINIGAME",
  "SOCKET",
  "SERVER",
  "CLIENT",
  "NETWORK",
  "PLAYER",
  "WINNER",
];

const WordSprint: React.FC<WordSprintProps> = ({
  duration,
  onComplete,
  isActive = true,
  spectateState,
}) => {
  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const scoreRef = useRef(0);

  // If spectating, use the spectate state
  const displayCurrentWord = spectateState?.currentWord || currentWord;
  const displayInput = spectateState?.input || input;
  const displayScore = spectateState?.score ?? score;
  const displayTimeLeft = spectateState?.timeLeft ?? timeLeft;
  const displayFeedback = spectateState?.feedback ?? feedback;

  // Broadcast game state to spectators
  useBroadcastGameState(
    {
      currentWord,
      input,
      score,
      timeLeft,
      feedback,
    },
    isActive
  );

  useEffect(() => {
    // Only initialize game state if actively playing
    if (!isActive) return;

    generateWord();

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
  }, [isActive]);

  const generateWord = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(word);
    setInput("");
    setFeedback(null);
  };

  const handleInputChange = (value: string) => {
    setInput(value.toUpperCase());

    if (value.toUpperCase() === currentWord) {
      setScore((prev) => {
        const newScore = prev + 1;
        scoreRef.current = newScore;
        return newScore;
      });
      setFeedback("correct");
      setTimeout(() => {
        generateWord();
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-900 to-purple-900">
      {/* Timer */}
      <div className="absolute top-8 right-8 text-4xl font-bold text-white">
        {displayTimeLeft}s
      </div>

      {/* Score */}
      <div className="absolute top-8 left-8 text-4xl font-bold text-yellow-400">
        Words: {displayScore}
      </div>

      {/* Instructions */}
      <div className="text-2xl text-gray-300 mb-8">
        Type the word as fast as you can!
      </div>

      {/* Word to type */}
      <motion.div
        key={displayCurrentWord}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-7xl font-bold text-white mb-12 tracking-wider"
      >
        {displayCurrentWord}
      </motion.div>

      {/* Input */}
      <input
        type="text"
        value={displayInput}
        onChange={(e) => isActive && handleInputChange(e.target.value)}
        autoFocus={isActive}
        disabled={!isActive}
        className={`w-full max-w-2xl px-8 py-6 text-4xl text-center font-bold rounded-2xl focus:outline-none focus:ring-4 transition-all ${
          displayFeedback === "correct"
            ? "bg-green-500 text-white ring-green-400"
            : "bg-white text-gray-900 ring-purple-500"
        }`}
        placeholder="Type here..."
      />

      {/* Visual feedback for matching letters */}
      <div className="mt-8 text-3xl font-mono">
        {displayCurrentWord.split("").map((char: string, idx: number) => (
          <span
            key={idx}
            className={
              displayInput[idx] === char
                ? "text-green-400"
                : displayInput[idx]
                ? "text-red-400"
                : "text-gray-500"
            }
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WordSprint;
