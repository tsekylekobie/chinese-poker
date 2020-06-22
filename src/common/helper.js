const _ = require("lodash");
const Hand = require("pokersolver").Hand;

// Removes a specific card from ALL hands
function removeCard(hands, name) {
  const removeFromHand = (arr) =>
    _.filter(arr, (x) => !_.isEqual(x.name, name));
  return _.mapValues(hands, (arr) => removeFromHand(arr));
}

// Translate card name to pokersolver format
function getCardName(card) {
  if (card.name.startsWith("10")) return "T" + card.name[-1];
  return card.name;
}

// Return names of winners
function getWinners(hands1, hands2, hands3) {
  const parseHand = (h) => {
    const cardNames = h.map((c) => getCardName(c));
    return Hand.solve(cardNames);
  };
  const h1 = hands1.map(parseHand);
  const h2 = hands2.map(parseHand);
  const h3 = hands3.map(parseHand);

  const w1 = Hand.winners(h1);
  const w2 = Hand.winners(h2);
  const w3 = Hand.winners(h3);

  // Note: can potentially have multiple winners
  const idx1 = w1.map((w) => _.findIndex(h1, w));
  const idx2 = w2.map((w) => _.findIndex(h2, w));
  const idx3 = w3.map((w) => _.findIndex(h3, w));
  return [idx1, idx2, idx3];
}

function calcScore(player, roundInfo) {
  // TODO: calculate penalty
  let score = 0,
    handsWon = 0;
  if (_.indexOf(roundInfo.winner1, player.playerName) !== -1) {
    score += 1;
    handsWon += 1;
  }
  if (_.indexOf(roundInfo.winner2, player.playerName) !== -1) {
    score += 1;
    handsWon += 1;
  }
  if (_.indexOf(roundInfo.winner3, player.playerName) !== -1) {
    score += 1;
    handsWon += 1;
  }
  if (handsWon === player.prediction) {
    score += 1.5;
  }
  console.log("score for", player.playerName, "is", score);
  return { score, handsWon };
}

module.exports = Object.freeze({
  removeCard,
  getWinners,
  calcScore,
});
