import type { MiniGameType } from '@shared/index';
import SpeedMath from './SpeedMath/SpeedMath';
import ReactionDash from './ReactionDash/ReactionDash';
import ColorCode from './ColorCode/ColorCode';
import MemoryFlash from './MemoryFlash/MemoryFlash';
import WordSprint from './WordSprint/WordSprint';

export interface MiniGameComponent {
  component: React.ComponentType<any>;
  name: string;
  description: string;
}

export const MINIGAME_REGISTRY: Record<MiniGameType, MiniGameComponent> = {
  'speed-math': {
    component: SpeedMath,
    name: 'Speed Math Royale',
    description: 'Solve math problems as fast as you can!',
  },
  'reaction-dash': {
    component: ReactionDash,
    name: 'Reaction Dash',
    description: 'Tap when the color changes!',
  },
  'color-code': {
    component: ColorCode,
    name: 'Color Code Breaker',
    description: 'Crack the color code puzzle!',
  },
  'memory-flash': {
    component: MemoryFlash,
    name: 'Memory Flash',
    description: 'Remember the sequence!',
  },
  'word-sprint': {
    component: WordSprint,
    name: 'Word Sprint',
    description: 'Type the word as fast as possible!',
  },
};

export const getMiniGameComponent = (gameType: MiniGameType) => {
  return MINIGAME_REGISTRY[gameType];
};

