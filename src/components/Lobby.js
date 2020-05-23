import React from "react";
import openSocket from "socket.io-client";

import { createGame, joinGame } from "../actions/index";

const socket = openSocket("http://localhost:8080");

// Error messages
const NAME_ERR = "Please enter a name";
const GAMEID_ERR = "Invalid GameID";

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: "", playerName: localStorage.getItem("playerName") };
    this.setGameIdRef = React.createRef();
    this.setNameRef = React.createRef();

    this.joinRoom = this.joinRoom.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
  }

  onSuccess(data) {
    if (data.error) {
      this.setState({ error: data.error });
    } else {
      const name = this.setNameRef.current;
      localStorage.setItem("playerName", name.value);
      socket.emit("joinGame", data.gameId);
      this.props.history.push(`/game/${data.gameId}`);
    }
  }

  joinRoom() {
    const gameId = this.setGameIdRef.current;
    const name = this.setNameRef.current;
    if (!name.value) {
      this.setState({ error: NAME_ERR });
    } else if (!gameId.value) {
      this.setState({ error: GAMEID_ERR });
    } else {
      joinGame(gameId.value, name.value, this.onSuccess);
    }
  }

  createRoom() {
    const name = this.setNameRef.current;
    if (!name.value) {
      this.setState({ error: NAME_ERR });
    } else {
      createGame(name.value, this.onSuccess);
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.createRoom}>Create room</button>

        <input ref={this.setGameIdRef} type="text" placeholder="Game ID" />
        <input
          ref={this.setNameRef}
          type="text"
          placeholder="Name"
          defaultValue={this.state.playerName}
        />

        <button onClick={this.joinRoom}>Join room</button>
        <span className="error">{this.state.error}</span>
      </div>
    );
  }
}
