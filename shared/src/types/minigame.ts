import { PlayerResult } from './player';

export type MiniGameType = 
  | 'speed-math'
  | 'reaction-dash'
  | 'color-code'
  | 'memory-flash'
  | 'word-sprint';

export type MiniGameMode = 'solo' | 'team' | 'both';

export interface MiniGameConfig {
  id: MiniGameType;
  name: string;
  description: string;
  duration: number; // seconds
  mode: MiniGameMode;
  icon?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface MiniGameState {
  gameType: MiniGameType;
  startTime: number;
  endTime: number;
  isActive: boolean;
  results: PlayerResult[];
}

// Specific minigame data structures
export interface SpeedMathQuestion {
  question: string;
  answer: number;
  operators: string[];
}

export interface ReactionDashState {
  color: string;
  changeTime: number;
}

export interface ColorCodePuzzle {
  code: string[];
  hints: string[];
  solution: string[];
}

export interface MemoryFlashSequence {
  sequence: string[];
  displayDuration: number;
}

export interface WordSprintChallenge {
  word: string;
  scrambled?: string;
}

// Socket events for minigames
export interface MiniGameStartEvent {
  gameType: MiniGameType;
  config: MiniGameConfig;
  data?: any;
}

export interface MiniGameSubmitEvent {
  playerId: string;
  gameType: MiniGameType;
  answer: any;
  timestamp: number;
}

export interface MiniGameResultEvent {
  playerId: string;
  score: number;
  time: number;
  isCorrect: boolean;
  data?: Record<string, any>;
}

