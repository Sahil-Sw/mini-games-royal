import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HowToPlayScreen = () => {
  const navigate = useNavigate();

  const minigames = [
    {
      name: "🧮 Speed Math Royale",
      difficulty: "Medium",
      description: "Solve math problems as fast as you can!",
      howToPlay:
        "Answer addition, subtraction, multiplication, and division problems. Type your answer and press Enter or tap Submit. Each correct answer gives you 1 point.",
      tips: [
        "Focus on accuracy first",
        "Use keyboard for faster input",
        "Practice mental math",
      ],
    },
    {
      name: "⚡ Reaction Dash",
      difficulty: "Easy",
      description: "Tap when the color changes to green!",
      howToPlay:
        "Wait for the circle to turn green, then tap/click as fast as possible. Each successful reaction gives you 1 point. Clicking too early resets the timer.",
      tips: [
        "Stay focused on the circle",
        "Don't anticipate - wait for green",
        "Relax your hand for faster clicks",
      ],
    },
    {
      name: "🎨 Color Code Breaker",
      difficulty: "Hard",
      description: "Crack the color code puzzle!",
      howToPlay:
        "Use the hints to figure out the correct 4-color sequence. Tap colors to build your guess. Each correct code gives you 1 point.",
      tips: [
        "Use the hints strategically",
        "Remember previous attempts",
        "Look for patterns",
      ],
    },
    {
      name: "🧠 Memory Flash",
      difficulty: "Medium",
      description: "Remember the emoji sequence!",
      howToPlay:
        "Watch the sequence flash on screen, then recreate it by tapping the emojis in order. Each correct sequence gives you 1 point. Sequences get longer each round.",
      tips: [
        "Focus during the flash",
        "Create mental associations",
        "Practice makes perfect",
      ],
    },
    {
      name: "⌨️ Word Sprint",
      difficulty: "Easy",
      description: "Type the word as fast as possible!",
      howToPlay:
        "Type the displayed word exactly as shown (case-insensitive). Each correct word gives you 1 point. New words appear automatically.",
      tips: [
        "Look at the word, not your keyboard",
        "Build typing rhythm",
        "Stay calm and focused",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">📖 How to Play</h1>
          <p className="text-xl text-gray-300">
            Learn the rules and master the minigames!
          </p>
        </motion.div>

        {/* Game Modes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">🎮 Game Modes</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-purple-400 mb-3">
                Multiplayer Mode
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300 text-lg">
                <li>
                  <strong className="text-white">Create a Game:</strong> Choose
                  Free-for-All or Team mode, set number of rounds (1-10)
                </li>
                <li>
                  <strong className="text-white">Share Room Code:</strong> Give
                  the 6-character code to your friends
                </li>
                <li>
                  <strong className="text-white">Join Lobby:</strong> Players
                  join and mark themselves as ready
                </li>
                <li>
                  <strong className="text-white">Play Rounds:</strong> Compete
                  in random minigames each round
                </li>
                <li>
                  <strong className="text-white">Win:</strong> Player/team with
                  the highest total score wins!
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-pink-400 mb-3">
                Single Player Mode
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300 text-lg">
                <li>
                  <strong className="text-white">Select Single Player:</strong>{" "}
                  From the home screen
                </li>
                <li>
                  <strong className="text-white">Choose a Minigame:</strong>{" "}
                  Pick from 5 available games
                </li>
                <li>
                  <strong className="text-white">Play:</strong> Complete the
                  minigame in 30 seconds
                </li>
                <li>
                  <strong className="text-white">Beat Your Best:</strong> Try to
                  beat your personal record!
                </li>
              </ol>
            </div>
          </div>
        </motion.div>

        {/* Scoring System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            🏆 Scoring System
          </h2>
          <div className="space-y-3 text-gray-300 text-lg">
            <p>
              • <strong className="text-white">Points:</strong> Each correct
              answer/action in a minigame gives you points
            </p>
            <p>
              • <strong className="text-white">Total Score:</strong> Your points
              accumulate across all rounds
            </p>
            <p>
              • <strong className="text-white">Round Winner:</strong> Player
              with the highest score in that round
            </p>
            <p>
              • <strong className="text-white">Game Winner:</strong> Player with
              the highest total score after all rounds
            </p>
            <p>
              • <strong className="text-white">Tiebreaker:</strong> If total
              scores are equal, most rounds won determines the winner
            </p>
          </div>
        </motion.div>

        {/* Minigames Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            🎯 Minigames Guide
          </h2>

          <div className="grid gap-6">
            {minigames.map((game, index) => (
              <motion.div
                key={game.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">{game.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      game.difficulty === "Easy"
                        ? "bg-green-500/20 text-green-400"
                        : game.difficulty === "Medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {game.difficulty.toUpperCase()}
                  </span>
                </div>

                <p className="text-gray-400 mb-4 italic">{game.description}</p>

                <div className="mb-4">
                  <h4 className="text-lg font-bold text-purple-400 mb-2">
                    How to Play:
                  </h4>
                  <p className="text-gray-300">{game.howToPlay}</p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-green-400 mb-2">
                    Tips:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {game.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-xl font-bold text-xl hover:scale-105 transition-transform"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default HowToPlayScreen;
