import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSocket } from "../contexts/SocketContext";
import { useGameStore } from "../store/gameStore";
import {
  GAME_CONSTANTS,
  MINIGAME_CONFIGS,
  type GameMode,
  type MiniGameType,
} from "@shared/index";
import { detectPlatform } from "../utils/platform";
import { storage } from "../utils/storage";

const CreateGameScreen = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { setCurrentRoom, setCurrentPlayer, setLoading, setError } =
    useGameStore();

  const [playerName, setPlayerName] = useState(storage.getPlayerName() || "");
  const [mode, setMode] = useState<GameMode>("team");
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [numberOfRounds, setNumberOfRounds] = useState(10);
  const [teamAssignment, setTeamAssignment] = useState<"random" | "manual">(
    "random"
  );
  const [selectedMinigames, setSelectedMinigames] = useState<MiniGameType[]>(
    Object.keys(MINIGAME_CONFIGS) as MiniGameType[]
  );

  const handleCreate = () => {
    if (!socket || !playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    storage.setPlayerName(playerName);

    socket.emit(
      "room:create",
      {
        mode,
        maxPlayers: GAME_CONSTANTS.MAX_PLAYERS,
        numberOfTeams: mode === "team" ? numberOfTeams : 0,
        numberOfRounds,
        enabledMinigames: selectedMinigames,
        roundDuration: 30,
        teamAssignment: mode === "team" ? teamAssignment : undefined,
      },
      playerName,
      (response) => {
        setLoading(false);

        if (response.success && response.room && response.playerId) {
          setCurrentRoom(response.room);
          // Find and set the current player
          const player = response.room.players.find(
            (p: any) => p.id === response.playerId
          );
          if (player) {
            setCurrentPlayer(player);
          }
          navigate(`/lobby/${response.room.code}`);
        } else {
          setError(response.error || "Failed to create room");
        }
      }
    );
  };

  const toggleMinigame = (gameId: MiniGameType) => {
    setSelectedMinigames((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId]
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
      >
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Create Game
        </h1>

        {/* Player Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            maxLength={20}
            className="w-full px-4 py-3 bg-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Game Mode */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Game Mode
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(["team", "ffa", "single"] as GameMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`py-3 rounded-lg font-medium transition-all ${
                  mode === m
                    ? "bg-purple-500 text-white"
                    : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                }`}
              >
                {m === "team"
                  ? "Team Battle"
                  : m === "ffa"
                  ? "Free-For-All"
                  : "Single Player"}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Teams (only for team mode) */}
        {mode === "team" && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Number of Teams: {numberOfTeams}
              </label>
              <input
                type="range"
                min={GAME_CONSTANTS.MIN_TEAMS}
                max={GAME_CONSTANTS.MAX_TEAMS}
                value={numberOfTeams}
                onChange={(e) => setNumberOfTeams(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Team Assignment Mode */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Team Assignment
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTeamAssignment("random")}
                  className={`py-3 rounded-lg font-medium transition-all ${
                    teamAssignment === "random"
                      ? "bg-purple-500 text-white"
                      : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                  }`}
                >
                  🎲 Random
                </button>
                <button
                  onClick={() => setTeamAssignment("manual")}
                  className={`py-3 rounded-lg font-medium transition-all ${
                    teamAssignment === "manual"
                      ? "bg-purple-500 text-white"
                      : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                  }`}
                >
                  ✋ Manual
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {teamAssignment === "random"
                  ? "Teams will be randomly assigned when game starts"
                  : "Host can manually assign players to teams in lobby"}
              </p>
            </div>
          </>
        )}

        {/* Number of Rounds */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of Rounds: {numberOfRounds}
          </label>
          <input
            type="range"
            min={GAME_CONSTANTS.MIN_ROUNDS}
            max={GAME_CONSTANTS.MAX_ROUNDS}
            value={numberOfRounds}
            onChange={(e) => setNumberOfRounds(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Minigame Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Select Minigames ({selectedMinigames.length} selected)
          </label>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(MINIGAME_CONFIGS).map((game) => (
              <button
                key={game.id}
                onClick={() => toggleMinigame(game.id)}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedMinigames.includes(game.id)
                    ? "bg-purple-500/30 border-2 border-purple-500"
                    : "bg-slate-700 border-2 border-transparent hover:border-slate-600"
                }`}
              >
                <div className="font-medium text-white">{game.name}</div>
                <div className="text-sm text-gray-400">{game.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Create Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreate}
          disabled={!playerName.trim() || selectedMinigames.length === 0}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
        >
          Create Game Room
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CreateGameScreen;
