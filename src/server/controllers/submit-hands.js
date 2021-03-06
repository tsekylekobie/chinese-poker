const _ = require("lodash");
const Game = require("../models/game-model");
const Player = require("../models/player-model");
const { STAGES } = require("../../common/constants");

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;
  const playerName = req.body.playerName;
  const { hand, hand1, hand2, hand3 } = req.body.submitted;

  Player.model.findOneAndUpdate(
    { gameId, playerName: playerName },
    { hand, hand1, hand2, hand3, submitted: true },
    { new: true },
    (err, player) => {
      if (err) return next(err);
      if (!player)
        return res.status(422).send({
          error: `Player ${playerName} does not exist in game ${gameId}`,
        });

      Game.model.findOne({ gameId, names: playerName }, (err, game) => {
        if (err) return next(err);
        const index = _.findIndex(game.names, (u) => _.isEqual(u, playerName));
        game.players[index] = player;

        let allSubmitted = true;
        for (let i = 0; i < game.players.length; i++) {
          if (!game.players[i].submitted) allSubmitted = false;
        }

        // if all players submitted, then advance to joker round
        if (allSubmitted) {
          game.gameStatus = STAGES.JOKER;
          for (let i = 0; i < game.players.length; i++) {
            // reset flag so we can use for future rounds
            game.players[i].submitted = false;
          }
        }

        game.save();
        res.json(game);
      });
    }
  );
};
