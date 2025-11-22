import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import { useGameStore } from "../store/gameStore";
import { getMiniGameComponent } from "../minigames/registry";

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
  } = useGameStore();
  const [countdown, setCountdown] = useState<number | null>(null);

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
      setCurrentRound(round);
      setMinigameData(data);
    });

    socket.on("game:finished", () => {
      // Navigate to results
    });

    return () => {
      socket.off("game:countdown");
      socket.off("game:roundStart");
      socket.off("game:finished");
    };
  }, [socket, currentRoom, navigate]);

  if (!currentRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
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
