const Game = require("../models/game-model");
const { STAGES } = require("../../common/constants");

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;
  const userJoined = req.body.userJoined;

  Game.model.findOne({ gameId }, (err, existingGame) => {
    if (err) {
      return next(err);
    }

    if (!existingGame) {
      res.json({ error: "Invalid GameID" });
    } else if (existingGame.gameStatus !== STAGES.WAIT) {
      res.json({ error: "Game has already started" });
    } else if (existingGame.names.length < 4) {
      if (!existingGame.names.includes(userJoined)) {
        Game.model.findOneAndUpdate(
          { gameId },
          { $addToSet: { names: userJoined } },
          { new: true },
          (err, newGame) => {
            if (err) {
              return next(err);
            }
            newGame.save();
            res.json(newGame);
          }
        );
      } else {
        res.json({ error: "That name is already taken" });
      }
    } else {
      res.json({ error: "Room is full" });
    }
  });
};
