import { Player, PlayerResult } from './player.js';
import { MiniGameType } from './minigame.js';

export type GameMode = 'team' | 'ffa' | 'single';
export type GameState = 'lobby' | 'countdown' | 'playing' | 'roundResult' | 'finished';

export interface GameRoom {
  id: string;
  code: string;
  hostId: string;
  mode: GameMode;
  state: GameState;
  config: GameConfig;
  players: Player[];
  teams: Team[];
  currentRound: number;
  rounds: RoundData[];
  createdAt: Date;
}

export interface GameConfig {
  mode: GameMode;
  maxPlayers: number;
  numberOfTeams: number;
  numberOfRounds: number;
  targetScore?: number;
  enabledMinigames: MiniGameType[];
  roundDuration: number; // seconds
}

export interface Team {
  id: string;
  name: string;
  color: string;
  score: number;
  playerIds: string[];
}

export interface RoundData {
  roundNumber: number;
  minigame: MiniGameType;
  selectedPlayers: string[]; // In team mode, one per team
  results: PlayerResult[];
  winnerId?: string;
  winnerTeamId?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface GameResult {
  roomId: string;
  mode: GameMode;
  winnerTeamId?: string;
  winnerId?: string;
  finalScores: {
    teams?: { teamId: string; score: number }[];
    players?: { playerId: string; score: number }[];
  };
  rounds: RoundData[];
  duration: number; // seconds
  playedAt: Date;
}

