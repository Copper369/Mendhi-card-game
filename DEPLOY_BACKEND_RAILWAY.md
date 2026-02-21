# Deploy Backend to Railway - Quick Guide

## Step-by-Step Instructions

### 1. Push to GitHub (if not already done)

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/mendhikot-io.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Railway

1. Go to: https://railway.app/
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub
5. Select your `mendhikot-io` repository
6. Railway will auto-detect it as a Node.js app

### 3. Configure Environment Variables

In Railway dashboard:
1. Click on your service
2. Go to "Variables" tab
3. Add these variables:

```
MONGODB_URI=mongodb+srv://ayushkarnewar1729_db_user:ZD4ov504HhsP5gGM@demo3.xbqkzmh.mongodb.net/tasksDB?appName=Demo3
PORT=3001
```

### 4. Configure Start Command

1. Go to "Settings" tab
2. Find "Start Command"
3. Set it to: `node server/index.js`
4. Click "Save"

### 5. Deploy

Railway will automatically deploy. Wait for it to complete.

### 6. Get Your Backend URL

1. Go to "Settings" tab
2. Find "Domains" section
3. Click "Generate Domain"
4. Copy the URL (e.g., `https://mendhikot-io-production.up.railway.app`)

### 7. Update Frontend Environment

Now use this URL for your frontend deployment:
```
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.railway.app
```

---

## Alternative: Deploy Backend to Render

If you prefer Render:

1. Go to: https://render.com/
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - Name: `mendhikot-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server/index.js`
5. Add environment variables (same as above)
6. Click "Create Web Service"

---

## After Backend is Deployed

Run this command to deploy frontend:
```bash
vercel --prod
```

When prompted for environment variables, use:
- `NEXT_PUBLIC_SOCKET_URL`: Your Railway/Render backend URL
- `MONGODB_URI`: Your MongoDB connection string
