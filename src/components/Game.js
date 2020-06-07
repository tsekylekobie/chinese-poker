import React, { createContext, useState, useEffect, useContext } from "react";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab/";

import { AppContext } from "../App";
import Hand from "./Hand";
import { startGame, getPlayer, getGame, submitHands } from "../actions/index";
import { STAGES } from "../common/constants";

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
  const [gameStatus, setGameStatus] = useState(STAGES.WAIT);
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
      // If the game has started, then go to the appropriate stage
      if (data.gameStatus !== STAGES.WAIT) {
        setGameStatus(data.gameStatus);
        fetchHand();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on("START_GAME", () => {
      setGameStatus(STAGES.PLAY);
      fetchHand();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function checkHandSizes() {
    const { hand1, hand2, hand3 } = hands;
    return hand1.length === 3 && hand2.length === 5 && hand3.length === 5;
  }

  function submitCards() {
    if (!checkHandSizes()) {
      setError(SIZE_ERR);
    } else {
      submitHands(roomId, name, hands, () => {
        setGameStatus(STAGES.SUBMIT);
        socket.emit("action", {
          type: "SUBMIT_HANDS",
          payload: { name },
        });
      });
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

  // For testing purposes
  function autoSetHands() {
    const { myHand } = hands;
    setHands({
      myHand: [],
      hand1: myHand.slice(0, 3),
      hand2: myHand.slice(3, 8),
      hand3: myHand.slice(8, 13),
    });
  }

  function sortByRank() {
    const sort = (card) => {
      switch (card.name[0]) {
        case "0":
          return 10;
        case "J":
          return 11;
        case "Q":
          return 12;
        case "K":
          return 13;
        case "A":
          return 1;
        default:
          return parseInt(card.name[0]);
      }
    };
    setHands((state) => ({
      ...state,
      myHand: _.sortBy(state.myHand, sort),
    }));
  }

  function sortBySuit() {
    const sort = (card) => card.suit;
    setHands((state) => ({
      ...state,
      myHand: _.sortBy(state.myHand, sort),
    }));
  }

  let bottomDiv;
  switch (gameStatus) {
    case STAGES.WAIT:
      bottomDiv = (
        <Button
          variant="contained"
          className={classes.button}
          color="primary"
          onClick={startGameHandler}
        >
          Start
        </Button>
      );
      break;
    case STAGES.PLAY:
      bottomDiv = (
        <CardsContext.Provider value={{ hands, setHands }}>
          <Hand name={"myHand"}>{hands.myHand}</Hand>
          <Button
            variant="contained"
            className={classes.button}
            color="secondary"
            onClick={sortByRank}
          >
            Sort by Rank
          </Button>
          <Button
            variant="contained"
            className={classes.button}
            color="secondary"
            onClick={sortBySuit}
          >
            Sort by Suit
          </Button>
          <Button
            variant="contained"
            className={classes.button}
            color="primary"
            onClick={submitCards}
          >
            Submit
          </Button>
        </CardsContext.Provider>
      );
      break;
    case STAGES.SUBMIT:
      bottomDiv = <div>Waiting for other players...</div>;
      break;
    case STAGES.JOKER:
    case STAGES.PREDICT:
    case STAGES.RESULT:
    case STAGES.END:
    default:
      bottomDiv = <div />;
  }

  return (
    <Container className={classes.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        {error && <Alert severity="error">{error}</Alert>}
        <Button onClick={autoSetHands}>Set hands</Button>
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
          {bottomDiv}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Game;
