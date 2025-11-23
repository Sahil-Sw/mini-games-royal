import { Server, Socket } from 'socket.io';
import { nanoid } from 'nanoid';
import type { ClientToServerEvents, ServerToClientEvents, SocketData, Player } from '@minigame/shared';
import { AVATARS, GAME_CONSTANTS, MINIGAME_CONFIGS } from '@minigame/shared';
import { RoomManager } from '../game/RoomManager.js';
import { GameEngine } from '../game/GameEngine.js';

const roomManager = new RoomManager();
const gameEngine = new GameEngine();

type SocketType = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;
type ServerType = Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;

export function setupSocketHandlers(io: ServerType) {
  io.on('connection', (socket: SocketType) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Create room
    socket.on('room:create', (config, playerName, callback) => {
      try {
        const playerId = nanoid();
        const player: Player = {
          id: playerId,
          name: playerName,
          avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
          isReady: true, // Host is always ready
          isHost: true,
          isConnected: true,
          platform: 'web',
          stats: {
            roundsWon: 0,
            roundsPlayed: 0,
            totalScore: 0,
            gamesPlayed: 0,
            gamesWon: 0,
          },
        };

        const room = roomManager.createRoom(config, player);
        
        // Store socket data
        socket.data.playerId = playerId;
        socket.data.roomId = room.id;
        socket.data.playerName = playerName;

        // Join socket room
        socket.join(room.id);

        callback({ success: true, room, playerId });
      } catch (error: any) {
        console.error('Error creating room:', error);
        callback({ success: false, error: error.message });
      }
    });

    // Join room
    socket.on('room:join', (code, playerName, platform, callback) => {
      try {
        const room = roomManager.getRoomByCode(code);
        if (!room) {
          callback({ success: false, error: 'Room not found' });
          return;
        }

        const playerId = nanoid();
        const player: Player = {
          id: playerId,
          name: playerName,
          avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
          isReady: false,
          isHost: false,
          isConnected: true,
          platform,
          stats: {
            roundsWon: 0,
            roundsPlayed: 0,
            totalScore: 0,
            gamesPlayed: 0,
            gamesWon: 0,
          },
        };

        const updatedRoom = roomManager.addPlayerToRoom(code, player);
        if (!updatedRoom) {
          callback({ success: false, error: 'Failed to join room' });
          return;
        }

        // Store socket data
        socket.data.playerId = playerId;
        socket.data.roomId = updatedRoom.id;
        socket.data.playerName = playerName;

        // Join socket room
        socket.join(updatedRoom.id);

        // Notify all players in room
        io.to(updatedRoom.id).emit('room:updated', updatedRoom);
        io.to(updatedRoom.id).emit('room:playerJoined', player);

        callback({ success: true, room: updatedRoom, playerId });
      } catch (error: any) {
        console.error('Error joining room:', error);
        callback({ success: false, error: error.message });
      }
    });

    // Leave room
    socket.on('room:leave', () => {
      handlePlayerLeave(socket, io);
    });

    // Player ready toggle
    socket.on('lobby:ready', (isReady) => {
      const { playerId, roomId } = socket.data;
      if (!playerId || !roomId) return;

      const room = roomManager.updatePlayerReady(roomId, playerId, isReady);
      if (room) {
        io.to(roomId).emit('room:updated', room);
      }
    });

    // Change team
    socket.on('lobby:changeTeam', (teamId) => {
      const { playerId, roomId } = socket.data;
      if (!playerId || !roomId) return;

      const room = roomManager.changePlayerTeam(roomId, playerId, teamId);
      if (room) {
        io.to(roomId).emit('room:updated', room);
      }
    });

    // Start game
    socket.on('lobby:startGame', async () => {
      const { playerId, roomId } = socket.data;
      if (!playerId || !roomId) return;

      const room = roomManager.getRoomById(roomId);
      if (!room || room.hostId !== playerId) {
        socket.emit('error', 'Only host can start the game');
        return;
      }

      try {
        await gameEngine.startGame(room);
        io.to(roomId).emit('game:stateChanged', 'countdown');

        // Start countdown
        startCountdown(io, room);
      } catch (error: any) {
        socket.emit('error', error.message);
      }
    });

    // Minigame submit
    socket.on('minigame:submit', (data) => {
      const { roomId } = socket.data;
      if (!roomId) return;

      const room = roomManager.getRoomById(roomId);
      if (!room || room.state !== 'playing') return;

      const currentRound = room.rounds[room.rounds.length - 1];
      if (!currentRound) return;

      // Add result to round
      const result = {
        playerId: data.playerId,
        score: data.answer.score,
        time: data.answer.time,
      };
      currentRound.results.push(result);

      console.log(`📊 Player ${data.playerId} submitted score: ${result.score}`);

      // Check if all players have submitted
      if (currentRound.results.length === room.players.length) {
        endRound(io, room, currentRound);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      handlePlayerLeave(socket, io);
    });
  });
}

