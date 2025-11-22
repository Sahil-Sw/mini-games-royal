# 🎮 How to Add New Minigames

This guide shows you how to add new minigames to the platform. The plugin-based architecture makes it easy!

## 📋 Quick Checklist

- [ ] Create minigame component
- [ ] Add type definition
- [ ] Add configuration
- [ ] Register in registry
- [ ] Test in game

## 🔧 Step-by-Step Guide

### Step 1: Create the Minigame Component

Create a new folder in `client/src/minigames/YourGameName/`:

```tsx
// client/src/minigames/YourGameName/YourGameName.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface YourGameNameProps {
  duration: number; // Time limit in seconds
  onComplete: (score: number, time: number) => void; // Called when game ends
}

const YourGameName: React.FC<YourGameNameProps> = ({ duration, onComplete }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // Start timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete(score, duration); // Report final score
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Timer */}
      <div className="absolute top-8 right-8 text-4xl font-bold text-white">
        {timeLeft}s
      </div>

      {/* Score */}
      <div className="absolute top-8 left-8 text-4xl font-bold text-yellow-400">
        Score: {score}
      </div>

      {/* Your game UI here */}
      <div className="text-white text-4xl">
        Your Game Content
      </div>
    </div>
  );
};

export default YourGameName;
```

### Step 2: Add Type Definition

Add your game type to `shared/src/types/minigame.ts`:

```typescript
export type MiniGameType = 
  | 'speed-math'
  | 'reaction-dash'
  | 'color-code'
  | 'memory-flash'
  | 'word-sprint'
  | 'your-game-name'; // Add this line
```

### Step 3: Add Configuration

Add game config to `shared/src/constants.ts`:

```typescript
export const MINIGAME_CONFIGS: Record<string, MiniGameConfig> = {
  // ... existing games ...
  
  'your-game-name': {
    id: 'your-game-name',
    name: 'Your Game Display Name',
    description: 'Short description of your game',
    duration: 30, // seconds
    mode: 'both', // 'solo' | 'team' | 'both'
    difficulty: 'medium', // 'easy' | 'medium' | 'hard'
  },
};
```

### Step 4: Register in Registry

Add to `client/src/minigames/registry.ts`:

```typescript
import YourGameName from './YourGameName/YourGameName';

export const MINIGAME_REGISTRY: Record<MiniGameType, MiniGameComponent> = {
  // ... existing games ...
  
  'your-game-name': {
    component: YourGameName,
    name: 'Your Game Display Name',
    description: 'Short description of your game',
  },
};
```

### Step 5: Rebuild Shared Package

```bash
cd shared
npm run build
cd ..
```

### Step 6: Test Your Game

1. Start the server and client
2. Create a game
3. Select your new minigame
4. Play and test!

## 🎨 Design Guidelines

### Layout
- Use full screen (`min-h-screen`)
- Center main content
- Timer in top-right
- Score in top-left

### Colors
- Use Tailwind color classes
- Gradients for backgrounds
- High contrast for readability

### Animations
- Use Framer Motion for smooth transitions
- `whileHover` and `whileTap` for buttons
- `initial` and `animate` for entrances

### Mobile Support
- Use responsive classes (`md:`, `lg:`)
- Large touch targets (min 44x44px)
- Test on mobile browsers

## 💡 Minigame Ideas

Here are some ideas for new minigames:

### Easy Difficulty
- **Tap Counter**: Tap as many times as possible
- **Color Match**: Match the color name to the color
- **True or False**: Answer trivia questions
- **Emoji Match**: Match emoji pairs

### Medium Difficulty
- **Pattern Copy**: Recreate a pattern
- **Number Sequence**: Find the next number
- **Anagram Solver**: Unscramble words
- **Quick Draw**: Draw simple shapes

### Hard Difficulty
- **Code Breaker**: Solve logic puzzles
- **Maze Runner**: Navigate through a maze
- **Rhythm Game**: Hit notes on beat
- **Typing Test**: Type complex sentences

## 🔌 Advanced Features

### Server-Side Validation

For competitive games, validate answers on the server:

```typescript
// In socket handlers
socket.on('minigame:submit', (data) => {
  // Validate answer server-side
  const isCorrect = validateAnswer(data.answer);
  
  socket.emit('minigame:result', {
    playerId: data.playerId,
    score: isCorrect ? 1 : 0,
    isCorrect,
  });
});
```

### Custom Data Structures

Add game-specific types to `shared/src/types/minigame.ts`:

```typescript
export interface YourGameData {
  question: string;
  answer: string;
  options: string[];
}
```

### Multiplayer Sync

For real-time multiplayer minigames:

```typescript
// Emit updates to all players
socket.on('minigame:update', (data) => {
  io.to(roomId).emit('minigame:update', data);
});
```

## 📊 Scoring Guidelines

### Score Calculation
- **Speed-based**: Higher score for faster completion
- **Accuracy-based**: Points for correct answers
- **Combo-based**: Bonus for consecutive successes
- **Time-based**: Points per second survived

### Winner Determination
The game engine automatically determines winners by:
1. Highest score
2. Fastest time (if scores are equal)

## 🐛 Testing Checklist

- [ ] Timer counts down correctly
- [ ] Score updates properly
- [ ] Game ends when timer reaches 0
- [ ] `onComplete` is called with correct data
- [ ] Works on mobile (touch events)
- [ ] Animations are smooth
- [ ] No console errors
- [ ] Handles edge cases (rapid clicks, etc.)

## 🎯 Best Practices

1. **Keep it simple**: 30-45 seconds is ideal
2. **Clear instructions**: Players should understand immediately
3. **Visual feedback**: Show when actions are correct/wrong
4. **Fair difficulty**: Achievable but challenging
5. **Mobile-first**: Design for touch screens
6. **Performance**: Avoid heavy computations
7. **Accessibility**: High contrast, large text

## 📚 Examples to Study

Look at these existing minigames for reference:

- **Speed Math**: Input handling, validation
- **Reaction Dash**: Timing, click detection
- **Memory Flash**: Sequences, state management
- **Word Sprint**: Real-time input matching
- **Color Code**: Multi-step puzzles

## 🚀 Publishing Your Minigame

Once your minigame is ready:

1. Test thoroughly
2. Get feedback from players
3. Adjust difficulty based on data
4. Add to the main game rotation
5. Share with the community!

## 🆘 Need Help?

- Check existing minigames for examples
- Review the TypeScript types
- Test in isolation first
- Ask in the community

Happy game development! 🎮

