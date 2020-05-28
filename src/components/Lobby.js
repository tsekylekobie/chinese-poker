import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid, Button, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab/";
import openSocket from "socket.io-client";

import { createGame, joinGame } from "../actions/index";

const socket = openSocket("http://localhost:8080");

// Error messages
const NAME_ERR = "Please enter a name";
const GAMEID_ERR = "Invalid GameID";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
  },
  control: {
    padding: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

function Lobby(props) {
  const classes = useStyles();

  const [error, setError] = useState("");
  const gameIdEl = useRef(null);

  function onSuccess(data) {
    if (data.error) {
      setError(data.error);
    } else {
      socket.emit("action", {
        type: "JOIN_GAME",
        payload: { roomId: data.gameId },
      });
      props.history.push(`/game/${data.gameId}`);
    }
  }

  function createRoom() {
    const name = props.getName();
    if (!name) {
      setError(NAME_ERR);
    } else {
      createGame(name, onSuccess);
    }
  }

  function joinRoom() {
    const gameId = gameIdEl.current;
    const name = props.getName();
    if (!name) {
      setError(NAME_ERR);
    } else if (!gameId.value) {
      setError(GAMEID_ERR);
    } else {
      joinGame(gameId.value, name, onSuccess);
    }
  }

  return (
    <Container className={classes.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        {error && <Alert severity="error">{error}</Alert>}
        <Grid
          container
          className={classes.control}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <TextField ref={gameIdEl} label="Game ID" variant="outlined" />
        </Grid>
        <Grid
          container
          className={classes.control}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            className={classes.button}
            color="primary"
            onClick={createRoom}
          >
            Create room
          </Button>
          <Button
            variant="contained"
            className={classes.button}
            color="primary"
            onClick={joinRoom}
          >
            Join room
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Lobby;
