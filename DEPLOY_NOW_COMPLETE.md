# 🚀 Complete Deployment Guide - Mendhikot.io

## ✅ Pre-Deployment Checklist

- [x] Code is ready and tested locally
- [x] Git repository initialized
- [x] MongoDB connection string available
- [x] Vercel CLI installed and logged in (copper369)
- [x] Build successful
- [x] Mobile responsive UI complete
- [x] Navbar cleaned up

## 🎯 Deployment Strategy

We'll deploy in this order:
1. **Backend** → Railway (Socket.IO server)
2. **Frontend** → Vercel (Next.js app)

---

## 📦 STEP 1: Deploy Backend to Railway

### Option A: Using Railway Dashboard (Easiest)

1. **Push to GitHub first:**
   ```bash
   # Create new repo on GitHub: https://github.com/new
   # Name it: mendhikot-io
   # Then run:
   
   git remote add origin https://github.com/YOUR_USERNAME/mendhikot-io.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Railway:**
   - Go to: https://railway.app/new
   - Click "Deploy from GitHub repo"
   - Select `mendhikot-io`
   - Railway auto-detects Node.js ✅

3. **Add Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://ayushkarnewar1729_db_user:ZD4ov504HhsP5gGM@demo3.xbqkzmh.mongodb.net/tasksDB?appName=Demo3
   PORT=3001
   ```

4. **Set Start Command:**
   - Settings → Start Command: `node server/index.js`

5. **Generate Domain:**
   - Settings → Domains → Generate Domain
   - Copy URL: `https://mendhikot-io-production.up.railway.app`

### Option B: Using Render (Free Alternative)

1. Go to: https://render.com/
2. New + → Web Service
3. Connect GitHub repo
4. Settings:
   - Name: `mendhikot-backend`
   - Build: `npm install`
   - Start: `node server/index.js`
   - Add same environment variables
5. Deploy and copy URL

---

## 🌐 STEP 2: Deploy Frontend to Vercel

### Method 1: Vercel CLI (Recommended)

```bash
# Set environment variables first
vercel env add NEXT_PUBLIC_SOCKET_URL production
# Paste your Railway URL: https://mendhikot-io-production.up.railway.app

vercel env add MONGODB_URI production
# Paste: mongodb+srv://ayushkarnewar1729_db_user:ZD4ov504HhsP5gGM@demo3.xbqkzmh.mongodb.net/tasksDB?appName=Demo3

# Deploy to production
vercel --prod
```

### Method 2: Vercel Dashboard

1. Go to: https://vercel.com/new
2. Import Git Repository
3. Select your GitHub repo
4. Configure:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. **Environment Variables:**
   ```
   NEXT_PUBLIC_SOCKET_URL=https://your-railway-url.railway.app
   MONGODB_URI=mongodb+srv://ayushkarnewar1729_db_user:ZD4ov504HhsP5gGM@demo3.xbqkzmh.mongodb.net/tasksDB?appName=Demo3
   ```

6. Click "Deploy"

---

## 🔧 STEP 3: Update Backend CORS

After getting Vercel URL, update Railway:

1. Go to Railway dashboard
2. Add environment variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Redeploy (Railway auto-redeploys)

---

## ✅ STEP 4: Test Deployment

1. Open Vercel URL: `https://your-app.vercel.app`
2. Create a room
3. Open in incognito/another browser
4. Test:
   - ✅ Room creation
   - ✅ Multiplayer join
   - ✅ Card dealing
   - ✅ Trump selection
   - ✅ Card playing
   - ✅ Chat functionality
   - ✅ Round completion
   - ✅ Match dashboard

---

## 🐛 Troubleshooting

### "Connection failed"
- Check `NEXT_PUBLIC_SOCKET_URL` in Vercel
- Verify backend is running (visit Railway URL)
- Check Railway logs

### "CORS error"
- Add `FRONTEND_URL` to Railway
- Ensure no trailing slashes in URLs

### "MongoDB connection failed"
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access (allow 0.0.0.0/0)

---

## 📊 Deployment URLs

After deployment, you'll have:

- **Frontend**: `https://mendhikot-io.vercel.app`
- **Backend**: `https://mendhikot-io-production.up.railway.app`
- **MongoDB**: Already configured ✅

---

## 💰 Cost

- **Vercel**: FREE (Hobby plan)
- **Railway**: $5/month (or FREE trial)
- **MongoDB Atlas**: FREE (512MB)

**Total**: ~$5/month

---

## 🎮 Share Your Game

Once deployed, share:
```
🎴 Play Mendhikot Online!
https://mendhikot-io.vercel.app

- 4-player multiplayer card game
- Real-time gameplay
- Mobile responsive
- Free to play!
```

---

## 📝 Quick Commands Reference

```bash
# Local development
npm run dev

# Build
npm run build

# Deploy to Vercel
vercel --prod

# Check Vercel deployments
vercel ls

# View logs
vercel logs

# Check Railway status
# Visit: https://railway.app/dashboard
```

---

## 🚀 Ready to Deploy!

**Start with STEP 1** (Backend to Railway), then **STEP 2** (Frontend to Vercel).

The entire process takes about 10-15 minutes.

Good luck! 🎉
