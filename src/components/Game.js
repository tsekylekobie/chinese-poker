import React, { createContext, useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab/";

import { AppContext } from "../App";
import Hand from "./Hand";
import { startGame, getPlayer, getGame } from "../actions/index";

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

export const CardsContext = createContext();

function Game(props) {
  const classes = useStyles();
  const { socket, name } = useContext(AppContext);

  const roomId = props.match.params.roomID;
  const [error, setError] = useState("");
  const [gameStart, setGameStart] = useState(false);
  const [hands, setHands] = useState({
    hand1: [],
    hand2: [],
    hand3: [],
    myHand: [],
  });

  const fetchHand = () =>
    getPlayer(roomId, name, (data) => {
      setHands((state) => ({
        ...state,
        myHand: data.hand,
      }));
    });

  useEffect(function getGameInfo() {
    getGame(roomId, (data) => {
      if (data.gameStart) {
        setGameStart(true);
        fetchHand();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on("START_GAME", () => {
      setGameStart(true);
      fetchHand();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function checkHandSizes() {
    const { hand1, hand2, hand3 } = hands;
    return hand1.length === 3 && hand2.length === 5 && hand3.length === 5;
  }

  function submitCards() {
    const { hand1, hand2, hand3 } = hands;
    if (!checkHandSizes()) {
      setError(SIZE_ERR);
    } else {
      socket.emit("submit", hand1, hand2, hand3);
    }
  }

  function startGameHandler() {
    startGame(roomId, () =>
      socket.emit("action", {
        type: "START_GAME",
        payload: { roomId },
      })
    );
  }
  return (
    <Container className={classes.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        {error && <Alert severity="error">{error}</Alert>}
        <CardsContext.Provider value={{ hands, setHands }}>
          <Hand name={"hand1"}>{hands.hand1}</Hand>
          <Hand name={"hand2"}>{hands.hand2}</Hand>
          <Hand name={"hand3"}>{hands.hand3}</Hand>
        </CardsContext.Provider>
        <Grid
          container
          className={classes.control}
          direction="row"
          justify="center"
          alignItems="center"
        >
          {gameStart ? (
            <Button
              variant="contained"
              className={classes.button}
              color="primary"
              onClick={submitCards}
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              className={classes.button}
              color="primary"
              onClick={startGameHandler}
            >
              Start
            </Button>
          )}
        </Grid>
        <CardsContext.Provider value={{ hands, setHands }}>
          <Hand name={"myHand"}>{hands.myHand}</Hand>
        </CardsContext.Provider>
      </Grid>
    </Container>
  );
}

export default Game;
