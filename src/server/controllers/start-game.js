const { RANKS, SUITS, STAGES } = require("../../common/constants");

const Game = require("../models/game-model");
const Player = require("../models/player-model");
const Card = require("../models/card-model");
const Deck = require("card-deck");

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;

  Game.model.findOneAndUpdate(
    { gameId },
    { gameStatus: STAGES.PLAY },
    { new: true },
    (err, existingGame) => {
      if (err) {
        return next(err);
      }

      if (!existingGame) {
        return res.status(422).send({ error: "Game does not exist" });
      }

      // Create a deck
      const cards = [];
      for (let i = 0; i < RANKS.length; i++) {
        for (let j = 0; j < SUITS.length; j++) {
          cards.push(
            new Card.model({
              name: RANKS[i] + SUITS[j][0],
              suit: SUITS[j],
              value: RANKS[i],
            })
          );
        }
      }
      const newDeck = new Deck(cards).shuffle();

      // Distribute cards and create players
      for (let i = 0; i < existingGame.names.length; i++) {
        const player = new Player.model({
          gameId,
          playerName: existingGame.names[i],
          score: 0,
          jokersRemaining: 3,
          submitted: false,
          hand: newDeck.draw(13),
        });
        player.save();
        existingGame.players[i] = player;
      }

      existingGame.round += 1;
      existingGame.save();
      res.json(existingGame);
    }
  );
};
