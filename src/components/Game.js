import React, { useState } from "react";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab/";
import io from "socket.io-client";

import Hand from "./Hand";
import { startGame as startGameAction, getPlayer } from "../actions/index";

const socket = io.connect("http://localhost:8080", { reconnect: true });

// Error messages
const SIZE_ERR = "Invalid hand size";

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

function Game(props) {
  const classes = useStyles();

  const roomId = props.match.params.roomID;
  const [error, setError] = useState("");
  const [gameStart, setGameStart] = useState(false);
  const [hands, setHands] = useState({
    hand1: [],
    hand2: [],
    hand3: [],
    myHand: [],
  });

  function checkHandSizes() {
    const { hand1, hand2, hand3 } = hands;
    return hand1.length === 3 && hand2.length === 5 && hand3.length === 5;
  }

  function submitCards() {
    const { hand1, hand2, hand3 } = hands;
    if (!checkHandSizes()) {
      setError({ error: SIZE_ERR });
    } else {
      socket.emit("submit", hand1, hand2, hand3);
    }
  }

  // removeCard removes given card from all hands
  // Returns new state
  function removeCard(name) {
    const removeFromHand = (arr) => _.filter(arr, (x) => x.name !== name);
    setHands((prevState) => {
      _.forEach(prevState, (arr) => removeFromHand(arr));
    });
  }

  function startGame() {
    startGameAction(roomId, () =>
      socket.emit("action", {
        type: "START_GAME",
        payload: { roomId },
      })
    );
    setGameStart(true);
  }

  return (
    <Container className={classes.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        {error && <Alert severity="error">{error}</Alert>}
        <Hand name={"hand1"} removeCard={removeCard}>
          {hands.hand1}
        </Hand>
        <Hand name={"hand2"} removeCard={removeCard}>
          {hands.hand2}
        </Hand>
        <Hand name={"hand3"} removeCard={removeCard}>
          {hands.hand3}
        </Hand>
        <Grid
          container
          className="control"
          direction="row"
          justify="center"
          alignItems="center"
        >
          {gameStart ? (
            <Button
              variant="contained"
              className="button"
              color="primary"
              onClick={submitCards}
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              className="button"
              color="primary"
              onClick={startGame}
            >
              Start
            </Button>
          )}
        </Grid>
        <Hand name={"myHand"} removeCard={removeCard}>
          {hands.myHand}
        </Hand>
      </Grid>
    </Container>
  );
}

export default Game;
