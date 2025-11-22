import { nanoid } from 'nanoid';
import type { GameRoom, GameConfig, Player, Team } from '@shared/index';
import { GAME_CONSTANTS, TEAM_COLORS } from '@shared/index';

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

    if (room.state !== 'lobby') {
      throw new Error('Game already started');
    }

    room.players.push(player);

    // Auto-assign to team if team mode
    if (room.mode === 'team' && room.teams.length > 0) {
      const smallestTeam = room.teams.reduce((prev, curr) =>
        prev.playerIds.length < curr.playerIds.length ? prev : curr
      );
      smallestTeam.playerIds.push(player.id);
      player.teamId = smallestTeam.id;
    }

    console.log(`✅ Player ${player.name} joined room ${roomCode}`);
    return room;
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

  getAllRooms(): GameRoom[] {
    return Array.from(this.rooms.values());
  }
}

