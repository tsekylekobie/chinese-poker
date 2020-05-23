const Game = require("../models/game-model");
const Player = require("../models/player-model");
const Card = require("../models/card-model");
const Deck = require("card-deck");

const cardName = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "J",
  "Q",
  "K",
  "A",
];
const cardSuit = ["Club", "Spade", "Diamond", "Heart"];

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;

  Game.model.findOneAndUpdate(
    { gameId },
    { gameStart: true },
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
      for (let i = 0; i < cardName.length; i++) {
        for (let j = 0; j < cardSuit.length; j++) {
          cards.push(
            new Card.model({
              name: cardName[i] + cardSuit[j][0],
              suit: cardSuit[j],
              value: cardName === "0" ? "10" : cardName[i],
            })
          );
        }
      }
      const newDeck = new Deck(cards).shuffle();

      // Distribute cards to users
      for (let i = 0; i < existingGame.users.length; i++) {
        const player = new Player.model({
          gameId,
          playerName: existingGame.users[i],
          player: `player_${i + 1}`,
          score: 0,
          hand: newDeck.top(13),
        });
        existingGame[player.player] = player;
      }

      existingGame.save();
      res.json(existingGame);
    }
  );
};
