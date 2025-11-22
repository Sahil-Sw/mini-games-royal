# 🎯 Single Player Mode Guide

## Overview

The single player mode allows players to practice minigames offline, track their personal best scores, and improve their skills without needing other players or an internet connection.

## Features

### ✅ Implemented

- **Game Selection Menu**: Browse all 5 minigames with difficulty indicators
- **Personal Stats Dashboard**: Track games played, total score, and games mastered
- **Personal Best Tracking**: Each minigame saves your best score
- **Recent Games History**: View your last 10 games played
- **Offline Play**: No server connection required
- **Countdown Timer**: 3-2-1 countdown before each game
- **Results Screen**: See your score and compare to personal best
- **New Record Celebration**: Special indicator when you beat your best score
- **Play Again**: Instantly replay any minigame
- **LocalStorage Persistence**: All stats saved locally in your browser

## How to Play

### 1. Access Single Player Mode

From the home screen, click **"Single Player"** button.

### 2. Choose a Minigame

You'll see all 5 minigames with:
- **Icon** and **Name**
- **Difficulty Badge** (Easy, Medium, Hard)
- **Description**
- **Personal Best Score** (if you've played before)
- **Play Now Button**

### 3. Play the Game

1. Click "Play Now" on any minigame
2. Watch the 3-2-1 countdown
3. Play the minigame (30 seconds)
4. See your results

### 4. View Results

After completing a game, you'll see:
- Your final score
- Your personal best for that game
- "New Record!" indicator if you beat your best
- Options to:
  - **Play Again** - Replay the same minigame
  - **Back to Menu** - Return to game selection

## Stats Tracking

### Dashboard Stats

- **Games Played**: Total number of single player games
- **Total Score**: Sum of all scores across all games
- **Games Mastered**: Number of different minigames you've played

### Personal Best Scores

Each minigame tracks:
- **Best Score**: Highest score achieved
- **Time**: How long it took to achieve that score
- **Date**: When you achieved the best score

### Recent Games

View your last 10 games with:
- Minigame name and icon
- Score achieved
- Time taken
- Date and time played

## Technical Details

### Data Storage

All single player data is stored in **localStorage** under the key `minigame_single_player_stats`.

**Data Structure:**
```typescript
{
  gamesPlayed: number;
  totalScore: number;
  bestScores: {
    [gameType]: {
      gameType: string;
      score: number;
      time: number;
      date: Date;
    }
  };
  recentGames: Array<{
    gameType: string;
    score: number;
    time: number;
    date: Date;
  }>;
}
```

### Files

**Components:**
- `client/src/screens/SinglePlayerScreen.tsx` - Game selection menu
- `client/src/screens/SinglePlayerGameScreen.tsx` - Game play screen

**Utilities:**
- `client/src/utils/storage.ts` - LocalStorage management
  - `getSinglePlayerStats()` - Get all stats
  - `saveSinglePlayerScore()` - Save a new score
  - `getBestScore()` - Get best score for a game

**Routes:**
- `/single-player` - Main menu
- `/single-player/game` - Game screen (with state: gameType)

## Minigames Available

| Game | Icon | Difficulty | Duration |
|------|------|------------|----------|
| Speed Math Royale | 🧮 | Medium | 30s |
| Reaction Dash | ⚡ | Easy | 30s |
| Color Code Breaker | 🎨 | Hard | 30s |
| Memory Flash | 🧠 | Medium | 30s |
| Word Sprint | ⌨️ | Easy | 30s |

## Tips for High Scores

### Speed Math Royale
- Focus on accuracy first, speed second
- Use keyboard for faster input
- Practice mental math

### Reaction Dash
- Stay focused on the circle
- Don't anticipate - wait for green
- Relax your hand for faster clicks

### Color Code Breaker
- Use the hints strategically
- Remember previous attempts
- Look for patterns

### Memory Flash
- Focus during the flash sequence
- Use chunking (group colors together)
- Practice makes perfect

### Word Sprint
- Touch typing helps immensely
- Don't look at keyboard
- Stay calm and steady

## Future Enhancements

Potential features for future versions:

- [ ] **Difficulty Levels**: Easy, Medium, Hard modes for each game
- [ ] **Achievements**: Unlock badges for milestones
- [ ] **Daily Challenges**: Special challenges with bonus points
- [ ] **Leaderboards**: Compare with friends (local)
- [ ] **Practice Mode**: Unlimited time to practice
- [ ] **Statistics**: Detailed graphs and analytics
- [ ] **Custom Games**: Adjust duration and difficulty
- [ ] **Streak Tracking**: Track consecutive days played
- [ ] **Export Stats**: Download your stats as JSON/CSV

## Clearing Data

To reset all single player data:

```javascript
// In browser console
localStorage.removeItem('minigame_single_player_stats');
```

Or use the storage utility:
```javascript
import { storage } from './utils/storage';
storage.clearAll(); // Clears ALL game data
```

## Troubleshooting

### Stats Not Saving
- Check if localStorage is enabled in your browser
- Check browser privacy settings
- Try a different browser

### Game Not Loading
- Refresh the page
- Check browser console for errors
- Make sure you selected a game from the menu

### Personal Best Not Updating
- Make sure you're beating your previous score
- If scores are equal, time must be faster
- Check that localStorage isn't full

## Mobile Support

Single player mode works great on mobile:
- Touch-friendly buttons
- Responsive layout
- Works offline
- Saves to mobile browser storage

## Privacy

All single player data is stored **locally** in your browser. No data is sent to any server. Your stats are private and only accessible on your device.

---

**Enjoy practicing and beating your personal bests!** 🎮🏆

