const Game = require("../models/game-model");
const { STAGES } = require("../../common/constants");

module.exports = (req, res, next) => {
  const { gameId, creator, numRounds, numJokers } = req.body;

  Game.model.findOne({ gameId }, (err, existingGame) => {
    if (err) return next(err);

    if (existingGame)
      return res.status(422).send({ error: "Game already exists" });

    const newGame = new Game.model({
      gameId,
      names: creator,
      gameStatus: STAGES.WAIT,
      round: 0,
      totalRounds: numRounds,
      defaultNumJokers: numJokers,
      prevRounds: [],
    });

    newGame.save();
    res.json(newGame);
  });
};
