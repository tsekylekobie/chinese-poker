import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { Container, Grid, Button, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab/";
import openSocket from "socket.io-client";

import { createGame, joinGame } from "../actions/index";

const socket = openSocket("http://localhost:8080");

// Error messages
const NAME_ERR = "Please enter a name";
const GAMEID_ERR = "Invalid GameID";

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: "" };
    this.setGameIdRef = React.createRef();
    this.getName = props.getName;
    this.theme = props.theme;
    this.joinRoom = this.joinRoom.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
  }

  onSuccess(data) {
    if (data.error) {
      this.setState({ error: data.error });
    } else {
      socket.emit("joinGame", data.gameId);
      this.props.history.push(`/game/${data.gameId}`);
    }
  }

  joinRoom() {
    const gameId = this.setGameIdRef.current;
    const name = this.getName();
    if (!name) {
      this.setState({ error: NAME_ERR });
    } else if (!gameId.value) {
      this.setState({ error: GAMEID_ERR });
    } else {
      joinGame(gameId.value, name, this.onSuccess);
    }
  }

  createRoom() {
    const name = this.getName();
    if (!name) {
      this.setState({ error: NAME_ERR });
    } else {
      createGame(name, this.onSuccess);
    }
  }

  render() {
    return (
      <ThemeProvider theme={this.theme}>
        <Container className="root">
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            {this.state.error && (
              <Alert severity="error">{this.state.error}</Alert>
            )}
            <Grid
              container
              className="control"
              direction="row"
              justify="center"
              alignItems="center"
            >
              <TextField
                ref={this.setGameIdRef}
                label="Game ID"
                variant="outlined"
              />
            </Grid>
            <Grid
              container
              className="control"
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                className="button"
                color="primary"
                onClick={this.createRoom}
              >
                Create room
              </Button>
              <Button
                variant="contained"
                className="button"
                color="primary"
                onClick={this.joinRoom}
              >
                Join room
              </Button>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    );
  }
}
