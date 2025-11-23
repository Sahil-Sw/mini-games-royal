import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ColorCodeProps {
  duration: number;
  onComplete: (score: number, time: number) => void;
}

const COLORS = [
  { name: "RED", color: "#EF4444", emoji: "🔴" },
  { name: "BLUE", color: "#3B82F6", emoji: "🔵" },
  { name: "GREEN", color: "#10B981", emoji: "🟢" },
  { name: "YELLOW", color: "#F59E0B", emoji: "🟡" },
];

const ColorCode: React.FC<ColorCodeProps> = ({ duration, onComplete }) => {
  const [code, setCode] = useState<typeof COLORS>([]);
  const [userCode, setUserCode] = useState<typeof COLORS>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [hints, setHints] = useState<string[]>([]);
  const scoreRef = useRef(0);

  useEffect(() => {
    generateCode();

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

  const generateCode = () => {
    const codeLength = 4;
    const newCode = Array.from(
      { length: codeLength },
      () => COLORS[Math.floor(Math.random() * COLORS.length)]
    );
    setCode(newCode);
    setUserCode([]);
    generateHints(newCode);
  };

  const generateHints = (targetCode: typeof COLORS) => {
    const newHints = [
      `First color: ${targetCode[0].name}`,
      `Contains ${
        new Set(targetCode.map((c) => c.name)).size
      } different colors`,
      `Last color: ${targetCode[targetCode.length - 1].name}`,
    ];
    setHints(newHints);
  };

  const handleColorClick = (color: (typeof COLORS)[0]) => {
    if (userCode.length >= code.length) return;

    const newUserCode = [...userCode, color];
    setUserCode(newUserCode);

    // Check if complete
    if (newUserCode.length === code.length) {
      const isCorrect = newUserCode.every(
        (c, idx) => c.name === code[idx].name
      );

      if (isCorrect) {
        setScore((prev) => {
          const newScore = prev + 1;
          scoreRef.current = newScore;
          return newScore;
        });
        setTimeout(() => {
          generateCode();
        }, 1000);
      } else {
        setTimeout(() => {
          setUserCode([]);
        }, 1000);
      }
    }
  };

  const handleReset = () => {
    setUserCode([]);
  };

  const isCorrect =
    userCode.length === code.length &&
    userCode.every((c, idx) => c.name === code[idx].name);
  const isWrong = userCode.length === code.length && !isCorrect;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-indigo-900">
      {/* Timer */}
      <div className="absolute top-8 right-8 text-4xl font-bold text-white">
        {timeLeft}s
      </div>

      {/* Score */}
      <div className="absolute top-8 left-8 text-4xl font-bold text-yellow-400">
        Codes: {score}
      </div>

      {/* Instructions */}
      <div className="text-2xl text-gray-300 mb-6 text-center">
        Crack the color code!
      </div>

      {/* Hints */}
      <div className="bg-slate-800/50 rounded-2xl p-6 mb-8 max-w-md">
        <h3 className="text-xl font-bold text-white mb-3">Hints:</h3>
        {hints.map((hint, idx) => (
          <div key={idx} className="text-gray-300 mb-2">
            💡 {hint}
          </div>
        ))}
      </div>

      {/* User Code Display */}
      <div className="flex gap-4 mb-8 min-h-[80px] items-center">
        {Array.from({ length: code.length }).map((_, idx) => (
          <div
            key={idx}
            className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl transition-all ${
              userCode[idx]
                ? isCorrect
                  ? "bg-green-500"
                  : isWrong
                  ? "bg-red-500"
                  : "bg-slate-700"
                : "bg-slate-800 border-2 border-dashed border-slate-600"
            }`}
          >
            {userCode[idx]?.emoji || "?"}
          </div>
        ))}
      </div>

      {/* Color Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {COLORS.map((color) => (
          <motion.button
            key={color.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleColorClick(color)}
            disabled={userCode.length >= code.length}
            className="w-24 h-24 rounded-2xl text-5xl flex items-center justify-center transition-all disabled:opacity-50"
            style={{ backgroundColor: color.color }}
          >
            {color.emoji}
          </motion.button>
        ))}
      </div>

      {/* Reset Button */}
      {userCode.length > 0 && !isCorrect && (
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
        >
          Reset
        </button>
      )}

      {/* Feedback */}
      {isCorrect && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-5xl font-bold text-green-400"
        >
          ✓ Cracked!
        </motion.div>
      )}
    </div>
  );
};

export default ColorCode;
