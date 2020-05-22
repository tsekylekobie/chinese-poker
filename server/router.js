const createGame = require("./controllers/create-game");

module.exports = function router(app) {
  app.post("/api/create-game", createGame);
};
