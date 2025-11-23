import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useSocket } from "../contexts/SocketContext";
import { useGameStore } from "../store/gameStore";
import { getMiniGameComponent } from "../minigames/registry";
import type { PlayerResult } from "@shared/index";

const GameScreen = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const {
    currentRoom,
    currentPlayer,
    currentRound,
    minigameData,
    setCurrentRound,
    setMinigameData,
    setCurrentRoom,
  } = useGameStore();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [roundResults, setRoundResults] = useState<{
    results: PlayerResult[];
    winnerId: string;
    winnerTeamId?: string;
  } | null>(null);
  const [gameFinished, setGameFinished] = useState<any>(null);

  useEffect(() => {
    if (!socket || !currentRoom) {
      navigate("/");
      return;
    }

    socket.on("game:countdown", (count) => {
      setCountdown(count);
    });

    socket.on("game:roundStart", (round, data) => {
      setCountdown(null);
      setRoundResults(null);
      setCurrentRound(round);
      setMinigameData(data);
    });

    socket.on("game:roundEnd", (results, winnerId, winnerTeamId) => {
      setRoundResults({ results, winnerId, winnerTeamId });
      setCurrentRound(null);
      setMinigameData(null);
    });

    socket.on("game:finished", (finalResults) => {
      setGameFinished(finalResults);
      setRoundResults(null);
    });

    socket.on("room:updated", (room) => {
      setCurrentRoom(room);
    });

    return () => {
      socket.off("game:countdown");
      socket.off("game:roundStart");
      socket.off("game:roundEnd");
      socket.off("game:finished");
      socket.off("room:updated");
    };
  }, [socket, currentRoom, navigate]);

  if (!currentRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // Show game finished
  if (gameFinished) {
    const winner = currentRoom?.players.find(
      (p) => p.id === gameFinished.winnerId
    );
    const winnerTeam = currentRoom?.teams.find(
      (t) => t.id === gameFinished.winnerTeamId
    );

    // Sort players by total score
    const finalStandings = currentRoom?.players
      ? [...currentRoom.players].sort((a, b) => {
          if (b.stats.totalScore !== a.stats.totalScore) {
            return b.stats.totalScore - a.stats.totalScore;
          }
          return b.stats.roundsWon - a.stats.roundsWon;
        })
      : [];

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-yellow-900 to-purple-900">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-3xl w-full"
        >
          <div className="text-center mb-8">
            <div className="text-8xl mb-8">🏆</div>
            <h1 className="text-6xl font-bold text-yellow-400 mb-4">
              Game Over!
            </h1>
            {winnerTeam ? (
              <p className="text-4xl text-white mb-8">
                {winnerTeam.name} Team Wins!
              </p>
            ) : (
              <p className="text-4xl text-white mb-8">{winner?.name} Wins!</p>
            )}
          </div>

          {/* Team Final Standings (if team mode) */}
          {currentRoom?.mode === "team" && currentRoom.teams.length > 0 && (
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                Team Final Standings
              </h2>
              <div className="space-y-3">
                {[...currentRoom.teams]
                  .sort((a, b) => b.score - a.score)
                  .map((team, index) => (
                    <div
                      key={team.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        index === 0
                          ? "bg-yellow-500/30 border-2 border-yellow-500"
                          : index === 1
                          ? "bg-gray-400/20 border-2 border-gray-400"
                          : index === 2
                          ? "bg-orange-600/20 border-2 border-orange-600"
                          : "bg-slate-700/50"
                      }`}
                      style={{ borderLeft: `4px solid ${team.color}` }}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-white">
                          {index === 0
                            ? "🥇"
                            : index === 1
                            ? "🥈"
                            : index === 2
                            ? "🥉"
                            : `#${index + 1}`}
                        </span>
                        <span
                          className="text-2xl font-bold"
                          style={{ color: team.color }}
                        >
                          {team.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-yellow-400">
                          {team.score} rounds won
                        </div>
                        <div className="text-sm text-gray-400">
                          {team.playerIds.length} players
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Final Standings (Individual) */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentRoom?.mode === "team"
                ? "Individual Final Scores"
                : "Final Standings"}
            </h2>
            <div className="space-y-3">
              {finalStandings.map((player, index) => {
                const playerTeam = currentRoom?.teams.find(
                  (t) => t.id === player.teamId
                );
                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index === 0 && currentRoom?.mode !== "team"
                        ? "bg-yellow-500/30 border-2 border-yellow-500"
                        : index === 1 && currentRoom?.mode !== "team"
                        ? "bg-gray-400/20 border-2 border-gray-400"
                        : index === 2 && currentRoom?.mode !== "team"
                        ? "bg-orange-600/20 border-2 border-orange-600"
                        : "bg-slate-700/50"
                    }`}
                    style={
                      playerTeam
                        ? { borderLeft: `4px solid ${playerTeam.color}` }
                        : {}
                    }
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-white">
                        {index === 0 && currentRoom?.mode !== "team"
                          ? "🥇"
                          : index === 1 && currentRoom?.mode !== "team"
                          ? "🥈"
                          : index === 2 && currentRoom?.mode !== "team"
                          ? "🥉"
                          : `#${index + 1}`}
                      </span>
                      <div>
                        <span className="text-2xl text-white font-bold">
                          {player.name}
                        </span>
                        {playerTeam && (
                          <span
                            className="ml-2 text-sm"
                            style={{ color: playerTeam.color }}
                          >
                            ({playerTeam.name})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-yellow-400">
                        {player.stats.totalScore} pts
                      </div>
                      <div className="text-sm text-gray-400">
                        {player.stats.roundsWon} wins •{" "}
                        {player.stats.roundsPlayed} rounds
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-4 text-2xl font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-2xl transition-all"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show round results
  if (roundResults) {
    const winner = currentRoom?.players.find(
      (p) => p.id === roundResults.winnerId
    );
    const sortedResults = [...roundResults.results].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (a.time || Infinity) - (b.time || Infinity);
    });

    // Sort players by total score for overall standings
    const overallStandings = currentRoom?.players
      ? [...currentRoom.players].sort((a, b) => {
          if (b.stats.totalScore !== a.stats.totalScore) {
            return b.stats.totalScore - a.stats.totalScore;
          }
          return b.stats.roundsWon - a.stats.roundsWon;
        })
      : [];

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-purple-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-3xl w-full"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-yellow-400 mb-2">
              Round {currentRoom?.currentRound} Complete!
            </h2>
            <p className="text-2xl text-white">Winner: {winner?.name}</p>
          </div>

          {/* Round Results */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-3 text-center">
              This Round
            </h3>
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 space-y-3">
              {sortedResults.map((result, index) => {
                const player = currentRoom?.players.find(
                  (p) => p.id === result.playerId
                );
                return (
                  <div
                    key={result.playerId}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index === 0
                        ? "bg-yellow-500/20 border-2 border-yellow-500"
                        : "bg-slate-700/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-white">
                        #{index + 1}
                      </span>
                      <span className="text-xl text-white">{player?.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-400">
                        {result.score} pts
                      </div>
                      {result.time && (
                        <div className="text-sm text-gray-400">
                          {result.time.toFixed(1)}s
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Standings (if team mode) */}
          {currentRoom?.mode === "team" && currentRoom.teams.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3 text-center">
                Team Standings
              </h3>
              <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 space-y-3">
                {[...currentRoom.teams]
                  .sort((a, b) => b.score - a.score)
                  .map((team, index) => (
                    <div
                      key={team.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        index === 0
                          ? "bg-green-500/20 border-2 border-green-500"
                          : "bg-slate-700/50"
                      }`}
                      style={{ borderLeft: `4px solid ${team.color}` }}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-white">
                          #{index + 1}
                        </span>
                        <span
                          className="text-xl font-bold"
                          style={{ color: team.color }}
                        >
                          {team.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">
                          {team.score} rounds won
                        </div>
                        <div className="text-sm text-gray-400">
                          {team.playerIds.length} players
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Overall Standings (Individual) */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-3 text-center">
              {currentRoom?.mode === "team"
                ? "Individual Scores"
                : "Overall Standings"}
            </h3>
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 space-y-3">
              {overallStandings.map((player, index) => {
                const playerTeam = currentRoom?.teams.find(
                  (t) => t.id === player.teamId
                );
                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index === 0 && currentRoom?.mode !== "team"
                        ? "bg-green-500/20 border-2 border-green-500"
                        : "bg-slate-700/50"
                    }`}
                    style={
                      playerTeam
                        ? { borderLeft: `4px solid ${playerTeam.color}` }
                        : {}
                    }
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-white">
                        #{index + 1}
                      </span>
                      <div>
                        <span className="text-xl text-white">
                          {player.name}
                        </span>
                        {playerTeam && (
                          <span
                            className="ml-2 text-sm"
                            style={{ color: playerTeam.color }}
                          >
                            ({playerTeam.name})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">
                        {player.stats.totalScore} pts
                      </div>
                      <div className="text-sm text-gray-400">
                        {player.stats.roundsWon} wins
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-8 text-gray-400">
            Next round starting soon...
          </div>
        </motion.div>
      </div>
    );
  }

  // Show countdown
  if (countdown !== null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-9xl font-bold text-white animate-pulse">
          {countdown}
        </div>
      </div>
    );
  }

  // Show minigame
  if (currentRound && minigameData) {
    const gameInfo = getMiniGameComponent(currentRound.minigame);
    if (!gameInfo) {
      return (
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Error</h1>
            <p className="text-gray-400">
              Minigame not found: {currentRound.minigame}
            </p>
          </div>
        </div>
      );
    }

    const MiniGameComponent = gameInfo.component;

    const handleComplete = (score: number, time: number) => {
      // Submit score to server
      if (!currentPlayer) return;

      socket?.emit("minigame:submit", {
        playerId: currentPlayer.id,
        gameType: currentRound.minigame,
        answer: { score, time },
        timestamp: Date.now(),
      });
    };

    return (
      <div className="min-h-screen">
        <MiniGameComponent
          duration={minigameData.config.duration}
          onComplete={handleComplete}
        />
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Game Screen</h1>
        <p className="text-gray-400">Waiting for round to start...</p>
      </div>
    </div>
  );
};

export default GameScreen;
