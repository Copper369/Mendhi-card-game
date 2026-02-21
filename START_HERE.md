# 🎴 START HERE - Deploy Mendhikot.io

## 📋 What's Ready

✅ **Code**: Fully functional multiplayer card game  
✅ **UI**: Mobile responsive with Fredoka font  
✅ **Build**: Tested and working  
✅ **Git**: Repository initialized and committed  
✅ **Database**: MongoDB already configured  

## 🚀 Deploy in 3 Simple Steps

### STEP 1: Push to GitHub (2 minutes)

```bash
# 1. Create new repo on GitHub
# Go to: https://github.com/new
# Name: mendhikot-io
# Don't initialize with README

# 2. Push your code
git remote add origin https://github.com/YOUR_USERNAME/mendhikot-io.git
git branch -M main
git push -u origin main
```

### STEP 2: Deploy Backend to Railway (5 minutes)

1. **Go to**: https://railway.app/new
2. **Click**: "Deploy from GitHub repo"
3. **Select**: `mendhikot-io` repository
4. **Add Variables** (in Variables tab):
   ```
   MONGODB_URI=mongodb+srv://ayushkarnewar1729_db_user:ZD4ov504HhsP5gGM@demo3.xbqkzmh.mongodb.net/tasksDB?appName=Demo3
   PORT=3001
   ```
5. **Settings** → Start Command: `node server/index.js`
6. **Settings** → Domains → **Generate Domain**
7. **Copy the URL** (e.g., `https://mendhikot-io-production.up.railway.app`)

### STEP 3: Deploy Frontend to Vercel (3 minutes)

```bash
# In your terminal, run:
vercel

# When prompted:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? mendhikot-io
# - Directory? ./ (press Enter)
# - Override settings? N

# After first deployment, add environment variables:
vercel env add NEXT_PUBLIC_SOCKET_URL production
# Paste your Railway URL from Step 2

vercel env add MONGODB_URI production
# Paste: mongodb+srv://ayushkarnewar1729_db_user:ZD4ov504HhsP5gGM@demo3.xbqkzmh.mongodb.net/tasksDB?appName=Demo3

# Deploy to production with env vars:
vercel --prod
```

## 🎉 Done!

Your game is now live at: `https://mendhikot-io.vercel.app`

## 🔗 Important Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com/

## 📱 Test Your Deployment

1. Open your Vercel URL
2. Create a room
3. Open in another browser/device
4. Join the same room
5. Play the game!

## 💡 Need Help?

Check these files:
- `DEPLOY_NOW_COMPLETE.md` - Detailed deployment guide
- `DEPLOYMENT_STEPS.md` - Alternative deployment methods
- `TROUBLESHOOTING.md` - Common issues and fixes

## 🎮 Share Your Game

```
🎴 Play Mendhikot Online!
[Your Vercel URL]

- 4-player multiplayer
- Real-time gameplay
- Mobile responsive
- Free to play!
```

---

**Ready? Start with STEP 1!** 🚀
