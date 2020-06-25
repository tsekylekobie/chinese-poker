const Game = require("../models/game-model");
const { STAGES } = require("../../common/constants");

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;
  const creator = req.body.creator;

  Game.model.findOne({ gameId }, (err, existingGame) => {
    if (err) return next(err);

    if (existingGame)
      return res.status(422).send({ error: "Game already exists" });

    const newGame = new Game.model({
      gameId,
      names: creator,
      gameStatus: STAGES.WAIT,
      round: 0,
      prevRounds: [],
    });

    newGame.save();
    res.json(newGame);
  });
};
