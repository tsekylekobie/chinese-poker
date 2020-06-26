const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Player = require("./player-model");

const roundSchema = new Schema({
  gameId: String,
  round: Number,
  players: [Player.schema],
  winner1: [String],
  winner2: [String],
  winner3: [String],
});

const Round = mongoose.model("Round", roundSchema);

module.exports = {
  model: Round,
  schema: roundSchema,
};
