import React from "react";
import { Link } from "react-router-dom";
import openSocket from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

import { createGame } from "../actions/index";

const socket = openSocket("http://localhost:8080");

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    let uuid = localStorage.getItem("uuid");
    if (!uuid) {
      uuid = uuidv4();
      localStorage.setItem("uuid", uuid);
    }
    this.state = {
      uuid,
    };
  }

  joinGame = () => {
    console.log("TODO: join a server room");
    socket.emit("joinRoom", "hello");
  };

  render() {
    return (
      <div>
        <button onClick={() => createGame(this.state.uuid)}>
          <Link to={`/game/${}`}>Create room</Link>
        </button>
        <br />
        {/* <input ref="gameId" type="text" placeholder="Game ID" />
        <button onClick={() => this.joinGame(this.refs.gameId)}>
          <Link to="/game/hello">Join room</Link>
        </button> */}
      </div>
    );
  }
}
