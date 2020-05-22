import axios from "axios";
import { generate } from "shortid";

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

export function joinGame(gameId, name, redirect, errorCallback) {
  const request = axios
    .post("/api/join-game", {
      gameId,
      userJoined: name.toLowerCase(),
    })
    .then((res) => {
      if (res.status === 200) {
        redirect(res.data);
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
