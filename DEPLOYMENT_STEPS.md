# Deployment Steps for Mendhikot.io

## Overview
This application requires TWO separate deployments:
1. **Frontend (Next.js)** → Vercel
2. **Backend (Socket.IO Server)** → Railway/Render/Heroku

## Step 1: Deploy Backend (Socket.IO Server)

### Option A: Railway (Recommended)

1. Go to https://railway.app/
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect the Node.js app
6. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://ayushkarnewar1729_db_user:ZD4ov504HhsP5gGM@demo3.xbqkzmh.mongodb.net/tasksDB?appName=Demo3
   PORT=3001
   ```
7. Deploy! Railway will give you a URL like: `https://your-app.railway.app`
8. **IMPORTANT**: Copy this URL for Step 2

### Option B: Render

1. Go to https://render.com/
2. Sign up/Login
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Name: mendhikot-backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server/index.js`
6. Add Environment Variables (same as above)
7. Deploy and copy the URL

## Step 2: Deploy Frontend (Next.js to Vercel)

### Using Vercel CLI (Current Method)

1. Open terminal in project directory
2. Run: `vercel`
3. Follow prompts:
   - Set up and deploy? **Y**
   - Which scope? (Select your account)
   - Link to existing project? **N**
   - Project name? **mendhikot-io**
   - Directory? **./** (press Enter)
   - Override settings? **N**

4. After deployment, set environment variables:
   ```bash
   vercel env add MONGODB_URI
   # Paste: mongodb+srv://ayushkarnewar1729_db_user:ZD4ov504HhsP5gGM@demo3.xbqkzmh.mongodb.net/tasksDB?appName=Demo3
   
   vercel env add NEXT_PUBLIC_SOCKET_URL
   # Paste: https://your-backend-url.railway.app (from Step 1)
   ```

5. Redeploy with environment variables:
   ```bash
   vercel --prod
   ```

### Using Vercel Dashboard (Alternative)

1. Go to https://vercel.com/
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
5. Add Environment Variables:
   - `MONGODB_URI`: (your MongoDB connection string)
   - `NEXT_PUBLIC_SOCKET_URL`: (your backend URL from Step 1)
6. Click "Deploy"

## Step 3: Update Backend CORS

After getting your Vercel URL, update the backend CORS settings:

1. Go to your backend deployment (Railway/Render)
2. Add environment variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. The server/index.js already has CORS configured to accept this

## Step 4: Test Your Deployment

1. Open your Vercel URL: `https://your-app.vercel.app`
2. Create a room
3. Open in another browser/incognito to test multiplayer
4. Check that:
   - ✅ UI loads correctly
   - ✅ Can create/join rooms
   - ✅ Cards are dealt
   - ✅ Can play cards
   - ✅ Chat works
   - ✅ Game logic works

## Troubleshooting

### Issue: "Connection failed" or "Loading game..."
- Check that NEXT_PUBLIC_SOCKET_URL is set correctly in Vercel
- Verify backend is running (visit backend URL in browser)
- Check backend logs for errors

### Issue: "CORS error"
- Make sure FRONTEND_URL is set in backend environment
- Verify the URLs match exactly (no trailing slashes)

### Issue: "MongoDB connection failed"
- Verify MONGODB_URI is correct
- Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Ensure database user has read/write permissions

## Quick Deploy Commands

```bash
# Build and test locally
npm run build
npm run dev

# Deploy to Vercel
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

## Environment Variables Summary

### Backend (Railway/Render)
```
MONGODB_URI=mongodb+srv://ayushkarnewar1729_db_user:ZD4ov504HhsP5gGM@demo3.xbqkzmh.mongodb.net/tasksDB?appName=Demo3
PORT=3001
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```
MONGODB_URI=mongodb+srv://ayushkarnewar1729_db_user:ZD4ov504HhsP5gGM@demo3.xbqkzmh.mongodb.net/tasksDB?appName=Demo3
NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app
```

## Post-Deployment

1. Share your game URL: `https://your-app.vercel.app`
2. Monitor usage in Vercel and Railway dashboards
3. Check logs if issues occur
4. Scale backend if needed (Railway auto-scales)

## Cost Estimate

- **Vercel**: Free tier (100GB bandwidth, unlimited requests)
- **Railway**: $5/month (500 hours, then pay-as-you-go)
- **MongoDB Atlas**: Free tier (512MB storage)
- **Total**: ~$5/month or FREE if using Render free tier

---

**Ready to deploy!** Start with Step 1 (Backend) then Step 2 (Frontend).
