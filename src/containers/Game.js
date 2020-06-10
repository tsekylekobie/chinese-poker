import React, { createContext, useState, useEffect, useContext } from "react";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid, Button, Snackbar } from "@material-ui/core";
import { Alert, ToggleButtonGroup, ToggleButton } from "@material-ui/lab/";

import { AppContext } from "../App";
import Hand from "../components/Hand";
import RightSidebar from "../components/RightSidebar";
import LeftSidebar from "../components/LeftSidebar";
import { startGame, getPlayer, getGame, submitHands } from "../actions/index";
import { RANKS, SUITS, STAGES } from "../common/constants";

// Error messages
const SIZE_ERR = "Invalid hand size";

const INIT_SECONDS = 20;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
    maxWidth: "none",
  },
  control: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  toggleButtonGroup: {
    padding: theme.spacing(1),
    color: theme.palette.primary.main,
    borderRadius: 20,
  },
}));

export const CardsContext = createContext();

function Game(props) {
  const classes = useStyles();
  const { socket, name } = useContext(AppContext);

  const roomId = props.match.params.roomID;
  const [gameStatus, setGameStatus] = useState(STAGES.WAIT);
  const [metadata, setMetadata] = useState({});
  const [hands, setHands] = useState({
    hand1: [],
    hand2: [],
    hand3: [],
    myHand: [],
  });

  // For displaying errors
  const [error, setError] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setError("");
  };

  // State variables for joker stage
  const [joker, setJoker] = useState(false);
  const [seconds, setSeconds] = useState(INIT_SECONDS);
  const [highlight, toggleHighlight] = useState("");
  const [newCard, setNewCard] = useState({ suit: SUITS[0], rank: RANKS[0] });

  const updateJoker = (_, newStatus) => {
    if (newStatus !== null) setJoker(newStatus);
  };

  const fetchHand = () =>
    getPlayer(roomId, name, (data) => {
      setHands((state) => ({
        ...state,
        myHand: data.hand,
      }));
    });

  // On component mount
  useEffect(function getGameInfo() {
    getGame(roomId, (data) => {
      setMetadata(data);
      if (data.gameStatus !== STAGES.WAIT) {
        setGameStatus(data.gameStatus);
      }
      if (data.gameStatus === STAGES.PLAY) {
        fetchHand();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set up websocket listeners
  useEffect(() => {
    socket.on("START_GAME", (data) => {
      setGameStatus(STAGES.PLAY);
      setMetadata(data);
      fetchHand();
    });
    socket.on("ALL_SUBMITTED", () => {
      setGameStatus(STAGES.JOKER);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let interval = null;
    if (seconds === 0) {
      clearInterval(interval);
      setSeconds(INIT_SECONDS);
      setGameStatus(STAGES.PREDICT);
    } else if (gameStatus === STAGES.JOKER) {
      interval = setInterval(() => setSeconds((seconds) => seconds - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameStatus, seconds]);

  function checkHandSizes() {
    const { hand1, hand2, hand3 } = hands;
    return hand1.length === 3 && hand2.length === 5 && hand3.length === 5;
  }

  function submitCards() {
    if (!checkHandSizes()) {
      setError(SIZE_ERR);
    } else {
      submitHands(roomId, name, hands, (data) => {
        // check if all players submitted
        let allSubmitted = true;
        for (let i = 0; i < data.names.length; i++) {
          if (!data.players[i].submitted) allSubmitted = false;
        }

        if (!allSubmitted) {
          setGameStatus(STAGES.SUBMIT);
        } else {
          socket.emit("action", {
            type: "ALL_SUBMITTED",
            payload: { roomId },
          });
        }
      });
    }
  }

  function startGameHandler() {
    startGame(roomId, (data) => {
      setMetadata(data);
      socket.emit("action", {
        type: "START_GAME",
        payload: { roomId, data },
      });
    });
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
          return 14;
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
        <CardsContext.Provider value={{ hands, setHands, gameStatus }}>
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
      bottomDiv = (
        <Grid container direction="column" alignItems="center" spacing={1}>
          <Grid item xs={12}>
            <b>Time remaining:</b> {seconds} sec
          </Grid>
          <Grid item xs={12}>
            Use a joker this round?
            <ToggleButtonGroup
              classes={{ root: classes.toggleButtonGroup }}
              color="primary"
              value={joker}
              exclusive
              onChange={updateJoker}
            >
              <ToggleButton color="primary" value={true}>
                Yes
              </ToggleButton>
              <ToggleButton color="primary" value={false}>
                No
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} style={{ fontSize: 12 }}>
            To use the joker, select 'Yes' and the card you want to change.
          </Grid>
        </Grid>
      );
      break;
    case STAGES.PREDICT:
    case STAGES.RESULT:
    case STAGES.END:
    default:
      bottomDiv = <div />;
  }

  return (
    <CardsContext.Provider
      value={{
        metadata,
        hands,
        setHands,
        gameStatus,
        highlight,
        toggleHighlight,
        newCard,
        setNewCard,
      }}
    >
      {error && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={error.length > 0}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
      <Container className={classes.root}>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid
            container
            item
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
            <Grid container item xs={3} direction="column">
              <LeftSidebar />
            </Grid>
            <Grid
              container
              item
              xs={6}
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Button onClick={autoSetHands}>Set hands</Button>
              <Hand name={"hand1"}>{hands.hand1}</Hand>
              <Hand name={"hand2"}>{hands.hand2}</Hand>
              <Hand name={"hand3"}>{hands.hand3}</Hand>
            </Grid>
            <Grid container item xs={3}>
              <RightSidebar />
            </Grid>
          </Grid>
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
    </CardsContext.Provider>
  );
}

export default Game;
