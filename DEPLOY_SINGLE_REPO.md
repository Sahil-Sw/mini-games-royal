# 🚀 Single Repository Deployment Guide

This guide shows you how to deploy your entire monorepo to free hosting platforms.

## ✅ **Why Single Repo?**

- ✅ Easier to manage (one place for everything)
- ✅ Shared package automatically available
- ✅ Both Render and Vercel support monorepos
- ✅ Simpler version control
- ✅ No need to publish shared package to npm

---

## 📦 **Step 1: Prepare Your Repository**

### 1.1 Check Your Structure

Your current structure should look like this:
```
Game/
├── client/              # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── server/              # Node.js backend
│   ├── src/
│   └── package.json
├── shared/              # Shared TypeScript types
│   ├── src/
│   └── package.json
├── .gitignore
├── render.yaml          # Render config (backend)
├── vercel.json          # Vercel config (frontend)
└── README.md
```

### 1.2 Verify .gitignore

Make sure your `.gitignore` includes:
```
node_modules/
dist/
.env
.env.local
```

### 1.3 Test Local Build

```powershell
# Build everything locally first
.\build-all.ps1

# Or manually:
cd shared
npm install
npm run build

cd ../server
npm install
npm run build

cd ../client
npm install
npm run build
```

---

## 🐙 **Step 2: Push to GitHub**

### 2.1 Initialize Git (if not already done)

```powershell
# Check if git is initialized
git status

# If not initialized:
git init
```

### 2.2 Create .gitignore (if needed)

Already exists in your project!

### 2.3 Commit Your Code

```powershell
# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"
```

### 2.4 Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"New repository"** (green button)
3. Name it: `minigame-battle-royale` (or your choice)
4. **DO NOT** initialize with README (you already have one)
5. Click **"Create repository"**

### 2.5 Push to GitHub

```powershell
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/minigame-battle-royale.git

# Push to main branch
git branch -M main
git push -u origin main
```

**✅ Your code is now on GitHub!**

---

## 🖥️ **Step 3: Deploy Backend to Render**

### 3.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Get Started"**
3. Sign up with **GitHub** (easiest)
4. Authorize Render to access your repositories

### 3.2 Create New Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Find and select your `minigame-battle-royale` repository
4. Click **"Connect"**

### 3.3 Configure Service

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `minigame-server` (or your choice) |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | *Leave empty* |
| **Runtime** | `Node` |
| **Build Command** | `cd shared && npm install && npm run build && cd ../server && npm install && npm run build` |
| **Start Command** | `cd server && npm start` |

### 3.4 Select Plan

- Select **"Free"** plan
- Free tier includes:
  - 750 hours/month
  - Sleeps after 15 min inactivity
  - WebSocket support ✅

### 3.5 Add Environment Variables

