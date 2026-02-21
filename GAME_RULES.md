# Mendhikot Game Rules - Complete Implementation

## Overview
Mendhikot is a 4-player trick-taking card game played in teams with a 32-card deck.

## Setup
- **Deck**: 32 cards (7, 8, 9, 10, J, Q, K, A in all four suits)
- **Players**: 4 players in 2 teams
  - Team A: Player positions 0 and 2 (opposite partners)
  - Team B: Player positions 1 and 3 (opposite partners)
- **Card Ranking**: A (14) > K (13) > Q (12) > J (11) > 10 > 9 > 8 > 7

## Match Structure
- A match consists of 5 rounds
- Each round has 8 tricks (32 cards ÷ 4 players = 8 cards each)
- Team with most round wins takes the match

## Round Flow

### 1. Trump Selection
- At the start of each round, ONE team chooses the trump/lead suit
- Teams alternate trump selection rights:
  - Round 1: Team A chooses
  - Round 2: Team B chooses
  - Round 3: Team A chooses
  - And so on...
- Any player from the choosing team can select from: ♠ Spades / ♥ Hearts / ♦ Diamonds / ♣ Clubs
- The selected suit becomes the trump suit for the entire round
- Trump cards beat all non-trump cards regardless of rank

### 2. Card Play
- Starting player leads the first trick
- Players must follow suit if they have cards of the lead suit
- If unable to follow suit, any card may be played (including trump)
- All 4 players play one card per trick

### 3. Trick Winner Determination
**Priority order:**
1. **Trump cards**: If any trump cards are played, the highest trump wins
2. **Lead suit**: If no trump, highest card of the lead suit wins
3. **Other suits**: Cards of other suits cannot win

**Examples:**
- Lead: 7♥, Played: K♥, 9♥, A♦ (trump) → A♦ wins (trump beats all)
- Lead: 7♥, Played: K♥, 9♥, A♦ (no trump) → K♥ wins (highest of lead suit)
- Lead: 7♥ (trump), Played: K♥, 9♥, A♦ → K♥ wins (highest trump)

### 4. Trick Winner Actions
- Trick winner's team captures all 4 cards from that trick
- Trick winner leads the next trick
- Play continues until all 8 tricks are complete

## Winning Conditions

### Round Winner (Compulsory Objective: FOUR TENS)
The deck contains exactly 4 tens (10♠, 10♥, 10♦, 10♣). Teams must capture these tens.

**Winning criteria:**
1. **Primary**: Team capturing ≥ 3 tens wins the round
2. **Tiebreaker**: If tens split 2-2, team with most tricks won takes the round

**Examples:**
- Team A: 3 tens, Team B: 1 ten → Team A wins
- Team A: 4 tens, Team B: 0 tens → Team A wins
- Team A: 2 tens (5 tricks), Team B: 2 tens (3 tricks) → Team A wins

## Winning Conditions

### Round Winner
- **ONLY** capturing all 4 tens wins the round
- Any split (3-1, 2-2, 1-3) = DRAW (no winner, no score)
- Tricks won do NOT matter
- Draw rounds don't count toward match score

### Match Winner
- After 5 rounds, team with most round wins takes the match
- Draw rounds don't add to either team's score
- Example: Team A wins 2 rounds, Team B wins 1 round, 2 draws → Team A wins match

## Next Round Start
- The team that won the previous round starts the next round
- Starting team gets to choose trump suit (if it's their turn to choose)
- Starting team's first player leads the first trick

## Game State Tracking

### Per Round:
- Trump suit selected
- Tens captured by each team (0-4)
- Tricks won by each team (0-8)
- Cards in each player's hand
- Current trick cards on table

### Per Match:
- Round number (1-5)
- Team A round wins
- Team B round wins
- Total rounds played

## Match Completion

### Dashboard Display:
- Total rounds played
- Team A wins vs Team B wins
- Match winner announcement
- Player names for each team

### Full Reset:
After match dashboard, the system performs a complete reset:
- All game state cleared
- Chat history cleared
- Scores reset to 0
- Round counter reset
- Players return to lobby
- No data persists (server memory only)

## AI Behavior
When AI players fill empty seats, they:
1. **Trump Selection**: Choose a random suit
2. **Card Play**:
   - Follow suit if possible
   - Try to win with highest card if holding lead suit
   - Play lowest card if cannot win
   - Avoid playing tens unless necessary
   - Lead with high non-ten cards when starting trick
3. **Timing**: Simulate human delay (1-2 seconds)

## Server Authority
- All game logic runs on server
- Server validates every move
- Clients only send actions (choose_trump, play_card)
- Server broadcasts state updates to all players
- No client-side rule validation

## Socket Events

### Client → Server:
- `join_room` - Join a game room
- `choose_trump` - Select trump suit
- `play_card` - Play a card from hand
- `chat_message` - Send chat message
- `reset_game` - Reset after match

### Server → Client:
- `game_update` - Full game state sync
- `game_started` - Game begins
- `trump_selected` - Trump suit chosen
- `trick_result` - Trick winner announced
- `round_result` - Round winner with stats
- `next_round_start` - New round begins
- `match_dashboard` - Match complete with stats
- `game_reset` - Return to lobby
- `error` - Validation error message

## UI Features
- Trump selection modal at round start
- Trump suit indicator (always visible)
- Tens captured counter (live updates)
- Round number display
- Team scores (round wins)
- Current turn highlight
- Round result popup (5 seconds)
- Match dashboard (with reset button)
- Team color coding (Blue for Team A, Red for Team B)
- AI player indicators
- Animated card play
- Real-time chat panel

## Strategy Tips
1. **Trump Selection**: Choose suit where your team has high cards
2. **Tens Protection**: Try to capture tens when leading
3. **Trump Usage**: Save trump cards to capture tens
4. **Communication**: Use chat to coordinate with partner
5. **Counting**: Track which tens have been played
6. **Lead Strategy**: Lead with high cards to force out trumps
