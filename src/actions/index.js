import axios from "axios";
import { generate } from "shortid";

export function getPlayer(gameId, name, callback) {
  axios
    .post("/api/get-player", { gameId, playerName: name.toLowerCase() })
    .then((res) => {
      if (res.status === 200) {
        callback(res.data);
      }
      return res;
    })
    .catch((error) => {
      throw error;
    });
}

export function getGame(gameId, callback) {
  axios.post("/api/get-game", { gameId }).then((res) => {
    if (res.status === 200) {
      callback(res.data);
    }
    return res;
  });
}

export function createGame(name, callback) {
  const gameId = generate();

  axios
    .post("/api/create-game", {
      gameId,
      creator: [name.toLowerCase()],
    })
    .then((res) => {
      if (res.status === 200) {
        callback(res.data);
      }
      return res;
    })
    .catch((error) => {
      throw error;
    });
}

export function joinGame(gameId, name, callback) {
  axios
    .post("/api/join-game", {
      gameId,
      userJoined: name.toLowerCase(),
    })
    .then((res) => {
      if (res.status === 200) {
        callback(res.data);
      }
      return res;
    })
    .catch((error) => {
      throw error;
    });
}

export function startGame(gameId, callback) {
  axios
    .post("/api/start-game", {
      gameId,
    })
    .then((res) => {
      callback(res.data);
      return res;
    })
    .catch((error) => {
      throw error;
    });
}

export function submitHands(gameId, name, hands, callback) {
  axios
    .post("/api/submit-hands", {
      gameId,
      playerName: name.toLowerCase(),
      submitted: hands,
    })
    .then((res) => {
      callback(res.data);
      return res;
    })
    .catch((error) => {
      throw error;
    });
}
