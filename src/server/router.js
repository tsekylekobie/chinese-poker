const getPlayer = require("./controllers/get-player");
const getGame = require("./controllers/get-game");
const createGame = require("./controllers/create-game");
const joinGame = require("./controllers/join-game");
const startGame = require("./controllers/start-game");

module.exports = function router(app) {
  app.post("/api/get-player", getPlayer);
  app.post("/api/get-game", getGame);
  app.post("/api/create-game", createGame);
  app.post("/api/join-game", joinGame);
  app.post("/api/start-game", startGame);
};
