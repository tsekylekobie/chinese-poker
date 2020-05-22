import axios from "axios";
import { generate } from "shortid";

export function createGame(name) {
  const gameId = generate();

  const request = axios
    .post("/api/create-game", {
      gameId,
      creator: [name],
    })
    .then((response) => response)
    .catch((error) => {
      throw error;
    });

  return {
    type: "CREATE_GAME",
    payload: request,
  };
}
