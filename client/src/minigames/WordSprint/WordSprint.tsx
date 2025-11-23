import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface WordSprintProps {
  duration: number;
  onComplete: (score: number, time: number) => void;
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

const WordSprint: React.FC<WordSprintProps> = ({ duration, onComplete }) => {
  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const scoreRef = useRef(0);

  useEffect(() => {
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
  }, []);

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
        {timeLeft}s
      </div>

      {/* Score */}
      <div className="absolute top-8 left-8 text-4xl font-bold text-yellow-400">
        Words: {score}
      </div>

      {/* Instructions */}
      <div className="text-2xl text-gray-300 mb-8">
        Type the word as fast as you can!
      </div>

      {/* Word to type */}
      <motion.div
        key={currentWord}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-7xl font-bold text-white mb-12 tracking-wider"
      >
        {currentWord}
      </motion.div>

      {/* Input */}
      <input
        type="text"
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        autoFocus
        className={`w-full max-w-2xl px-8 py-6 text-4xl text-center font-bold rounded-2xl focus:outline-none focus:ring-4 transition-all ${
          feedback === "correct"
            ? "bg-green-500 text-white ring-green-400"
            : "bg-white text-gray-900 ring-purple-500"
        }`}
        placeholder="Type here..."
      />

      {/* Visual feedback for matching letters */}
      <div className="mt-8 text-3xl font-mono">
        {currentWord.split("").map((char, idx) => (
          <span
            key={idx}
            className={
              input[idx] === char
                ? "text-green-400"
                : input[idx]
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
