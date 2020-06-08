const Game = require("../models/game-model");

module.exports = (req, res, next) => {
  Game.model.findOne({ gameId: req.query.gameId }, (err, game) => {
    if (err) return next(err);
    if (!game) return res.send({ error: "Game does not exist" });

    res.json(game);
  });
};
