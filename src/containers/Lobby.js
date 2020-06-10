import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Grid,
  Button,
  TextField,
  Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab/";

import { AppContext } from "../App";
import { createGame, joinGame } from "../actions/index";

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
  const { socket, name } = useContext(AppContext);

  // For displaying errors
  const [error, setError] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setError("");
  };

  const [gameId, setGameId] = useState("");

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
    if (!name) {
      setError(NAME_ERR);
    } else {
      createGame(name, onSuccess);
    }
  }

  function joinRoom() {
    if (!name) {
      setError(NAME_ERR);
    } else if (!gameId) {
      setError(GAMEID_ERR);
    } else {
      joinGame(gameId, name, onSuccess);
    }
  }

  return (
    <Container className={classes.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        {error && (
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={error.length > 0}
            autoHideDuration={5000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="error">
              {error}
            </Alert>
          </Snackbar>
        )}
        <Grid
          container
          className={classes.control}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <TextField
            label="Game ID"
            variant="outlined"
            defaultValue={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
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
