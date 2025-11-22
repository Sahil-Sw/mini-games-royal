import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useGameStore } from '../store/gameStore';

const GameScreen = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { currentRoom, currentRound, minigameData } = useGameStore();
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (!socket || !currentRoom) {
      navigate('/');
      return;
    }

    socket.on('game:countdown', (count) => {
      setCountdown(count);
    });

    socket.on('game:roundStart', (round, data) => {
      setCountdown(null);
      // Handle round start
    });

    socket.on('game:finished', () => {
      // Navigate to results
    });

    return () => {
      socket.off('game:countdown');
      socket.off('game:roundStart');
      socket.off('game:finished');
    };
  }, [socket, currentRoom, navigate]);

  if (!currentRoom) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        {countdown !== null ? (
          <div className="text-9xl font-bold text-white animate-pulse">
            {countdown}
          </div>
        ) : (
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">Game Screen</h1>
            <p className="text-gray-400">Minigame will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;

