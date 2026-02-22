# Game Rule Update - 5+3 Card Dealing

## ✅ Changes Implemented

### New Card Dealing Flow

**Before:**
- All 8 cards dealt at once
- Trump selected after seeing all cards

**After:**
1. **Initial Deal**: 5 cards dealt to each player
2. **Trump Selection**: Team chooses trump suit based on first 5 cards
3. **Final Deal**: Remaining 3 cards dealt to each player
4. **Game Starts**: Play begins with all 8 cards

---

## 🎮 Updated Game Flow

### Round Start
1. All players click "I'm Ready"
2. **5 cards dealt** to each player (with animation)
3. Trump selection phase begins

### Trump Selection
1. Players see their **first 5 cards only**
2. Team whose turn it is chooses trump suit
3. Trump suit is announced
4. **Remaining 3 cards dealt** (with notification)
5. All players now have 8 cards

### Gameplay
1. Players play cards as normal
2. Round continues until all cards played
3. Winner determined by tens captured

---

## 🔧 Technical Changes

### Backend (server/game/gameManager.js)
- `dealCardsToPlayers()`: Now deals only 5 cards initially
- `chooseTrump()`: Deals remaining 3 cards after trump selection
- `nextRound()`: Updated to use new dealing logic
- Stores `remainingDeck` in game state

### Backend (server/index.js)
- Added `dealing_remaining_cards` event
- Updated `choose_trump` handler to emit new event
- Added 1.5 second delay for card dealing animation

### Frontend (pages/game.js)
- Added handler for `dealing_remaining_cards` event
- Shows notification: "Dealing remaining 3 cards..."
- Updated cleanup to include new event

---

## 🎯 Why This Change?

This matches the traditional Mendhikot rules where:
- Players make strategic trump decisions with limited information
- Trump selection is more challenging and skill-based
- Adds element of surprise with remaining cards
- More authentic gameplay experience

---

## 🧪 Testing

To test the new flow:
1. Start a game with 4 players
2. Click "I'm Ready"
3. Observe: Only 5 cards appear
4. Choose trump suit
5. Observe: Notification appears
6. Observe: 3 more cards are added to hand
7. Play continues normally

---

## 📊 Game State Changes

New field added to `gameState`:
```javascript
{
  remainingDeck: [], // Stores cards to be dealt after trump selection
  // ... other fields
}
```

---

## 🚀 Deployment

- **Frontend**: Deployed to Vercel ✅
- **Backend**: Auto-deploying to Railway ✅
- **Live URL**: https://mendhikot-io.vercel.app

---

## 📝 Notes

- Animation timing: 3 seconds for initial deal, 1.5 seconds for remaining cards
- Trump selection only available to correct team
- All players receive remaining cards simultaneously
- Game state properly synchronized across all clients

---

**Updated**: Now live on production! 🎴
