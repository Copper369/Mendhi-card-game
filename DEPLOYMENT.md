# Deployment Guide 🚀

## Quick Deploy Options

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel
```

4. **Set Environment Variables:**
```bash
vercel env add MONGODB_URI
vercel env add NEXT_PUBLIC_SOCKET_URL
```

5. **Deploy to Production:**
```bash
vercel --prod
```

### Option 2: Railway

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login:**
```bash
railway login
```

3. **Initialize:**
```bash
railway init
```

4. **Add MongoDB:**
```bash
railway add mongodb
```

5. **Deploy:**
```bash
railway up
```

### Option 3: Heroku

1. **Install Heroku CLI:**
```bash
npm install -g heroku
```

2. **Login:**
```bash
heroku login
```

3. **Create App:**
```bash
heroku create mendhikot-game
```

4. **Add MongoDB:**
```bash
heroku addons:create mongolab:sandbox
```

5. **Deploy:**
```bash
git push heroku main
```

### Option 4: DigitalOcean App Platform

1. **Connect GitHub Repository**
2. **Select Node.js**
3. **Add Environment Variables:**
   - `MONGODB_URI`
   - `NEXT_PUBLIC_SOCKET_URL`
   - `PORT=3001`
4. **Deploy**

### Option 5: Render

1. **Create New Web Service**
2. **Connect Repository**
3. **Build Command:** `npm install && npm run build`
4. **Start Command:** `npm start`
5. **Add Environment Variables**

## Environment Variables

Required for all deployments:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3001
NEXT_PUBLIC_SOCKET_URL=https://your-domain.com
```

## MongoDB Setup

### Option 1: MongoDB Atlas (Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for all)
5. Get connection string
6. Replace `<password>` with your password

### Option 2: Railway MongoDB

```bash
railway add mongodb
```

### Option 3: Heroku MongoDB

```bash
heroku addons:create mongolab:sandbox
```

## Build Commands

```bash
# Install dependencies
npm install

# Build Next.js
npm run build

# Start production server
npm start
```

## Port Configuration

The app uses:
- **Frontend:** Port 3000 (Next.js)
- **Backend:** Port 3001 (Socket.IO server)

Make sure your hosting platform supports WebSocket connections!

## Post-Deployment Checklist

- [ ] MongoDB connected successfully
- [ ] Environment variables set
- [ ] WebSocket connections working
- [ ] Can create rooms
- [ ] Can join rooms
- [ ] Cards deal correctly
- [ ] Trump selection works
- [ ] Chat functions properly
- [ ] Game plays smoothly
- [ ] Celebrations show
- [ ] Match dashboard appears

## Troubleshooting

### WebSocket Connection Failed
- Ensure hosting platform supports WebSockets
- Check CORS settings
- Verify NEXT_PUBLIC_SOCKET_URL is correct

### MongoDB Connection Error
- Check connection string format
- Verify IP whitelist includes 0.0.0.0/0
- Confirm database user credentials

### Build Errors
- Run `npm install` to ensure all dependencies
- Check Node.js version (14.x or higher)
- Clear `.next` folder and rebuild

## Custom Domain

After deployment, update:
1. `NEXT_PUBLIC_SOCKET_URL` to your domain
2. Redeploy the application

## Scaling

For production with many users:
- Use MongoDB Atlas M10+ cluster
- Enable Redis for session management
- Use load balancer for multiple instances
- Consider CDN for static assets

## Monitoring

Recommended tools:
- Vercel Analytics
- MongoDB Atlas Monitoring
- Sentry for error tracking
- LogRocket for session replay

## Security

Before going live:
- [ ] Add rate limiting
- [ ] Implement user authentication
- [ ] Sanitize chat messages
- [ ] Add CSRF protection
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags

## Support

For issues:
1. Check server logs
2. Verify environment variables
3. Test MongoDB connection
4. Check WebSocket connectivity

Happy deploying! 🎮🚀