Click **"Advanced"** and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `CORS_ORIGINS` | `*` (we'll update this later) |

### 3.6 Deploy!

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Watch the logs for any errors
4. Once deployed, you'll see: **"Your service is live 🎉"**

### 3.7 Copy Your Backend URL

You'll get a URL like:
```
https://minigame-server.onrender.com
```

**Save this URL!** You'll need it for the frontend.

---

## 🌐 **Step 4: Deploy Frontend to Vercel**

### 4.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with **GitHub** (easiest)
4. Authorize Vercel to access your repositories

### 4.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Find your `minigame-battle-royale` repository
3. Click **"Import"**

### 4.3 Configure Project

Vercel will auto-detect Vite, but we need to customize:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | *Leave as `.`* |
| **Build Command** | `cd shared && npm install && npm run build && cd ../client && npm install && npm run build` |
| **Output Directory** | `client/dist` |

### 4.4 Add Environment Variables

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://minigame-server.onrender.com` (your Render URL) |

### 4.5 Deploy!

1. Click **"Deploy"**
2. Wait 3-5 minutes for deployment
3. Watch the build logs
4. Once deployed, you'll see: **"Congratulations! 🎉"**

### 4.6 Copy Your Frontend URL

You'll get a URL like:
```
https://minigame-battle-royale.vercel.app
```

**Your game is now live!** 🎮

---

## 🔄 **Step 5: Update Backend CORS**

Now that you have your frontend URL, update the backend:

### 5.1 Go to Render Dashboard

1. Open [dashboard.render.com](https://dashboard.render.com)
2. Click on your `minigame-server` service

### 5.2 Update Environment Variables

1. Go to **"Environment"** tab
2. Find `CORS_ORIGINS`
3. Update to your Vercel URL:
   ```
   https://minigame-battle-royale.vercel.app
   ```
4. Click **"Save Changes"**

### 5.3 Wait for Redeploy

- Render will automatically redeploy (2-3 minutes)
- Wait for it to finish

**✅ CORS is now configured!**

---

## ✅ **Step 6: Test Your Deployment**

### 6.1 Test Single Player

1. Open your Vercel URL
2. Click **"Single Player"**
3. Play a minigame
4. ✅ Should work perfectly!

### 6.2 Test Multiplayer (Same Device)

1. Open your Vercel URL in normal browser
2. Click **"Create Game"**
3. Create a room and copy the code
4. Open your Vercel URL in **incognito/private window**
5. Click **"Join Game"**
6. Enter the room code
7. ✅ Both should connect!

### 6.3 Test Multiplayer (Different Devices)

1. Open your Vercel URL on your **computer**
2. Create a room
3. Open your Vercel URL on your **phone**
4. Join with the room code
5. ✅ Both should connect!

### 6.4 Test Mobile

1. Open on iOS Safari
2. Open on Android Chrome
3. Test touch interactions
4. ✅ Everything should work!

---

## 🎉 **You're Live!**

Your game is now deployed and accessible worldwide!

**Share your URL:**
```
https://minigame-battle-royale.vercel.app
```

---

## 🔄 **Future Updates**

When you make changes:

### Update Code

```powershell
# Make your changes
# Then commit and push:
git add .
git commit -m "Your update message"
git push
```

### Automatic Deployment

- **Vercel**: Automatically redeploys on push ✅
- **Render**: Automatically redeploys on push ✅

**No manual work needed!** 🎉

---

## 🐛 **Troubleshooting**

### Backend Build Fails

**Check Render logs:**
1. Go to Render dashboard
2. Click on your service
3. Go to **"Logs"** tab
4. Look for error messages

**Common issues:**
- Missing dependencies: Check `package.json`
- TypeScript errors: Run `npm run build` locally first
- Shared package not building: Check build command

### Frontend Build Fails

**Check Vercel logs:**
1. Go to Vercel dashboard
2. Click on your project
3. Go to **"Deployments"** tab
4. Click on failed deployment
5. Check build logs

**Common issues:**
- Environment variable not set: Check `VITE_API_URL`
- Build command wrong: Check `vercel.json`
- TypeScript errors: Run `npm run build` locally first

### Can't Connect to Backend

**Check:**
1. Backend is running (check Render dashboard)
2. `VITE_API_URL` is correct in Vercel
3. `CORS_ORIGINS` includes your Vercel URL
4. No typos in URLs

### CORS Errors

**Fix:**
1. Go to Render dashboard
2. Update `CORS_ORIGINS` to your exact Vercel URL
3. Save and wait for redeploy

---

## 💰 **Cost: $0/month**

Both services are **100% free** for your use case!

**Render Free Tier:**
- 750 hours/month (enough for 1 service)
- Sleeps after 15 min inactivity
- First request takes ~30s to wake

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited deployments
- Always on (no sleep)

---

## 🎯 **Next Steps**

- [ ] Share your game with friends
- [ ] Test on different devices
- [ ] Monitor usage in dashboards
- [ ] Gather feedback
- [ ] Plan improvements

---

**Congratulations! Your game is live!** 🎮🚀🌍

