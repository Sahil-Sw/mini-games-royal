# 🎮 Minigame Battle Royale

A real-time multiplayer game platform featuring rotating minigames with team battle and free-for-all modes.

## 🚀 Features

- **Multiple Game Modes**: Team Battle (2-4 teams), Free-For-All & Single Player
- **5 Unique Minigames**: Speed Math, Reaction Dash, Color Code Breaker, Memory Flash, Word Sprint
- **Real-time Multiplayer**: Up to 10 players per room
- **Cross-Platform**: Play on web browser or mobile
- **Single Player Mode**: Practice offline and track personal bests
- **Stats Tracking**: Personal best scores and game history
- **Room System**: Create/join games with shareable codes

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Socket.IO Client (real-time communication)

### Backend
- Node.js + Express
- Socket.IO (WebSocket server)
- TypeScript
- In-memory game state (Redis-ready for scaling)

## 📁 Project Structure

```
├── client/          # React frontend
├── server/          # Node.js backend
├── shared/          # Shared types and constants
└── package.json     # Root workspace config
```

## 🎯 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install all dependencies
npm run install:all

# Or install root and workspaces
npm install
```

### Development

```bash
# Run both client and server concurrently
npm run dev

# Or run separately
npm run dev:client  # Frontend on http://localhost:5173
npm run dev:server  # Backend on http://localhost:3000
```

### Build for Production

```bash
npm run build
```

## 🎮 How to Play

### Multiplayer Mode
1. **Create a Game**: Choose mode, number of rounds, and teams
2. **Share Room Code**: Invite friends with the generated code
3. **Join Lobby**: Players join and select teams
4. **Play Rounds**: Compete in random minigames
5. **Win**: Team/player with most points wins!

### Single Player Mode
1. **Select Single Player**: From the home screen
2. **Choose a Minigame**: Pick from 5 available games
3. **Play**: Complete the minigame in 30 seconds
4. **Beat Your Best**: Try to beat your personal record!

## 🚀 Deployment

Ready to deploy your game? Check out the comprehensive guides:

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Step-by-step deployment guide
  - Deploy backend to Render (free)
  - Deploy frontend to Vercel/Netlify (free)
  - Configure environment variables
  - Test network multiplayer

- **[MOBILE_GUIDE.md](MOBILE_GUIDE.md)** - Mobile compatibility guide
  - Test on mobile devices
  - Add to home screen
  - Mobile optimizations
  - Troubleshooting

### Quick Deploy

**Backend (Render):**
```bash
# Build command
cd shared && npm install && npm run build && cd ../server && npm install && npm run build

# Start command
cd server && npm start
```

**Frontend (Vercel/Netlify):**
```bash
# Build command
cd shared && npm install && npm run build && cd ../client && npm install && npm run build

# Output directory
client/dist
```

**Environment Variables:**
- Backend: `NODE_ENV=production`, `CORS_ORIGINS=https://your-app.vercel.app`
- Frontend: `VITE_API_URL=https://your-backend.onrender.com`

## 📱 Mobile Support

✅ **Fully mobile compatible!**
- Responsive design for all screen sizes
- Touch-optimized controls
- Works on iOS and Android
- Add to home screen for app-like experience
- Cross-platform multiplayer (mobile + desktop)

Test locally on mobile:
1. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Start dev servers: `npm run dev`
3. Open on mobile: `http://YOUR_IP:5173`

## 🔮 Future Improvements

- [ ] Power-ups and handicaps
- [ ] Voice chat integration
- [ ] Tournament mode
- [ ] Custom minigame creator
- [ ] Achievements and badges
- [ ] Cosmetics shop
- [ ] PWA with offline support
- [ ] Push notifications
- [ ] Twitch integration

## 📚 Documentation

- **[README.md](README.md)** - This file (overview and setup)
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide
- **[MOBILE_GUIDE.md](MOBILE_GUIDE.md)** - Mobile compatibility
- **[SINGLE_PLAYER_GUIDE.md](SINGLE_PLAYER_GUIDE.md)** - Single player mode
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[FEATURES.md](FEATURES.md)** - Feature checklist
- **[ADDING_MINIGAMES.md](ADDING_MINIGAMES.md)** - Add new minigames

## 📝 License

MIT

