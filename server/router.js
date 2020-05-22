const createGame = require("./controllers/create-game");
const joinGame = require("./controllers/join-game");

module.exports = function router(app) {
  app.post("/api/create-game", createGame);
  app.post("/api/join-game", joinGame);
};
