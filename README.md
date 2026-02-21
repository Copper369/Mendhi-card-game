# Mendhikot Online - Multiplayer Card Game 🎴

A real-time multiplayer implementation of the Indian card game Mendhikot (32-card variant) with stunning Ludo King-style UI.

![Game Preview](https://img.shields.io/badge/Status-Ready%20to%20Deploy-success)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.6-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green)

## 🎮 Features

### Core Gameplay
- ✅ 4-player online multiplayer with WebSocket synchronization
- ✅ Automatic AI players fill empty seats
- ✅ Real-time chat with floating icon (individual control)
- ✅ Server-authoritative game logic
- ✅ Team-based scoring (opposite players are partners)
- ✅ Responsive UI with animated card play

### Game Mechanics
- ✅ Trump suit selection (alternates between teams)
- ✅ Must capture ALL 4 tens to win (any split = draw)
- ✅ Early round termination (winner or dismissed)
- ✅ 5-round match system
- ✅ Round-based scoring with celebrations

### UI/UX Enhancements
- ✅ Circular Ludo King-style game table
- ✅ Animated card symbols floating in background
- ✅ Smooth card hover effects with lift and scale
- ✅ Professional gold borders and gradients
- ✅ Team color coding (Blue/Red)
- ✅ Celebration animations with confetti
- ✅ Card dealing animations
- ✅ Floating chat icon with unread counter

## 🚀 Quick Deploy

### One-Click Deploy Options

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mendhikot)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Manual Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📋 Prerequisites

- Node.js 14.x or higher
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/mendhikot.git
cd mendhikot
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
MONGODB_URI=mongodb://localhost:27017/mendhikot
PORT=3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

4. **Start development servers:**
```bash
npm run dev
```

5. **Open your browser:**
```
http://localhost:3000
```

## 🎯 Game Rules

- **Deck**: 32 cards (7, 8, 9, 10, J, Q, K, A in all four suits)
- **Players**: 4 players, opposite players are partners (Team A vs Team B)
- **Objective**: Capture ALL 4 tens to win the round
- **Card Ranking**: A > K > Q > J > 10 > 9 > 8 > 7

### Trump Selection
- Teams alternate choosing trump suit each round
- Trump cards beat all non-trump cards
- Can see your cards before choosing

### Winning Conditions
- Team capturing all 4 tens wins the round
- Any split (3-1, 2-2, 1-3) results in a draw
- Round ends early if winner determined or dismissed
- Match consists of 5 rounds
- Team with most round wins takes the match

## 📁 Project Structure

```
├── pages/
│   ├── index.js          # Lobby/room selection
│   ├── game.js           # Game table view
│   └── _app.js
├── components/
│   ├── Card.js           # Card component
│   ├── GameTable.js      # Circular game board
│   ├── ChatPanel.js      # Floating chat interface
│   ├── TrumpSelector.js  # Trump selection UI
│   ├── Celebration.js    # Victory animations
│   ├── AnimatedBackground.js # Floating card symbols
│   ├── TenCards.js       # Captured tens display
│   ├── Lobby.js          # Pre-game lobby
│   ├── RoundResult.js    # Round completion screen
│   └── MatchDashboard.js # Final match statistics
├── store/
│   └── gameStore.js      # Zustand state management
├── server/
│   ├── index.js          # Express + Socket.IO server
│   ├── game/
│   │   ├── deck.js       # Deck creation and shuffling
│   │   └── gameManager.js # Game state management
│   └── models/
│       └── Room.js       # MongoDB room schema
└── styles/
    └── globals.css       # Tailwind styles
```

## 🔌 Socket Events

### Client → Server
- `join_room` - Join a game room
- `player_ready` - Mark player as ready
- `choose_trump` - Select trump suit
- `play_card` - Play a card from hand
- `chat_message` - Send chat message
- `reset_game` - Reset after match

### Server → Client
- `game_update` - Full game state sync
- `game_started` - Game begins
- `dealing_cards` - Card dealing animation
- `trump_selected` - Trump suit chosen
- `trick_result` - Trick winner announced
- `round_result` - Round winner with stats
- `next_round_start` - New round begins
- `match_dashboard` - Match complete with stats
- `game_reset` - Return to lobby
- `error` - Validation error message

## 🎨 Tech Stack

**Frontend:**
- Next.js 14 (React)
- Tailwind CSS
- Zustand (State Management)
- Socket.IO Client

**Backend:**
- Node.js + Express
- Socket.IO (WebSocket)
- MongoDB + Mongoose

**Deployment:**
- Vercel / Railway / Render / Heroku
- MongoDB Atlas

## 📊 Environment Variables

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/mendhikot

# Server Port
PORT=3001

# Socket.IO URL (for client)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Node Environment
NODE_ENV=development
```

## 🧪 Testing

Test multiplayer by opening multiple browsers:
1. Chrome: http://localhost:3000
2. Firefox: http://localhost:3000
3. Edge: http://localhost:3000
4. Chrome Incognito: http://localhost:3000

## 📝 Scripts

```bash
# Development (both servers)
npm run dev

# Development (client only)
npm run dev:client

# Development (server only)
npm run dev:server

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access

**WebSocket Connection Failed:**
- Check `NEXT_PUBLIC_SOCKET_URL` is correct
- Ensure port 3001 is not blocked
- Verify CORS settings

**Cards Not Dealing:**
- Check browser console for errors
- Verify all players clicked "I'm Ready"
- Refresh the page

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🎮 Play Now

Visit the live demo: [Coming Soon]

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review [GAME_RULES.md](./GAME_RULES.md) for gameplay details

## 🌟 Acknowledgments

- Inspired by Ludo King's UI design
- Traditional Indian card game Mendhikot
- Built with modern web technologies

---

Made with ❤️ for card game enthusiasts

**Ready to deploy!** 🚀 See [DEPLOYMENT.md](./DEPLOYMENT.md) for instructions.
