import React from "react";
// import { v4 as uuidv4 } from "uuid";

import { createGame, joinGame } from "../actions/index";

// Error messages
const NAME_ERR = "Please enter a name";
const GAMEID_ERR = "Invalid GameID";

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: "" };
    //   this.state = { uuid: localStorage.getItem("uuid") };
    //   if (!this.state.uuid) {
    //     this.state.uuid = uuidv4();
    //     localStorage.setItem("uuid", this.state.uuid);
    //   }
    this.setGameIdRef = React.createRef();
    this.setNameRef = React.createRef();

    this.joinRoom = this.joinRoom.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  redirect(data) {
    data.error
      ? this.setState({ error: data.error })
      : this.props.history.push(`/game/${data.gameId}`);
  }

  joinRoom() {
    const gameId = this.setGameIdRef.current;
    const name = this.setNameRef.current;
    if (!name.value) {
      this.setState({ error: NAME_ERR });
    } else if (!gameId.value) {
      this.setState({ error: GAMEID_ERR });
    } else {
      joinGame(gameId.value, name.value, this.redirect);
    }
  }

  createRoom() {
    const name = this.setNameRef.current;
    if (!name.value) {
      this.setState({ error: NAME_ERR });
    } else {
      createGame(name.value, this.redirect);
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.createRoom}>Create room</button>

        <input ref={this.setGameIdRef} type="text" placeholder="Game ID" />
        <input ref={this.setNameRef} type="text" placeholder="Name" />

        <button onClick={this.joinRoom}>Join room</button>
        <span className="error">{this.state.error}</span>
      </div>
    );
  }
}
