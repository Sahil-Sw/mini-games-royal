import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSocket } from "../../contexts/SocketContext";
import { useBroadcastGameState } from "../../hooks/useBroadcastGameState";
import type { SpeedMathQuestion } from "@shared/index";

interface SpeedMathProps {
  duration: number;
  onComplete: (score: number, time: number) => void;
  isActive?: boolean; // Whether this player is actively playing (for spectating)
  spectateState?: any; // Real-time state from the active player (for spectators)
}

const SpeedMath: React.FC<SpeedMathProps> = ({
  duration,
  onComplete,
  isActive = true,
  spectateState,
}) => {
  const { socket } = useSocket();
  const [question, setQuestion] = useState<SpeedMathQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const scoreRef = useRef(0);

  // If spectating, use the spectate state instead of local state
  const displayQuestion = spectateState?.question || question?.question;
  const displayAnswer = spectateState?.answer || answer;
  const displayScore = spectateState?.score ?? score;
  const displayTimeLeft = spectateState?.timeLeft ?? timeLeft;
  const displayIsCorrect = spectateState?.isCorrect ?? isCorrect;

  // Broadcast game state to spectators
  useBroadcastGameState(
    {
      question: question?.question,
      answer,
      score,
      timeLeft,
      isCorrect,
    },
    isActive
  );

  useEffect(() => {
    generateQuestion();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete(scoreRef.current, duration - prev);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateQuestion = () => {
    const operators = ["+", "-", "*"];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let num1: number, num2: number, correctAnswer: number;

    switch (operator) {
      case "+":
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        correctAnswer = num1 + num2;
        break;
      case "-":
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * num1);
        correctAnswer = num1 - num2;
        break;
      case "*":
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        correctAnswer = num1 * num2;
        break;
      default:
        num1 = 0;
        num2 = 0;
        correctAnswer = 0;
    }

    setQuestion({
      question: `${num1} ${operator} ${num2}`,
      answer: correctAnswer,
      operators: [operator],
    });
    setAnswer("");
    setIsCorrect(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!question || !answer) return;

    const userAnswer = parseInt(answer);
    const correct = userAnswer === question.answer;

    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => {
        const newScore = prev + 1;
        scoreRef.current = newScore;
        return newScore;
      });
      setTimeout(() => {
        generateQuestion();
      }, 500);
    } else {
      setTimeout(() => {
        setIsCorrect(null);
        setAnswer("");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-purple-900">
      {/* Timer */}
      <div className="absolute top-8 right-8">
        <div className="text-6xl font-bold text-white">{displayTimeLeft}</div>
      </div>

      {/* Score */}
      <div className="absolute top-8 left-8">
        <div className="text-4xl font-bold text-yellow-400">
          Score: {displayScore}
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={displayQuestion}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl text-gray-300 mb-4">Solve this:</h2>
        <div className="text-8xl font-bold text-white mb-8">
          {displayQuestion}
        </div>
      </motion.div>

      {/* Answer Input */}
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="number"
          value={displayAnswer}
          onChange={(e) => isActive && setAnswer(e.target.value)}
          placeholder="Your answer"
          autoFocus={isActive}
          disabled={!isActive}
          className={`w-full px-8 py-6 text-4xl text-center font-bold rounded-2xl focus:outline-none focus:ring-4 transition-all ${
            displayIsCorrect === true
              ? "bg-green-500 text-white ring-green-400"
              : displayIsCorrect === false
              ? "bg-red-500 text-white ring-red-400"
              : "bg-white text-gray-900 ring-purple-500"
          }`}
        />
        {isActive && (
          <button
            type="submit"
            className="w-full px-8 py-4 text-2xl font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-2xl transition-all active:scale-95"
          >
            Submit Answer
          </button>
        )}
      </form>

      {/* Feedback */}
      {displayIsCorrect !== null && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`mt-8 text-4xl font-bold ${
            displayIsCorrect ? "text-green-400" : "text-red-400"
          }`}
        >
          {displayIsCorrect ? "✓ Correct!" : "✗ Wrong!"}
        </motion.div>
      )}
    </div>
  );
};

export default SpeedMath;
