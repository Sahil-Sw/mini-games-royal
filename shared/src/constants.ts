import { MiniGameConfig } from './types/minigame';

export const GAME_CONSTANTS = {
  MAX_PLAYERS: 10,
  MIN_PLAYERS: 2,
  MAX_TEAMS: 4,
  MIN_TEAMS: 2,
  DEFAULT_ROUNDS: 10,
  MAX_ROUNDS: 20,
  MIN_ROUNDS: 3,
  ROOM_CODE_LENGTH: 6,
  COUNTDOWN_DURATION: 3, // seconds
  ROUND_TRANSITION_DURATION: 5, // seconds
} as const;

export const TEAM_COLORS = [
  { id: 'red', name: 'Red Team', color: '#EF4444' },
  { id: 'blue', name: 'Blue Team', color: '#3B82F6' },
  { id: 'green', name: 'Green Team', color: '#10B981' },
  { id: 'yellow', name: 'Yellow Team', color: '#F59E0B' },
] as const;

export const MINIGAME_CONFIGS: Record<string, MiniGameConfig> = {
  'speed-math': {
    id: 'speed-math',
    name: 'Speed Math Royale',
    description: 'Solve math problems as fast as you can!',
    duration: 30,
    mode: 'both',
    difficulty: 'medium',
  },
  'reaction-dash': {
    id: 'reaction-dash',
    name: 'Reaction Dash',
    description: 'Tap when the color changes!',
    duration: 20,
    mode: 'both',
    difficulty: 'easy',
  },
  'color-code': {
    id: 'color-code',
    name: 'Color Code Breaker',
    description: 'Crack the color code puzzle!',
    duration: 45,
    mode: 'both',
    difficulty: 'hard',
  },
  'memory-flash': {
    id: 'memory-flash',
    name: 'Memory Flash',
    description: 'Remember the sequence!',
    duration: 30,
    mode: 'both',
    difficulty: 'medium',
  },
  'word-sprint': {
    id: 'word-sprint',
    name: 'Word Sprint',
    description: 'Type the word as fast as possible!',
    duration: 25,
    mode: 'both',
    difficulty: 'easy',
  },
} as const;

export const AVATARS = [
  '🦊', '🐼', '🦁', '🐯', '🐸', '🐙', '🦄', '🐲',
  '🤖', '👾', '🎮', '🎯', '⚡', '🔥', '💎', '⭐',
] as const;

