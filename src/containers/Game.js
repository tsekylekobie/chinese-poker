import React, { createContext, useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid, Button, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab/";

import { AppContext } from "../App";
import Hand from "../components/Hand";
import RightSidebar from "../components/RightSidebar";
import LeftSidebar from "../components/LeftSidebar";
import BottomNav from "../components/BottomNav";
import { startGame, getPlayer, getGame, submitHands } from "../actions/index";
import { RANKS, SUITS, STAGES } from "../common/constants";

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
  const defaultJokerInfo = {
    useJoker: false,
    seconds: INIT_SECONDS,
    highlight: "",
    newCard: { suit: SUITS[0], rank: RANKS[0] },
  };
  const [jokerInfo, setJokerInfo] = useState(defaultJokerInfo);

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
    if (jokerInfo.seconds === 0) {
      clearInterval(interval);
      setJokerInfo((state) => ({ ...state, seconds: INIT_SECONDS }));
      setGameStatus(STAGES.PREDICT);
    } else if (gameStatus === STAGES.JOKER) {
      interval = setInterval(
        () =>
          setJokerInfo((state) => ({ ...state, seconds: state.seconds - 1 })),
        1000
      );
    }
    return () => clearInterval(interval);
  }, [gameStatus, jokerInfo]);

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

  function startGameHandler() {
    startGame(roomId, (data) => {
      setMetadata(data);
      socket.emit("action", {
        type: "START_GAME",
        payload: { roomId, data },
      });
    });
  }

  function checkHandSizes() {
    const { hand1, hand2, hand3 } = hands;
    return hand1.length === 3 && hand2.length === 5 && hand3.length === 5;
  }

  function submitCards() {
    if (!checkHandSizes()) {
      setError("Invalid hand size");
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

  return (
    <CardsContext.Provider
      value={{
        metadata,
        hands,
        setHands,
        gameStatus,
        jokerInfo,
        setJokerInfo,
        startGameHandler,
        submitCards,
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
            <BottomNav />
          </Grid>
        </Grid>
      </Container>
    </CardsContext.Provider>
  );
}

export default Game;
