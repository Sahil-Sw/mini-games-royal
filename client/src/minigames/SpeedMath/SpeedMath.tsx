import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../../contexts/SocketContext';
import type { SpeedMathQuestion } from '@shared/index';

interface SpeedMathProps {
  duration: number;
  onComplete: (score: number, time: number) => void;
}

const SpeedMath: React.FC<SpeedMathProps> = ({ duration, onComplete }) => {
  const { socket } = useSocket();
  const [question, setQuestion] = useState<SpeedMathQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    generateQuestion();
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete(score, duration - prev);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateQuestion = () => {
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let num1: number, num2: number, correctAnswer: number;
    
    switch (operator) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        correctAnswer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * num1);
        correctAnswer = num1 - num2;
        break;
      case '*':
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
    setAnswer('');
    setIsCorrect(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question || !answer) return;

    const userAnswer = parseInt(answer);
    const correct = userAnswer === question.answer;
    
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
      setTimeout(() => {
        generateQuestion();
      }, 500);
    } else {
      setTimeout(() => {
        setIsCorrect(null);
        setAnswer('');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-purple-900">
      {/* Timer */}
      <div className="absolute top-8 right-8">
        <div className="text-6xl font-bold text-white">
          {timeLeft}
        </div>
      </div>

      {/* Score */}
      <div className="absolute top-8 left-8">
        <div className="text-4xl font-bold text-yellow-400">
          Score: {score}
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={question?.question}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl text-gray-300 mb-4">Solve this:</h2>
        <div className="text-8xl font-bold text-white mb-8">
          {question?.question}
        </div>
      </motion.div>

      {/* Answer Input */}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your answer"
          autoFocus
          className={`w-full px-8 py-6 text-4xl text-center font-bold rounded-2xl focus:outline-none focus:ring-4 transition-all ${
            isCorrect === true
              ? 'bg-green-500 text-white ring-green-400'
              : isCorrect === false
              ? 'bg-red-500 text-white ring-red-400'
              : 'bg-white text-gray-900 ring-purple-500'
          }`}
        />
        <button type="submit" className="hidden">Submit</button>
      </form>

      {/* Feedback */}
      {isCorrect !== null && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`mt-8 text-4xl font-bold ${
            isCorrect ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {isCorrect ? '✓ Correct!' : '✗ Wrong!'}
        </motion.div>
      )}
    </div>
  );
};

export default SpeedMath;

