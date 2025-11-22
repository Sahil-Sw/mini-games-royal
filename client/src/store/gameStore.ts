import { create } from 'zustand';
import type { GameRoom, Player, RoundData, PlayerProfile } from '@shared/index';

interface GameState {
  // Current player
  currentPlayer: Player | null;
  playerProfile: PlayerProfile | null;
  
  // Current room
  currentRoom: GameRoom | null;
  
  // Current round data
  currentRound: RoundData | null;
  minigameData: any | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentPlayer: (player: Player | null) => void;
  setPlayerProfile: (profile: PlayerProfile | null) => void;
  setCurrentRoom: (room: GameRoom | null) => void;
  setCurrentRound: (round: RoundData | null) => void;
  setMinigameData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentPlayer: null,
  playerProfile: null,
  currentRoom: null,
  currentRound: null,
  minigameData: null,
  isLoading: false,
  error: null,
  
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  setPlayerProfile: (profile) => set({ playerProfile: profile }),
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setCurrentRound: (round) => set({ currentRound: round }),
  setMinigameData: (data) => set({ minigameData: data }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set({
    currentPlayer: null,
    currentRoom: null,
    currentRound: null,
    minigameData: null,
    isLoading: false,
    error: null,
  }),
}));

