const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const RANK_VALUES = { '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };

function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, value: RANK_VALUES[rank] });
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function dealCards(deck, numPlayers = 4) {
  const hands = Array(numPlayers).fill(null).map(() => []);
  deck.forEach((card, index) => {
    hands[index % numPlayers].push(card);
  });
  return hands;
}

module.exports = { createDeck, shuffleDeck, dealCards, SUITS, RANKS, RANK_VALUES };
