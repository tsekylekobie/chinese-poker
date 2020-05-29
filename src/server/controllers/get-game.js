const Game = require("../models/game-model");

module.exports = (req, res, next) => {
  Game.model.findOne({ gameId: req.body.gameId }, (err, game) => {
    if (err) {
      return next(err);
    }

    if (!game) {
      return res.status(422).send({ error: "Game does not exist" });
    }

    res.json(game);
  });
};
