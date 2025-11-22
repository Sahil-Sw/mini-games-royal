# 🚀 Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## ✅ Pre-Deployment Checklist

### Code Preparation
- [ ] All code committed to Git
- [ ] No console.log statements in production code
- [ ] Environment variables configured
- [ ] Build scripts tested locally
- [ ] All tests passing (if applicable)

### Repository Setup
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Repository is public (or hosting service has access)
- [ ] README.md updated with deployment info

### Environment Files
- [ ] `client/.env.example` created
- [ ] `server/.env.example` created
- [ ] `.gitignore` includes `.env` and `.env.local`
- [ ] Environment variables documented

## 🖥️ Backend Deployment (Render)

### Account Setup
- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] Payment method added (optional, for paid plans)

### Service Configuration
- [ ] New Web Service created
- [ ] Repository connected
- [ ] Build command configured:
  ```
  cd shared && npm install && npm run build && cd ../server && npm install && npm run build
  ```
- [ ] Start command configured:
  ```
  cd server && npm start
  ```
- [ ] Free tier selected

### Environment Variables
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000` (or Render default)
- [ ] `CORS_ORIGINS` = (will update after frontend deployment)

### Deployment
- [ ] Service deployed successfully
- [ ] No build errors
- [ ] Service is running
- [ ] Backend URL copied (e.g., `https://minigame-server.onrender.com`)
- [ ] Health check endpoint working (`/health`)

## 🌐 Frontend Deployment (Vercel)

### Account Setup
- [ ] Vercel account created
- [ ] GitHub connected to Vercel

### Project Configuration
- [ ] New project created
- [ ] Repository imported
- [ ] Framework preset: Vite
- [ ] Build command configured:
  ```
  cd shared && npm install && npm run build && cd ../client && npm install && npm run build
  ```
- [ ] Output directory: `client/dist`

### Environment Variables
- [ ] `VITE_API_URL` = `https://your-backend.onrender.com` (your Render URL)

### Deployment
- [ ] Project deployed successfully
- [ ] No build errors
- [ ] Site is live
- [ ] Frontend URL copied (e.g., `https://your-app.vercel.app`)

## 🔄 Post-Deployment Configuration

### Update Backend CORS
- [ ] Go to Render dashboard
- [ ] Open your web service
- [ ] Go to Environment tab
- [ ] Update `CORS_ORIGINS` to your frontend URL
- [ ] Save (triggers redeploy)
- [ ] Wait for redeploy to complete

### DNS Configuration (Optional)
- [ ] Custom domain purchased
- [ ] DNS records configured
- [ ] SSL certificate issued
- [ ] Domain working

## ✅ Testing Checklist

### Single Player Mode
- [ ] Open deployed frontend URL
- [ ] Click "Single Player"
- [ ] Select a minigame
- [ ] Play and complete game
- [ ] Score saved correctly
- [ ] Personal best displayed

### Multiplayer Mode - Same Device
- [ ] Open deployed URL
- [ ] Click "Create Game"
- [ ] Configure settings
- [ ] Create room
- [ ] Room code displayed
- [ ] Open URL in incognito/private window
- [ ] Click "Join Game"
- [ ] Enter room code
- [ ] Both players in lobby
- [ ] Start game
- [ ] Play minigame
- [ ] Scores update correctly

### Multiplayer Mode - Different Devices
- [ ] Open URL on Device 1 (computer)
- [ ] Create game room
- [ ] Copy room code
- [ ] Open URL on Device 2 (phone)
- [ ] Join with room code
- [ ] Both devices connected
- [ ] Start game
- [ ] Play minigame
- [ ] Real-time sync working

### Mobile Testing
- [ ] Open on iOS Safari
- [ ] Open on Android Chrome
- [ ] Touch interactions working
- [ ] Responsive layout correct
- [ ] No horizontal scroll
- [ ] Keyboard doesn't break layout
- [ ] Add to home screen works
- [ ] Fullscreen mode works

### Network Testing
- [ ] Test on WiFi
- [ ] Test on mobile data (4G/5G)
- [ ] Test with different networks (cross-network)
- [ ] Reconnection works after disconnect
- [ ] No CORS errors in console

## 🐛 Troubleshooting

### Backend Issues
- [ ] Check Render logs for errors
- [ ] Verify environment variables
- [ ] Check build logs
- [ ] Test health endpoint
- [ ] Verify CORS settings

### Frontend Issues
- [ ] Check Vercel logs for errors
- [ ] Verify environment variables
- [ ] Check browser console for errors
- [ ] Test API connection
- [ ] Clear browser cache

### Connection Issues
- [ ] Verify backend URL in frontend env
- [ ] Check CORS origins match
- [ ] Test WebSocket connection
- [ ] Check firewall settings
- [ ] Verify SSL certificates

## 📊 Monitoring

### After Deployment
- [ ] Monitor Render dashboard for uptime
- [ ] Check Vercel analytics
- [ ] Monitor error logs
- [ ] Track user feedback
- [ ] Monitor bandwidth usage

### Performance
- [ ] Check page load times
- [ ] Monitor WebSocket latency
- [ ] Check mobile performance
- [ ] Monitor memory usage
- [ ] Track API response times

## 🎉 Launch Checklist

### Before Public Launch
- [ ] All features tested
- [ ] No critical bugs
- [ ] Documentation complete
- [ ] Support channels ready
- [ ] Monitoring in place

### Launch Day
- [ ] Share URL with friends
- [ ] Post on social media (optional)
- [ ] Monitor for issues
- [ ] Respond to feedback
- [ ] Celebrate! 🎊

## 📝 Post-Launch

### Week 1
- [ ] Monitor daily active users
- [ ] Fix any reported bugs
- [ ] Gather user feedback
- [ ] Update documentation
- [ ] Plan improvements

### Ongoing
- [ ] Regular updates
- [ ] Security patches
- [ ] Performance optimization
- [ ] New features
- [ ] Community engagement

---

## 🆘 Need Help?

If you encounter issues:

1. Check the [DEPLOYMENT.md](DEPLOYMENT.md) guide
2. Check the [MOBILE_GUIDE.md](MOBILE_GUIDE.md) for mobile issues
3. Review Render/Vercel documentation
4. Check browser console for errors
5. Review server logs in Render dashboard

---

**Good luck with your deployment!** 🚀🎮

