# Quick Start Guide

## Your Mendhikot Game is Running! 🎮

### Access the Game
Open **http://localhost:3000** in your browser

### How to Play with Multiple Players

#### Option 1: Same Computer (Easiest for Testing)
1. Open http://localhost:3000 in **Chrome**
2. Open http://localhost:3000 in **Firefox** 
3. Open http://localhost:3000 in **Edge**
4. Open http://localhost:3000 in **Chrome Incognito**

#### Option 2: Multiple Tabs/Windows
1. Open multiple browser windows/tabs
2. Each acts as a separate player

### Game Flow

1. **First Player (Browser 1)**
   - Enter your name
   - Click "Create Room" tab
   - Enter room name (optional)
   - Click "Create New Room"
   - You'll see 1 human + 3 AI players

2. **Other Players (Browser 2, 3, 4)**
   - Enter your name
   - Click "Join Room" tab
   - Click "Refresh" to see available rooms
   - Click "Join" on the room
   - AI players are replaced as humans join

3. **Game Starts Automatically**
   - When 4 players are ready (human or AI)
   - Cards are dealt
   - First player's turn is highlighted

### Features Implemented ✅

- ✅ Create/Join rooms with tabs
- ✅ Real-time multiplayer sync
- ✅ Auto-fill with AI players
- ✅ Trump suit selection by teams (alternating)
- ✅ Trump dominance in trick winning
- ✅ Compulsory tens tracking (4 tens per round)
- ✅ Round-based gameplay with winner tracking
- ✅ Match system (5 rounds)
- ✅ Round result screens
- ✅ Match dashboard with statistics
- ✅ Full game reset after match
- ✅ Live chat during game
- ✅ Server-side validation
- ✅ Follow suit rules
- ✅ Team scoring (opposite partners)
- ✅ AI plays automatically (including trump selection)
- ✅ Animated card play
- ✅ Turn indicators
- ✅ Score tracking

### Game Rules

- **Deck**: 32 cards (7-Ace, all suits)
- **Players**: 4 (Team A: positions 0,2 vs Team B: positions 1,3)
- **Objective**: Capture ALL 4 tens to win the round (any split = draw)
- **Trump Selection**: Teams alternate choosing trump suit each round
- **Trump dominates**: Trump cards beat all non-trump cards
- **Must follow suit** if you have cards of the lead suit
- **Winning**: Team with ≥3 tens wins round; if 2-2, most tricks wins
- **Match**: 5 rounds total, team with most round wins takes match

### Troubleshooting

**Can't see other players?**
- Make sure you're joining the same room
- Click "Refresh" in the Join Room tab
- Check browser console for errors

**Game stuck loading?**
- Refresh the page
- Check that server is running (you should see it in terminal)

**AI not playing?**
- This is normal - AI plays after 1-2 second delay
- Wait for the turn indicator to change

### Tech Stack
- Frontend: Next.js + React + Tailwind CSS
- Backend: Node.js + Express + Socket.IO
- Database: MongoDB (for persistence)
- State: Zustand

Enjoy your game! 🎴
