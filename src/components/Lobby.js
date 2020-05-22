import React from "react";
import { v4 as uuidv4 } from "uuid";

import { createGame } from "../actions/index";

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = { uuid: localStorage.getItem("uuid") };
    if (!this.state.uuid) {
      this.state.uuid = uuidv4();
      localStorage.setItem("uuid", this.state.uuid);
    }
  }

  redirect = (gameId) => {
    this.props.history.push(`/game/${gameId}`);
  };

  render() {
    return (
      <div>
        <button onClick={() => createGame(this.state.uuid, this.redirect)}>
          Create room
        </button>
      </div>
    );
  }
}
