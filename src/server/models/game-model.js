const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Player = require("./player-model");

const gameSchema = new Schema(
  {
    gameId: { type: String, unique: true },
    names: [String],
    gameStatus: Number,
    round: Number,
    players: [Player.schema],
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);

module.exports = {
  model: Game,
  schema: gameSchema,
};
