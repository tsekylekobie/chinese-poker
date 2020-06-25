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
router.get("/get-player", getPlayer);
router.get("/get-game", getGame);
router.post("/create-game", createGame);
router.post("/join-game", joinGame);
router.post("/start-round", startRound);
router.post("/submit-hands", submitHands);
router.post("/submit-joker", submitJoker);
router.post("/submit-prediction", submitPrediction);

module.exports = router;
