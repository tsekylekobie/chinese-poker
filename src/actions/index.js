import axios from "axios";
import { generate } from "shortid";

export function getPlayer(gameId, name, callback) {
  const request = axios
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

  return {
    type: "GET_CARDS",
    payload: request,
  };
}

export function createGame(name, callback) {
  const gameId = generate();

  const request = axios
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

  return {
    type: "CREATE_GAME",
    payload: request,
  };
}

export function joinGame(gameId, name, callback) {
  const request = axios
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

  return {
    type: "JOIN_GAME",
    payload: request,
  };
}

export function startGame(gameId, callback) {
  const request = axios
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

  return {
    type: "START_GAME",
    payload: request,
  };
}
