# 🚀 Setup Guide - Minigame Battle Royale

## Prerequisites

- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **npm** (comes with Node.js)

## Installation Steps

### 1. Install Dependencies

Since you're on Windows with PowerShell execution policy restrictions, we'll install dependencies manually:

```powershell
# Install root dependencies
npm install

# Install shared package dependencies
cd shared
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Build Shared Package

The shared package contains types used by both client and server:

```powershell
cd shared
npm run build
cd ..
```

### 3. Start Development Servers

You'll need **two terminal windows**:

#### Terminal 1 - Backend Server
```powershell
cd server
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3000
🎮 WebSocket server ready
```

#### Terminal 2 - Frontend Client
```powershell
cd client
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

### 4. Open the Game

Open your browser and navigate to:
- **Desktop**: http://localhost:5173
- **Mobile** (on same network): http://YOUR_IP:5173

## 🎮 How to Play

### Creating a Game
1. Click "Create Game"
2. Enter your name
3. Choose game mode (Team Battle / Free-For-All)
4. Select number of rounds and teams
5. Choose which minigames to include
6. Click "Create Game Room"
7. Share the 6-digit room code with friends!

### Joining a Game
1. Click "Join Game"
2. Enter your name
3. Enter the 6-digit room code
4. Click "Join Game Room"

### In the Lobby
- Wait for other players to join
- Click "Ready" when you're ready
- Host can start the game when everyone is ready

### Playing
- Each round features a random minigame
- Compete to get the highest score
- Winner gets points for their team (or themselves in FFA mode)
- After all rounds, the team/player with most points wins!

## 🎯 The 5 Minigames

1. **Speed Math Royale** ➕
   - Solve math problems as fast as possible
   - Type your answer and press Enter
   - More correct answers = higher score

2. **Reaction Dash** ⚡
   - Wait for the circle to turn GREEN
   - Click as fast as you can when it changes
   - Faster reactions = more points

3. **Color Code Breaker** 🎨
   - Use hints to crack the 4-color code
   - Click colors in the correct order
   - Crack more codes = higher score

4. **Memory Flash** 🧠
   - Memorize the sequence of colors
   - Repeat it back correctly
   - Longer sequences = more points

5. **Word Sprint** ⌨️
   - Type the displayed word as fast as possible
   - Accuracy and speed matter
   - More words typed = higher score

## 🔧 Troubleshooting

### Server won't start
- Make sure port 3000 is not in use
- Check that all dependencies are installed
- Try deleting `node_modules` and reinstalling

### Client won't connect to server
- Ensure the server is running first
- Check that the server URL in `client/src/contexts/SocketContext.tsx` is correct
- Look for CORS errors in browser console

### Mobile can't connect
- Make sure mobile device is on the same WiFi network
- Use your computer's local IP address (not localhost)
- Check firewall settings

### PowerShell execution policy error
If you see "running scripts is disabled", run this in PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📱 Mobile Testing

To test on mobile devices:

1. Find your computer's local IP:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Update server URL in `client/src/contexts/SocketContext.tsx`:
   ```typescript
   const socketInstance: SocketType = io('http://YOUR_IP:3000', {
   ```

3. Open on mobile: `http://YOUR_IP:5173`

## 🎨 Customization

### Adding New Minigames

1. Create a new folder in `client/src/minigames/YourGame/`
2. Create `YourGame.tsx` component
3. Register it in `client/src/minigames/registry.ts`
4. Add type to `shared/src/types/minigame.ts`
5. Add config to `shared/src/constants.ts`

### Changing Game Settings

Edit `shared/src/constants.ts`:
- `MAX_PLAYERS`: Maximum players per room
- `MAX_ROUNDS`: Maximum rounds per game
- `COUNTDOWN_DURATION`: Countdown before each round

## 🚀 Production Build

```powershell
# Build everything
npm run build

# Start production server
cd server
npm start
```

## 📝 Next Steps

- [ ] Implement single player mode with AI
- [ ] Add player profiles and stats persistence
- [ ] Make fully responsive for mobile
- [ ] Add sound effects and music
- [ ] Implement chat system
- [ ] Add more minigames!

## 🆘 Need Help?

Check the main README.md for more information or open an issue on GitHub.

Happy gaming! 🎮

