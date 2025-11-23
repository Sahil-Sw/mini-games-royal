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
  const [spectatingPlayerId, setSpectatingPlayerId] = useState<string | null>(
    null
  );

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

    // Check if current player is actively playing this round
    const isActivePlayer = currentRound.selectedPlayers?.includes(
      currentPlayer?.id || ""
    );
    const activePlayers =
      currentRound.selectedPlayers
        ?.map((id) => currentRoom.players.find((p) => p.id === id))
        .filter(Boolean) || [];

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

    // If player is spectating
    if (!isActivePlayer && currentRoom.mode === "team") {
      // Get current player's team
      const myTeam = currentRoom.teams.find(
        (t) => t.id === currentPlayer?.teamId
      );
      const myTeammate = activePlayers.find((p) => p?.teamId === myTeam?.id);

      // Get opponent teams' active players
      const opponents = activePlayers.filter((p) => p?.teamId !== myTeam?.id);

      // Default to spectating teammate
      const defaultSpectateId =
        spectatingPlayerId || myTeammate?.id || activePlayers[0]?.id;
      const spectatedPlayer = currentRoom.players.find(
        (p) => p.id === defaultSpectateId
      );
      const spectatedTeam = currentRoom.teams.find(
        (t) => t.id === spectatedPlayer?.teamId
      );

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 p-4">
          {/* Spectator Header */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 mb-4">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-white mb-2">
                  👁️ Spectator Mode
                </h2>
                <p className="text-gray-300">
                  Round {currentRound.roundNumber} • {gameInfo.name}
                </p>
              </div>

              {/* Active Players Selection */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-3 text-center">
                  Active Players - Click to spectate
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {activePlayers.map((player) => {
                    if (!player) return null;
                    const playerTeam = currentRoom.teams.find(
                      (t) => t.id === player.teamId
                    );
                    const isMyTeammate = player.teamId === myTeam?.id;
                    const isCurrentlySpectating =
                      defaultSpectateId === player.id;

                    return (
                      <button
                        key={player.id}
                        onClick={() => setSpectatingPlayerId(player.id)}
                        className={`p-4 rounded-xl transition-all ${
                          isCurrentlySpectating
                            ? "bg-purple-500 border-2 border-purple-300 scale-105"
                            : "bg-slate-700 hover:bg-slate-600 border-2 border-transparent"
                        }`}
                        style={
                          playerTeam
                            ? {
                                borderLeftColor: playerTeam.color,
                                borderLeftWidth: "4px",
                              }
                            : {}
                        }
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">
                            {player.avatar || "👤"}
                          </div>
                          <div className="font-bold text-white text-sm">
                            {player.name}
                          </div>
                          {playerTeam && (
                            <div
                              className="text-xs mt-1"
                              style={{ color: playerTeam.color }}
                            >
                              {playerTeam.name}
                            </div>
                          )}
                          {isMyTeammate && (
                            <div className="text-xs text-green-400 mt-1">
                              ⭐ Teammate
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Currently Spectating */}
              {spectatedPlayer && (
                <div className="text-center p-4 bg-slate-700/50 rounded-xl">
                  <p className="text-gray-300 text-sm mb-1">
                    Currently watching
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">
                      {spectatedPlayer.avatar || "👤"}
                    </span>
                    <span className="text-xl font-bold text-white">
                      {spectatedPlayer.name}
                    </span>
                    {spectatedTeam && (
                      <span
                        className="text-sm px-2 py-1 rounded"
                        style={{
                          backgroundColor: spectatedTeam.color + "40",
                          color: spectatedTeam.color,
                        }}
                      >
                        {spectatedTeam.name}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Spectator View Message */}
            <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Watching {spectatedPlayer?.name}
              </h3>
              <p className="text-gray-300 mb-4">
                You'll play in an upcoming round!
              </p>
              <div className="text-sm text-gray-400">
                In team mode, players take turns representing their team each
                round.
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Active player - show the actual minigame
    return (
      <div className="min-h-screen">
        {currentRoom.mode === "team" && (
          <div className="bg-purple-600 text-white text-center py-2 px-4">
            <p className="font-bold">
              🎮 You're playing for your team this round!
            </p>
          </div>
        )}
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
