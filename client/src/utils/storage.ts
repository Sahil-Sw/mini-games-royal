import type { PlayerProfile, MiniGameType } from '@shared/index';

export interface SinglePlayerScore {
  gameType: MiniGameType;
  score: number;
  time: number;
  date: Date;
}

export interface SinglePlayerStats {
  gamesPlayed: number;
  totalScore: number;
  bestScores: Record<MiniGameType, SinglePlayerScore>;
  recentGames: SinglePlayerScore[];
}

const STORAGE_KEYS = {
  PLAYER_PROFILE: 'minigame_player_profile',
  PLAYER_NAME: 'minigame_player_name',
  SETTINGS: 'minigame_settings',
  SINGLE_PLAYER_STATS: 'minigame_single_player_stats',
} as const;

export const storage = {
  // Player profile
  getPlayerProfile: (): PlayerProfile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYER_PROFILE);
    return data ? JSON.parse(data) : null;
  },
  
  setPlayerProfile: (profile: PlayerProfile): void => {
    localStorage.setItem(STORAGE_KEYS.PLAYER_PROFILE, JSON.stringify(profile));
  },
  
  // Player name
  getPlayerName: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.PLAYER_NAME);
  },
  
  setPlayerName: (name: string): void => {
    localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, name);
  },
  
  // Settings
  getSettings: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      soundEnabled: true,
      musicEnabled: true,
      theme: 'dark',
    };
  },
  
  setSettings: (settings: any): void => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },
  
  // Single player stats
  getSinglePlayerStats: (): SinglePlayerStats => {
    const data = localStorage.getItem(STORAGE_KEYS.SINGLE_PLAYER_STATS);
    if (data) {
      const parsed = JSON.parse(data);
      // Convert date strings back to Date objects
      if (parsed.recentGames) {
        parsed.recentGames = parsed.recentGames.map((game: any) => ({
          ...game,
          date: new Date(game.date),
        }));
      }
      return parsed;
    }
    return {
      gamesPlayed: 0,
      totalScore: 0,
      bestScores: {} as Record<MiniGameType, SinglePlayerScore>,
      recentGames: [],
    };
  },

  saveSinglePlayerScore: (gameType: MiniGameType, score: number, time: number): void => {
    const stats = storage.getSinglePlayerStats();

    const newScore: SinglePlayerScore = {
      gameType,
      score,
      time,
      date: new Date(),
    };

    // Update games played and total score
    stats.gamesPlayed += 1;
    stats.totalScore += score;

    // Update best score for this game type
    const currentBest = stats.bestScores[gameType];
    if (!currentBest || score > currentBest.score || (score === currentBest.score && time < currentBest.time)) {
      stats.bestScores[gameType] = newScore;
    }

    // Add to recent games (keep last 10)
    stats.recentGames.unshift(newScore);
    if (stats.recentGames.length > 10) {
      stats.recentGames = stats.recentGames.slice(0, 10);
    }

    localStorage.setItem(STORAGE_KEYS.SINGLE_PLAYER_STATS, JSON.stringify(stats));
  },

  getBestScore: (gameType: MiniGameType): SinglePlayerScore | null => {
    const stats = storage.getSinglePlayerStats();
    return stats.bestScores[gameType] || null;
  },

  // Clear all
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};

