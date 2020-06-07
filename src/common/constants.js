const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "0", "J", "Q", "K", "A"];
const SUITS = ["Club", "Spade", "Diamond", "Heart"];

// Game statuses
const STAGES = {
  WAIT: 0,
  PLAY: 1,
  SUBMIT: 2,
  JOKER: 3,
  PREDICT: 4,
  RESULT: 5,
  END: 6,
};

module.exports = Object.freeze({
  RANKS,
  SUITS,
  STAGES,
});