function handlePlayerLeave(socket: SocketType, io: ServerType) {
  const { playerId, roomId } = socket.data;
  if (!playerId || !roomId) return;

  const room = roomManager.removePlayerFromRoom(roomId, playerId);
  if (room) {
    io.to(roomId).emit('room:updated', room);
    io.to(roomId).emit('room:playerLeft', playerId);
  }
}

async function startCountdown(io: ServerType, room: any) {
  for (let i = GAME_CONSTANTS.COUNTDOWN_DURATION; i > 0; i--) {
    io.to(room.id).emit('game:countdown', i);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Start first round
  startRound(io, room);
}

function startRound(io: ServerType, room: any) {
  room.currentRound++;
  const round = gameEngine.createRound(room);
  room.rounds.push(round);
  room.state = 'playing';

  // Get minigame config
  const config = MINIGAME_CONFIGS[round.minigame];
  const minigameData = {
    gameType: round.minigame,
    config: config,
  };

  console.log(`🎮 Starting round ${room.currentRound} - ${round.minigame}`);
  io.to(room.id).emit('game:roundStart', round, minigameData);

  // Auto-end round after duration + buffer
  setTimeout(() => {
    if (room.state === 'playing') {
      const currentRound = room.rounds[room.rounds.length - 1];
      if (currentRound && currentRound.results.length < room.players.length) {
        console.log(`⏰ Round ${room.currentRound} timed out, ending with ${currentRound.results.length}/${room.players.length} results`);
        endRound(io, room, currentRound);
      }
    }
  }, (config.duration + 2) * 1000);
}

function endRound(io: ServerType, room: any, round: any) {
  room.state = 'roundResult';
  round.endTime = new Date();

  // Determine winner
  const { winnerId, winnerTeamId } = gameEngine.determineWinner(round.results, room);
  round.winnerId = winnerId;
  round.winnerTeamId = winnerTeamId;

  // Update scores
  gameEngine.updateScores(room, winnerId, winnerTeamId);

  console.log(`🏆 Round ${room.currentRound} winner: ${winnerId}`);

  // Emit round end
  io.to(room.id).emit('game:roundEnd', round.results, winnerId, winnerTeamId);
  io.to(room.id).emit('room:updated', room);

  // Check if game is finished
  if (gameEngine.isGameFinished(room)) {
    setTimeout(() => {
      finishGame(io, room);
    }, 5000);
  } else {
    // Start next round after delay
    setTimeout(() => {
      startCountdown(io, room);
    }, 5000);
  }
}

function finishGame(io: ServerType, room: any) {
  room.state = 'finished';
  const finalResults = gameEngine.getFinalResults(room);

  console.log(`🎉 Game finished in room ${room.code}`);
  io.to(room.id).emit('game:finished', finalResults);
  io.to(room.id).emit('room:updated', room);
}

