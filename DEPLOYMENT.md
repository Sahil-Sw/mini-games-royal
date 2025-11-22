# 🚀 Deployment Guide

This guide will help you deploy your Minigame Battle Royale to free hosting platforms with full network multiplayer support.

## 📋 Prerequisites

- GitHub account (for code hosting)
- Render account (for backend) - [render.com](https://render.com)
- Vercel account (for frontend) - [vercel.com](https://vercel.com)
  - OR Netlify account - [netlify.com](https://netlify.com)

## 🎯 Deployment Strategy

**Backend (Server)** → Render (Free tier with WebSocket support)  
**Frontend (Client)** → Vercel or Netlify (Free tier)  
**Shared Package** → Built during deployment

---

## 📦 Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - Minigame Battle Royale"
```

### 1.2 Create GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it: `minigame-battle-royale` (or your preferred name)
3. Don't initialize with README (we already have one)

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/minigame-battle-royale.git
git branch -M main
git push -u origin main
```

---

## 🖥️ Step 2: Deploy Backend to Render

### 2.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 2.2 Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

**Basic Settings:**
- **Name**: `minigame-server` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Runtime**: `Node`
- **Build Command**: 
  ```bash
  cd shared && npm install && npm run build && cd ../server && npm install && npm run build
  ```
- **Start Command**: 
  ```bash
  cd server && npm start
  ```

**Instance Type:**
- Select **"Free"** (includes 750 hours/month)

### 2.3 Add Environment Variables

In the Render dashboard, add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render default) |
| `CORS_ORIGINS` | `https://your-app.vercel.app` (update after frontend deployment) |

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL: `https://minigame-server.onrender.com`

**⚠️ Important Notes:**
- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- WebSocket connections are fully supported

---

## 🌐 Step 3: Deploy Frontend to Vercel

### Option A: Vercel (Recommended)

#### 3.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

#### 3.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Configure project:

**Framework Preset**: `Vite`  
**Root Directory**: Leave empty  
**Build Command**: 
```bash
cd shared && npm install && npm run build && cd ../client && npm install && npm run build
```
**Output Directory**: `client/dist`

#### 3.3 Add Environment Variables

Add this environment variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://minigame-server.onrender.com` (your Render URL) |

#### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for deployment (3-5 minutes)
3. Your app will be live at: `https://your-app.vercel.app`

### Option B: Netlify (Alternative)

#### 3.1 Create Netlify Account

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub

#### 3.2 Import Project

1. Click **"Add new site"** → **"Import an existing project"**
2. Connect to GitHub and select your repository
3. Configure build settings:

**Build command**: 
```bash
cd shared && npm install && npm run build && cd ../client && npm install && npm run build
```
**Publish directory**: `client/dist`

#### 3.3 Add Environment Variables

Go to **Site settings** → **Environment variables**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://minigame-server.onrender.com` |

#### 3.4 Deploy

1. Click **"Deploy site"**
2. Your app will be live at: `https://your-app.netlify.app`

---

## 🔄 Step 4: Update CORS Settings

### 4.1 Update Backend CORS

Go back to Render dashboard:

1. Open your web service
2. Go to **Environment** tab
3. Update `CORS_ORIGINS` to your frontend URL:
   ```
   https://your-app.vercel.app
   ```
   Or for multiple domains:
   ```
   https://your-app.vercel.app,https://custom-domain.com
   ```
4. Save changes (this will trigger a redeploy)

---

## ✅ Step 5: Test Your Deployment

### 5.1 Test Single Player Mode

1. Open your deployed frontend URL
2. Click **"Single Player"**
3. Play a minigame
4. ✅ Should work without backend

### 5.2 Test Multiplayer Mode

1. Open your deployed URL on **Device 1** (e.g., your computer)
2. Click **"Create Game"**
3. Configure settings and create room
4. Copy the room code
5. Open the same URL on **Device 2** (e.g., your phone)
6. Click **"Join Game"**
7. Enter the room code
8. ✅ Both devices should connect to the same room!

### 5.3 Test Network Multiplayer

Test with friends on different networks:
1. Share your deployed URL
2. Create a room
3. Share the 6-digit code
4. Friends join from their devices
5. ✅ Everyone should be able to play together!

---

## 📱 Mobile Testing

### Test on Real Devices

1. **iOS**: Open in Safari
2. **Android**: Open in Chrome
3. Test touch interactions
4. Test landscape/portrait modes
5. Test room creation and joining

### Add to Home Screen

**iOS:**
1. Open in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. App will work like a native app!

**Android:**
1. Open in Chrome
2. Tap menu (3 dots)
3. Tap "Add to Home Screen"

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Server sleeps on free tier  
**Solution**: First request takes 30s to wake up. Consider upgrading to paid tier ($7/month) for always-on service.

**Problem**: WebSocket connection fails  
**Solution**: Check CORS settings and ensure frontend URL is in `CORS_ORIGINS`.

**Problem**: Build fails  
**Solution**: Check build logs in Render dashboard. Ensure shared package builds first.

### Frontend Issues

**Problem**: Can't connect to backend  
**Solution**: Check `VITE_API_URL` environment variable is set correctly.

**Problem**: 404 on page refresh  
**Solution**: Ensure `vercel.json` or `netlify.toml` has proper redirects configured.

**Problem**: Environment variables not working  
**Solution**: Redeploy after adding environment variables.

### Mobile Issues

**Problem**: Touch not working  
**Solution**: Check CSS `touch-action` and `-webkit-tap-highlight-color` properties.

**Problem**: Viewport too small/large  
**Solution**: Check `<meta name="viewport">` tag in `index.html`.

---

## 💰 Cost Breakdown

### Free Tier Limits

**Render (Backend):**
- ✅ 750 hours/month (enough for 1 service)
- ✅ Sleeps after 15 min inactivity
- ✅ WebSocket support
- ✅ Automatic HTTPS

**Vercel (Frontend):**
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN

**Netlify (Frontend Alternative):**
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS

### Upgrade Options (Optional)

**Render Starter ($7/month):**
- Always-on (no sleep)
- Better for active games

**Vercel Pro ($20/month):**
- More bandwidth
- Better analytics

---

## 🎉 You're Live!

Your game is now deployed and accessible worldwide! Share your URL with friends and start playing!

**Next Steps:**
- [ ] Add custom domain (optional)
- [ ] Set up analytics (optional)
- [ ] Monitor usage and performance
- [ ] Collect feedback from players

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Socket.IO Deployment Guide](https://socket.io/docs/v4/deployment/)

---

**Need help?** Check the troubleshooting section or open an issue on GitHub!

