# Final Rule Change: All 4 Tens Required ✅

## The Correct Rule

**A team must capture ALL 4 tens to win a round.**

Any split of tens results in a DRAW (no winner, no score).

## Examples

| Team A Tens | Team B Tens | Result |
|-------------|-------------|---------|
| 4 | 0 | Team A Wins ✓ |
| 0 | 4 | Team B Wins ✓ |
| 3 | 1 | DRAW ✗ |
| 2 | 2 | DRAW ✗ |
| 1 | 3 | DRAW ✗ |

## Implementation Changes

### 1. Server Logic (`calculateRoundWinner`)

```javascript
function calculateRoundWinner(gameState) {
  const teamATens = gameState.tensCaptured.teamA.length;
  const teamBTens = gameState.tensCaptured.teamB.length;
  
  let winner = null;
  let reason;
  
  // ONLY win if team captures ALL 4 tens
  if (teamATens === 4) {
    winner = 'teamA';
    reason = 'Captured all 4 tens!';
  } else if (teamBTens === 4) {
    winner = 'teamB';
    reason = 'Captured all 4 tens!';
  } else {
    // Any split is a draw
    winner = null;
    reason = `Round is a draw (Team A: ${teamATens} tens, Team B: ${teamBTens} tens)`;
  }
  
  return {
    winner,
    reason,
    teamATens: gameState.tensCaptured.teamA,
    teamBTens: gameState.tensCaptured.teamB,
    teamATricks: gameState.tricksWon.teamA,
    teamBTricks: gameState.tricksWon.teamB,
    isDraw: winner === null
  };
}
```

### 2. Score Update Logic

```javascript
if (roundComplete) {
  roundResult = calculateRoundWinner(room.gameState);
  
  // Only update scores if there's a winner (not a draw)
  if (roundResult.winner) {
    room.gameState.lastRoundWinner = roundResult.winner;
    room.gameState.teamScores[roundResult.winner]++;
  } else {
    // Draw - no score change
    if (!room.gameState.lastRoundWinner) {
      room.gameState.lastRoundWinner = 'teamA';
    }
  }
}
```

### 3. UI Changes

**Round Result Screen:**
- Shows "🤝 Round Draw!" for draws
- Displays reason: "Round is a draw (Team A: X tens, Team B: Y tens)"
- Warning message: "A team must capture all 4 tens to win"
- No celebration animation for draws
- Gray background instead of team colors

**Celebration:**
- Only plays when there's a winner
- Skipped entirely for draw rounds

## Match Scoring

- 5 rounds total
- Only rounds with winners count toward score
- Draw rounds don't add to either team's score
- Team with most round wins takes the match

**Example Match:**
- Round 1: Team A wins (4-0) → Score: A=1, B=0
- Round 2: Draw (2-2) → Score: A=1, B=0
- Round 3: Team B wins (4-0) → Score: A=1, B=1
- Round 4: Draw (3-1) → Score: A=1, B=1
- Round 5: Team A wins (4-0) → Score: A=2, B=1
- **Team A wins the match!**

## Why This Rule?

This makes the game more strategic:
- Teams must work together to capture ALL tens
- Can't win with just majority
- Creates more tension and excitement
- Draw rounds add unpredictability
- Encourages aggressive play for tens

## Testing Checklist ✅

Test these scenarios:

1. **Team captures all 4 tens:**
   - [ ] Shows celebration
   - [ ] Team score increases
   - [ ] Round result shows winner

2. **3-1 split:**
   - [ ] Shows "Round Draw"
   - [ ] No celebration
   - [ ] No score change
   - [ ] Warning message displayed

3. **2-2 split:**
   - [ ] Shows "Round Draw"
   - [ ] No celebration
   - [ ] No score change
   - [ ] Warning message displayed

4. **Match with draws:**
   - [ ] Draw rounds don't count in score
   - [ ] Match dashboard shows correct wins
   - [ ] Winner determined by actual wins only

## Summary

The game now correctly implements the rule where:
- ✅ Only capturing all 4 tens wins a round
- ✅ Any split (3-1, 2-2, 1-3) is a draw
- ✅ Draws don't affect team scores
- ✅ UI clearly shows draws vs wins
- ✅ No celebration for draws
- ✅ Match winner based on round wins only
