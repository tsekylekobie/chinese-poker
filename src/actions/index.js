import axios from "axios";
import { generate } from "shortid";

export function createGame(name, callback) {
  const gameId = generate();

  const request = axios
    .post("/api/create-game", {
      gameId,
      creator: [name],
    })
    .then((res) => {
      if (res.status === 200) {
        callback(res.data.gameId);
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
