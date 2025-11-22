export interface Player {
  id: string;
  name: string;
  avatar?: string;
  teamId?: string;
  isReady: boolean;
  isHost: boolean;
  isConnected: boolean;
  platform: 'web' | 'mobile';
  stats: PlayerStats;
}

export interface PlayerStats {
  roundsWon: number;
  roundsPlayed: number;
  totalScore: number;
  fastestReaction?: number;
  bestAccuracy?: number;
  gamesPlayed: number;
  gamesWon: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  experience: number;
  totalGamesPlayed: number;
  totalGamesWon: number;
  totalRoundsWon: number;
  achievements: string[];
  createdAt: Date;
  lastPlayed: Date;
}

export interface PlayerResult {
  playerId: string;
  score: number;
  time?: number;
  accuracy?: number;
  data?: Record<string, any>;
}

