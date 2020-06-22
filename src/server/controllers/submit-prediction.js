const _ = require("lodash");
const Game = require("../models/game-model");
const Player = require("../models/player-model");
const Round = require("../models/round-model");
const { STAGES } = require("../../common/constants");
const { getWinners, calcScore } = require("../../common/helper");

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;
  const playerName = req.body.playerName;
  const prediction = req.body.prediction;

  Player.model.findOneAndUpdate(
    { gameId, playerName: playerName },
    { submitted: true, prediction },
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

        // if all players submitted, then generate results
        if (allSubmitted) {
          const h1 = game.players.map((p) => p.hand1);
          const h2 = game.players.map((p) => p.hand2);
          const h3 = game.players.map((p) => p.hand3);
          const [w1, w2, w3] = getWinners(h1, h2, h3);

          const round = new Round.model({
            gameId: game.gameId,
            round: game.round,
            winner1: w1.map((i) => game.names[i]),
            winner2: w2.map((i) => game.names[i]),
            winner3: w3.map((i) => game.names[i]),
          });

          // distribute points and penalties
          for (let i = 0; i < game.players.length; i++) {
            let p = game.players[i];
            // reset flag so we can use for future rounds
            const { score, handsWon } = calcScore(p, round);
            p.score += score;
            p.handsWon = handsWon;
            p.submitted = false;
            p.save();
          }
          round.players = game.players;

          game.prevRounds.push(round);
          game.gameStatus = STAGES.RESULT;
        }

        game.save();
        res.json(game);
      });
    }
  );
};
