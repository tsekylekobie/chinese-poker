const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Player = require("./player-model");

const roundSchema = new Schema({
  round: Number,
  players: [Player.schema],
});

const Round = mongoose.model("Round", roundSchema);

module.exports = {
  model: Round,
  schema: roundSchema,
};
