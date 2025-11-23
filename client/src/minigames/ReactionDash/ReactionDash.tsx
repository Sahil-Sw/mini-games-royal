import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ReactionDashProps {
  duration: number;
  onComplete: (score: number, time: number) => void;
}

const ReactionDash: React.FC<ReactionDashProps> = ({
  duration,
  onComplete,
}) => {
  const [color, setColor] = useState("red");
  const [targetColor] = useState("green");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [message, setMessage] = useState("Wait for GREEN...");
  const [canClick, setCanClick] = useState(false);
  const changeTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const scoreRef = useRef(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
    scheduleColorChange();

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

  const scheduleColorChange = () => {
    const delay = Math.random() * 3000 + 2000; // 2-5 seconds
    setTimeout(() => {
      setColor("green");
      setCanClick(true);
      setMessage("TAP NOW!");
      changeTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (color === "green" && canClick) {
      const reactionTime = Date.now() - changeTimeRef.current;
      setScore((prev) => {
        const newScore = prev + 1;
        scoreRef.current = newScore;
        return newScore;
      });
      setMessage(`${reactionTime}ms! Great!`);

      // Reset
      setColor("red");
      setCanClick(false);
      setTimeout(() => {
        setMessage("Wait for GREEN...");
        if (timeLeft > 2) {
          scheduleColorChange();
        }
      }, 1000);
    } else if (color === "red") {
      setMessage("Too early! Wait for GREEN!");
      setTimeout(() => setMessage("Wait for GREEN..."), 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Timer */}
      <div className="absolute top-8 right-8 text-4xl font-bold text-white">
        {timeLeft}s
      </div>

      {/* Score */}
      <div className="absolute top-8 left-8 text-4xl font-bold text-yellow-400">
        Taps: {score}
      </div>

      {/* Message */}
      <motion.div
        key={message}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-3xl font-bold text-white mb-12 text-center"
      >
        {message}
      </motion.div>

      {/* Click Area */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`w-80 h-80 rounded-full text-6xl font-bold transition-all duration-300 ${
          color === "green"
            ? "bg-green-500 text-white shadow-2xl shadow-green-500/50"
            : "bg-red-500 text-white"
        }`}
      >
        {color === "green" ? "🟢" : "🔴"}
      </motion.button>
    </div>
  );
};

export default ReactionDash;
