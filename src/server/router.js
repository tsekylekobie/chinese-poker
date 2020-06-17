const getPlayer = require("./controllers/get-player");
const getGame = require("./controllers/get-game");
const createGame = require("./controllers/create-game");
const joinGame = require("./controllers/join-game");
const startGame = require("./controllers/start-game");
const submitHands = require("./controllers/submit-hands");
const submitJoker = require("./controllers/submit-joker");
const submitPrediction = require("./controllers/submit-prediction");

module.exports = function router(app) {
  app.get("/api/get-player", getPlayer);
  app.get("/api/get-game", getGame);
  app.post("/api/create-game", createGame);
  app.post("/api/join-game", joinGame);
  app.post("/api/start-game", startGame);
  app.post("/api/submit-hands", submitHands);
  app.post("/api/submit-joker", submitJoker);
  app.post("/api/submit-prediction", submitPrediction);
};
