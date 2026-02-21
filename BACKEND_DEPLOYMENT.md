# 🚀 Backend Deployment - Railway

## ✅ Frontend Already Deployed!

Your frontend is live at: **https://mendhikot-gzgirjegp-copper369s-projects.vercel.app**

But it needs the backend to work. Let's deploy it now!

---

## 📦 Deploy Backend to Railway (5 minutes)

### Step 1: Go to Railway

Open: **https://railway.app/new**

### Step 2: Deploy from GitHub

1. Click **"Deploy from GitHub repo"**
2. If not connected, click **"Configure GitHub App"**
3. Select **"Copper369/Mendhi-card-game"**
4. Click **"Deploy Now"**

### Step 3: Add Environment Variables

Once deployed, click on your service, then:

1. Go to **"Variables"** tab
2. Click **"+ New Variable"**
3. Add these:

```
MONGODB_URI
mongodb+srv://ayushkarnewar1729_db_user:ZD4ov504HhsP5gGM@demo3.xbqkzmh.mongodb.net/tasksDB?appName=Demo3

PORT
3001
```

### Step 4: Configure Start Command

1. Go to **"Settings"** tab
2. Scroll to **"Deploy"** section
3. Find **"Start Command"**
4. Enter: `node server/index.js`
5. Click **"Save"**

### Step 5: Generate Domain

1. Still in **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Copy the URL (e.g., `mendhikot-io-production.up.railway.app`)

### Step 6: Update Frontend

Now we need to tell the frontend where the backend is:

```bash
# In your terminal, run:
vercel env add NEXT_PUBLIC_SOCKET_URL production
```

When prompted, paste your Railway URL:
```
https://your-app-name.up.railway.app
```

Then redeploy:
```bash
vercel --prod
```

---

## ✅ Done!

Your game is now fully deployed:
- **Frontend**: https://mendhikot-gzgirjegp-copper369s-projects.vercel.app
- **Backend**: https://your-railway-url.up.railway.app

---

## 🧪 Test Your Deployment

1. Open your Vercel URL
2. Create a room
3. Open in another browser/incognito
4. Join the room
5. Play!

---

## 💡 Alternative: Deploy Backend to Render (Free)

If you prefer Render (has free tier):

1. Go to: **https://render.com/**
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub: **Copper369/Mendhi-card-game**
4. Configure:
   - **Name**: mendhikot-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
5. Add environment variables (same as above)
6. Click **"Create Web Service"**

---

## 🔧 Troubleshooting

If frontend shows "Loading game...":
- Check Railway logs for errors
- Verify NEXT_PUBLIC_SOCKET_URL is set in Vercel
- Make sure Railway service is running

---

**Start with Railway now!** 🚀
