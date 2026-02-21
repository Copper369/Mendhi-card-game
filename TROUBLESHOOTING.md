# 🔧 Troubleshooting Guide

## Common Deployment Issues

### 1. "Connection failed" or "Loading game..."

**Cause**: Frontend can't connect to backend

**Solutions**:
```bash
# Check if NEXT_PUBLIC_SOCKET_URL is set correctly
vercel env ls

# If not set or wrong, update it:
vercel env rm NEXT_PUBLIC_SOCKET_URL production
vercel env add NEXT_PUBLIC_SOCKET_URL production
# Paste your Railway URL

# Redeploy
vercel --prod
```

**Verify**:
- Visit your Railway URL directly - should show "Server running"
- Check Railway logs for errors
- Ensure URL has no trailing slash

---

### 2. CORS Error in Browser Console

**Cause**: Backend not allowing frontend domain

**Solution**:
1. Go to Railway dashboard
2. Add environment variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Railway will auto-redeploy

**Verify**:
- Check Railway logs show "CORS enabled for: your-vercel-url"
- Refresh your frontend

---

### 3. MongoDB Connection Failed

**Cause**: Database credentials or network access

**Solutions**:

1. **Check MongoDB Atlas**:
   - Go to: https://cloud.mongodb.com/
   - Network Access → Add IP: `0.0.0.0/0` (allow all)
   - Database Access → Verify user exists

2. **Verify Connection String**:
   ```
   MONGODB_URI=mongodb+srv://ayushkarnewar1729_db_user:ZD4ov504HhsP5gGM@demo3.xbqkzmh.mongodb.net/tasksDB?appName=Demo3
   ```

3. **Test Connection**:
   - Check Railway logs for "MongoDB connected"
   - If error, verify username/password

---

### 4. Build Failed on Vercel

**Cause**: Missing dependencies or build errors

**Solution**:
```bash
# Test build locally first
npm run build

# If successful, check Vercel logs
vercel logs

# Common fixes:
npm install
git add .
git commit -m "Fix dependencies"
git push
vercel --prod
```

---

### 5. Cards Not Displaying / UI Broken

**Cause**: CSS not loading or build issue

**Solutions**:

1. **Clear Vercel cache**:
   ```bash
   vercel --prod --force
   ```

2. **Check browser console** for errors

3. **Verify Tailwind CSS**:
   - Check `tailwind.config.js` exists
   - Check `postcss.config.js` exists
   - Rebuild: `npm run build`

---

### 6. Socket.IO Connection Timeout

**Cause**: Railway service sleeping or wrong URL

**Solutions**:

1. **Wake up Railway**:
   - Visit your Railway URL directly
   - Wait 30 seconds for service to start

2. **Check Railway logs**:
   - Look for "Server running on port 3001"
   - Look for "MongoDB connected"

3. **Verify environment variable**:
   ```bash
   # Should match your Railway domain exactly
   vercel env ls
   ```

---

### 7. Game Stuck on "Waiting for game to start"

**Cause**: Game state issue or player not ready

**Solutions**:

1. **Refresh the page**
2. **Check all players clicked "I'm Ready"**
3. **Check browser console** for errors
4. **Restart game**:
   - Create new room
   - Join with fresh browsers

---

### 8. Chat Not Working

**Cause**: Socket.IO connection issue

**Solutions**:

1. **Check connection**:
   - Open browser console
   - Look for "connected" message
   - Check for socket errors

2. **Verify backend**:
   - Check Railway logs
   - Look for "chat_message" events

3. **Test**:
   - Send message
   - Check if it appears in sender's chat
   - Check if it appears in other player's chat

---

### 9. Railway Deployment Failed

**Cause**: Build or start command issue

**Solutions**:

1. **Check Railway logs** for specific error

2. **Verify package.json**:
   ```json
   {
     "scripts": {
       "start": "node server/index.js"
     }
   }
   ```

3. **Check Railway settings**:
   - Start Command: `node server/index.js`
   - Build Command: (leave empty, Railway auto-detects)

---

### 10. Environment Variables Not Working

**Cause**: Not set for correct environment

**Solutions**:

```bash
# List all environment variables
vercel env ls

# Add for production specifically
vercel env add VARIABLE_NAME production

# Remove and re-add if wrong
vercel env rm VARIABLE_NAME production
vercel env add VARIABLE_NAME production

# Redeploy after changes
vercel --prod
```

---

## Quick Diagnostic Commands

```bash
# Check Vercel deployment status
vercel ls

# View Vercel logs
vercel logs

# Check environment variables
vercel env ls

# Force rebuild
vercel --prod --force

# Test local build
npm run build
npm run dev
```

---

## Still Having Issues?

1. **Check Railway Logs**:
   - Railway Dashboard → Your Service → Logs

2. **Check Vercel Logs**:
   - Vercel Dashboard → Your Project → Deployments → Latest → Logs

3. **Check Browser Console**:
   - F12 → Console tab
   - Look for red errors

4. **Test Locally**:
   ```bash
   npm run dev
   # If works locally, issue is with deployment
   ```

---

## Emergency Reset

If everything is broken:

```bash
# 1. Delete deployments
vercel rm mendhikot-io --yes

# 2. Rebuild locally
rm -rf .next node_modules
npm install
npm run build

# 3. Redeploy
vercel --prod

# 4. Re-add environment variables
vercel env add NEXT_PUBLIC_SOCKET_URL production
vercel env add MONGODB_URI production
```

---

## Contact Support

- **Vercel**: https://vercel.com/support
- **Railway**: https://railway.app/help
- **MongoDB**: https://www.mongodb.com/support

---

**Most issues are solved by**:
1. Checking environment variables
2. Verifying URLs (no trailing slashes)
3. Checking logs
4. Redeploying with `vercel --prod`
