const Game = require("../models/game-model");
const _ = require("lodash");

module.exports = (req, res, next) => {
  const gameId = req.query.gameId;
  const playerName = req.query.playerName;

  Game.model.findOne({ gameId }, (err, game) => {
    if (err) return next(err);
    if (!game) return res.status(422).send({ error: "Game does not exist" });

    const index = _.findIndex(game.users, (u) => _.isEqual(u, playerName));
    if (index === -1)
      return res
        .status(422)
        .send({ error: `Player ${playerName} is not in the game` });

    const key = `player_${index + 1}`;
    res.json(game[key]);
  });
};
