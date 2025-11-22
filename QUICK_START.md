# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## 🚀 Installation (One-Time Setup)

### Option 1: Automated (Recommended)
```powershell
# Run the installation script
.\install.ps1
```

### Option 2: Manual
```powershell
# Install all dependencies
npm install
cd shared && npm install && npm run build && cd ..
cd server && npm install && cd ..
cd client && npm install && cd ..
```

## 🎮 Running the Game

You need **TWO terminal windows**:

### Terminal 1 - Backend
```powershell
cd server
npm run dev
```
Wait for: `🚀 Server running on http://localhost:3000`

### Terminal 2 - Frontend
```powershell
cd client
npm run dev
```
Wait for: `➜  Local:   http://localhost:5173/`

## 🌐 Open the Game

**Desktop**: http://localhost:5173

**Mobile** (same WiFi):
1. Find your IP: `ipconfig` (look for IPv4)
2. Open: `http://YOUR_IP:5173`

## 🎯 First Game

1. **Player 1** (Host):
   - Click "Create Game"
   - Enter name
   - Choose settings
   - Get room code (e.g., "ABC123")

2. **Player 2+** (Friends):
   - Click "Join Game"
   - Enter name
   - Enter room code
   - Click "Ready"

3. **Start Playing**:
   - Host clicks "Start Game"
   - Compete in minigames!
   - Winner gets points
   - Most points wins!

## 🎮 The 5 Minigames

| Game | Description | Difficulty |
|------|-------------|------------|
| 🧮 Speed Math | Solve math problems fast | Medium |
| ⚡ Reaction Dash | Click when green appears | Easy |
| 🎨 Color Code | Crack the color puzzle | Hard |
| 🧠 Memory Flash | Remember the sequence | Medium |
| ⌨️ Word Sprint | Type words quickly | Easy |

## 🔧 Troubleshooting

### "Server won't start"
- Check if port 3000 is free
- Restart terminal
- Run `npm install` in server folder

### "Can't connect to server"
- Make sure server is running first
- Check browser console for errors
- Try refreshing the page

### "Mobile can't connect"
- Use same WiFi network
- Use computer's IP, not "localhost"
- Check firewall settings

### "PowerShell script error"
Run as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📱 Mobile Setup

1. Find your computer's IP:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Update `client/src/contexts/SocketContext.tsx`:
   ```typescript
   const socketInstance: SocketType = io('http://192.168.1.100:3000', {
   ```

3. Open on mobile: `http://192.168.1.100:5173`

## 📚 More Information

- **Full Setup**: See `SETUP.md`
- **Project Details**: See `PROJECT_SUMMARY.md`
- **Add Minigames**: See `ADDING_MINIGAMES.md`
- **Main Docs**: See `README.md`

## 🎉 You're Ready!

Have fun playing! 🎮

Need help? Check the other documentation files or open an issue.

