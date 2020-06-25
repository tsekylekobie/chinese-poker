const express = require("express");
const getPlayer = require("./controllers/get-player");
const getGame = require("./controllers/get-game");
const createGame = require("./controllers/create-game");
const joinGame = require("./controllers/join-game");
const startRound = require("./controllers/start-round");
const submitHands = require("./controllers/submit-hands");
const submitJoker = require("./controllers/submit-joker");
const submitPrediction = require("./controllers/submit-prediction");

const router = express.Router();
router.get("/api/get-player", getPlayer);
router.get("/api/get-game", getGame);
router.post("/api/create-game", createGame);
router.post("/api/join-game", joinGame);
router.post("/api/start-round", startRound);
router.post("/api/submit-hands", submitHands);
router.post("/api/submit-joker", submitJoker);
router.post("/api/submit-prediction", submitPrediction);

module.exports = router;
