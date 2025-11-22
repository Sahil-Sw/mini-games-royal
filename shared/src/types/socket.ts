import { GameRoom, GameConfig, RoundData } from './game.js';
import { Player, PlayerResult } from './player.js';
import { MiniGameType, MiniGameStartEvent, MiniGameSubmitEvent } from './minigame.js';

// Client to Server events
export interface ClientToServerEvents {
  // Room management
  'room:create': (config: GameConfig, playerName: string, callback: (response: { success: boolean; room?: GameRoom; playerId?: string; error?: string }) => void) => void;
  'room:join': (code: string, playerName: string, platform: 'web' | 'mobile', callback: (response: { success: boolean; room?: GameRoom; playerId?: string; error?: string }) => void) => void;
  'room:leave': () => void;
  
  // Lobby
  'lobby:ready': (isReady: boolean) => void;
  'lobby:changeTeam': (teamId: string) => void;
  'lobby:startGame': () => void;
  
  // Game flow
  'game:playerReady': () => void;
  'game:nextRound': () => void;
  
  // Minigame
  'minigame:submit': (data: MiniGameSubmitEvent) => void;
  
  // Chat (future)
  'chat:message': (message: string) => void;
}

// Server to Client events
export interface ServerToClientEvents {
  // Room updates
  'room:updated': (room: GameRoom) => void;
  'room:playerJoined': (player: Player) => void;
  'room:playerLeft': (playerId: string) => void;
  'room:error': (error: string) => void;
  
  // Game state
  'game:stateChanged': (state: GameRoom['state']) => void;
  'game:countdown': (count: number) => void;
  'game:roundStart': (round: RoundData, minigameData: MiniGameStartEvent) => void;
  'game:roundEnd': (results: PlayerResult[], winnerId: string, winnerTeamId?: string) => void;
  'game:finished': (finalResults: any) => void;
  
  // Minigame events
  'minigame:update': (data: any) => void;
  
  // Player updates
  'player:updated': (player: Player) => void;
  
  // Chat
  'chat:message': (playerId: string, message: string) => void;
  
  // Errors
  'error': (message: string) => void;
}

// Socket data stored on connection
export interface SocketData {
  playerId: string;
  roomId: string;
  playerName: string;
}

