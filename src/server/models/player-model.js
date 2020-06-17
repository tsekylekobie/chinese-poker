const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Card = require("./card-model");

const playerSchema = new Schema({
  gameId: String,
  playerName: { type: String, lowercase: true },
  score: Number,
  jokersRemaining: Number,
  useJoker: Boolean,
  prediction: Number,
  submitted: Boolean,
  hand: [Card.schema],
  hand1: [Card.schema],
  hand2: [Card.schema],
  hand3: [Card.schema],
});

const Player = mongoose.model("Player", playerSchema);

module.exports = {
  model: Player,
  schema: playerSchema,
};
