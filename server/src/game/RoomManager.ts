import { nanoid } from 'nanoid';
import type { GameRoom, GameConfig, Player, Team } from '@minigame/shared';
import { GAME_CONSTANTS, TEAM_COLORS } from '@minigame/shared';

export class RoomManager {
  private rooms: Map<string, GameRoom> = new Map();
  private roomCodeToId: Map<string, string> = new Map();

  generateRoomCode(): string {
    let code: string;
    do {
      code = nanoid(GAME_CONSTANTS.ROOM_CODE_LENGTH).toUpperCase();
    } while (this.roomCodeToId.has(code));
    return code;
  }

  createRoom(config: GameConfig, hostPlayer: Player): GameRoom {
    const roomId = nanoid();
    const code = this.generateRoomCode();

    const teams: Team[] = [];
    if (config.mode === 'team') {
      for (let i = 0; i < config.numberOfTeams; i++) {
        teams.push({
          id: nanoid(),
          name: TEAM_COLORS[i].name,
          color: TEAM_COLORS[i].color,
          score: 0,
          playerIds: [],
        });
      }
    }

    const room: GameRoom = {
      id: roomId,
      code,
      hostId: hostPlayer.id,
      mode: config.mode,
      state: 'lobby',
      config,
      players: [hostPlayer],
      teams,
      currentRound: 0,
      rounds: [],
      createdAt: new Date(),
    };

    // Assign host to a team in team mode
    if (config.mode === 'team' && teams.length > 0) {
      if (config.teamAssignment === 'random') {
        // Assign host to first team
        teams[0].playerIds.push(hostPlayer.id);
        hostPlayer.teamId = teams[0].id;
        console.log(`👑 Host assigned to ${teams[0].name}`);
      }
      // For manual mode, host starts unassigned like other players
    }

    this.rooms.set(roomId, room);
    this.roomCodeToId.set(code, roomId);

    console.log(`✅ Room created: ${code} (${roomId})`);
    return room;
  }

  getRoomByCode(code: string): GameRoom | null {
    const roomId = this.roomCodeToId.get(code);
    return roomId ? this.rooms.get(roomId) || null : null;
  }

  getRoomById(id: string): GameRoom | null {
    return this.rooms.get(id) || null;
  }

  addPlayerToRoom(roomCode: string, player: Player): GameRoom | null {
    const room = this.getRoomByCode(roomCode);
    if (!room) return null;

    if (room.players.length >= room.config.maxPlayers) {
      throw new Error('Room is full');
    }

    if (room.state !== 'lobby' && room.state !== 'finished') {
      throw new Error('Game already in progress');
    }

    // If room is finished, reset it to lobby for a new game
    if (room.state === 'finished') {
      this.resetRoom(room);
    }

    room.players.push(player);

    // Auto-assign to team if team mode and random assignment
    if (room.mode === 'team' && room.teams.length > 0 && room.config.teamAssignment === 'random') {
      const smallestTeam = room.teams.reduce((prev, curr) =>
        prev.playerIds.length < curr.playerIds.length ? prev : curr
      );
      smallestTeam.playerIds.push(player.id);
      player.teamId = smallestTeam.id;
    }
    // For manual assignment, players start without a team

    console.log(`✅ Player ${player.name} joined room ${roomCode}`);
    return room;
  }

  resetRoom(room: GameRoom): void {
    room.state = 'lobby';
    room.currentRound = 0;
    room.rounds = [];

    // Reset player stats
    room.players.forEach(player => {
      player.isReady = player.isHost; // Host is auto-ready
      player.stats = {
        roundsWon: 0,
        roundsPlayed: 0,
        totalScore: 0,
        gamesPlayed: player.stats.gamesPlayed + 1,
        gamesWon: player.stats.gamesWon,
      };
    });

    // Reset team scores
    if (room.mode === 'team') {
      room.teams.forEach(team => {
        team.score = 0;
      });
    }

    console.log(`🔄 Room ${room.code} reset to lobby`);
  }

  removePlayerFromRoom(roomId: string, playerId: string): GameRoom | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.players = room.players.filter(p => p.id !== playerId);

    // Remove from team
    if (room.mode === 'team') {
      room.teams.forEach(team => {
        team.playerIds = team.playerIds.filter(id => id !== playerId);
      });
    }

    // If host left, assign new host
    if (room.hostId === playerId && room.players.length > 0) {
      room.hostId = room.players[0].id;
      room.players[0].isHost = true;
      console.log(`👑 New host: ${room.players[0].name}`);
    }

    // Delete room if empty
    if (room.players.length === 0) {
      this.deleteRoom(roomId);
      return null;
    }

    console.log(`❌ Player removed from room ${room.code}`);
    return room;
  }

  deleteRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      this.roomCodeToId.delete(room.code);
      this.rooms.delete(roomId);
      console.log(`🗑️ Room deleted: ${room.code}`);
    }
  }

  updatePlayerReady(roomId: string, playerId: string, isReady: boolean): GameRoom | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const player = room.players.find(p => p.id === playerId);
    if (player) {
      player.isReady = isReady;
    }

    return room;
  }

  changePlayerTeam(roomId: string, playerId: string, teamId: string): GameRoom | null {
    const room = this.rooms.get(roomId);
    if (!room || room.mode !== 'team') return null;

    const player = room.players.find(p => p.id === playerId);
    if (!player) return null;

    // Remove from old team
    room.teams.forEach(team => {
      team.playerIds = team.playerIds.filter(id => id !== playerId);
    });

    // Add to new team
    const newTeam = room.teams.find(t => t.id === teamId);
    if (newTeam) {
      newTeam.playerIds.push(playerId);
      player.teamId = teamId;
    }

    return room;
  }

  assignPlayerToTeam(roomId: string, playerId: string, teamId: string): GameRoom | null {
    // Same as changePlayerTeam but can be called by host
    return this.changePlayerTeam(roomId, playerId, teamId);
  }

  randomizeTeams(roomId: string): GameRoom | null {
    const room = this.rooms.get(roomId);
    if (!room || room.mode !== 'team') return null;

    // Clear all team assignments
    room.teams.forEach(team => {
      team.playerIds = [];
    });
    room.players.forEach(player => {
      player.teamId = undefined;
    });

    // Shuffle players
    const shuffledPlayers = [...room.players].sort(() => Math.random() - 0.5);

    // Distribute players evenly across teams
    shuffledPlayers.forEach((player, index) => {
      const teamIndex = index % room.teams.length;
      const team = room.teams[teamIndex];
      team.playerIds.push(player.id);
      player.teamId = team.id;
    });

    console.log(`🎲 Teams randomized in room ${room.code}`);
    return room;
  }

  getAllRooms(): GameRoom[] {
    return Array.from(this.rooms.values());
  }
}

