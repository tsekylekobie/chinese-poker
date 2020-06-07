const Player = require("../models/player-model");

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;
  const playerName = req.body.playerName;
  const submitted = req.body.submitted;

  Player.model.findOne({ gameId, playerName }, (err, player) => {
    if (err) return next(err);

    if (!player)
      return res.status(422).send({ error: "Player does not exist" });

    player.hand = submitted.hand;
    player.hand1 = submitted.hand1;
    player.hand2 = submitted.hand2;
    player.hand3 = submitted.hand3;
    player.submitted = true;

    player.save();
    res.json(player);
  });
};
