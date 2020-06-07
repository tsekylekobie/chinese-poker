const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Player = require("./player-model");

const gameSchema = new Schema(
  {
    gameId: { type: String, unique: true },
    users: [String],
    gameStatus: Number,
    round: Number,
    player_1: Player.schema,
    player_2: Player.schema,
    player_3: Player.schema,
    player_4: Player.schema,
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);

module.exports = {
  model: Game,
  schema: gameSchema,
};
