import React, { createContext, useState, useEffect, useContext } from "react";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid, Button, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab/";

import { AppContext } from "../App";
import Hand from "../components/Hand";
import RightSidebar from "../components/RightSidebar";
import LeftSidebar from "../components/LeftSidebar";
import BottomNav from "../components/BottomNav";
import Results from "../components/Results";
import EndResults from "../components/EndResults";
import {
  startRound,
  getPlayer,
  getGame,
  submitHands,
  submitJoker,
  submitPrediction,
} from "../actions/index";
import { STAGES } from "../common/constants";

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
  const { socket, name, goHome } = useContext(AppContext);
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

  const defaultJokerInfo = {
    useJoker: false,
    highlight: "",
    newCard: {
      suit: "Club",
      value: "2",
      name: "2C",
    },
  };
  const [jokerInfo, setJokerInfo] = useState(defaultJokerInfo);
  const [prediction, setPrediction] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const fetchHand = () =>
    getPlayer(roomId, name, (data) => {
      setHands((state) => ({
        ...state,
        hand1: data.hand1,
        hand2: data.hand2,
        hand3: data.hand3,
        myHand: data.hand,
      }));
    });

  useEffect(() => {
    fetchHand();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  // On component mount
  useEffect(function getGameInfo() {
    getGame(roomId, (data) => {
      setMetadata(data);
      console.log("Game status", data.gameStatus); // for debugging
      setGameStatus(data.gameStatus);
      switch (data.gameStatus) {
        case STAGES.WAIT:
          break;
        case STAGES.PLAY:
        case STAGES.JOKER:
        case STAGES.PREDICT:
          fetchHand();
          break;
        // no default
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set up websocket listeners
  useEffect(() => {
    socket.on("FETCH_DATA", () => {
      getGame(roomId, (data) => setMetadata(data));
    });
    socket.on("START_GAME", (data) => {
      setGameStatus(STAGES.PLAY);
      setMetadata(data);
    });
    socket.on("TO_JOKER_ROUND", () => {
      setGameStatus(STAGES.JOKER);
    });
    socket.on("TO_PRED_ROUND", () => {
      setGameStatus(STAGES.PREDICT);
    });
    socket.on("TO_RESULTS_ROUND", () => {
      setGameStatus(STAGES.RESULT);
    });

    return socket.removeAllListeners;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // For testing purposes
  function autoSetHands() {
    const { myHand } = hands;
    if (!myHand || myHand.length !== 13) return;

    setHands({
      myHand: [],
      hand1: myHand.slice(0, 3),
      hand2: myHand.slice(3, 8),
      hand3: myHand.slice(8, 13),
    });
  }

  function startGameHandler() {
    startRound(roomId, true, (data) => {
      setMetadata(data);
      socket.emit("action", {
        type: "START_GAME",
        payload: { roomId, data },
      });
    });
  }

  function nextRoundHandler() {
    startRound(roomId, false, (data) => {
      setMetadata(data);
      socket.emit("action", {
        type: "START_GAME",
        payload: { roomId, data },
      });
    });
  }

  function endGameHandler() {
    setGameStatus(STAGES.END);
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
        setMetadata(data);
        if (data.gameStatus !== STAGES.JOKER) {
          setGameStatus(STAGES.SUBMIT);
        } else {
          socket.emit("action", {
            type: "TO_JOKER_ROUND",
            payload: { roomId },
          });
        }
      });
    }
  }

  // helper function for submitJokerInfo
  function replaceCard(hand, handName, jokerInfo) {
    let idx = _.findIndex(hand, { name: jokerInfo.highlight });
    if (idx === -1) return null;

    const newHands = {
      ...hands,
      [handName]: [
        ...hand.slice(0, idx),
        jokerInfo.newCard,
        ...hand.slice(idx + 1),
      ],
    };
    return newHands;
  }

  function submitJokerInfo() {
    const used = jokerInfo.highlight === "" ? false : jokerInfo.useJoker;

    const player = _.find(metadata.players, (p) => p.playerName === name);
    if (used && player.jokersRemaining <= 0) {
      setError("You have no more jokers");
      return;
    }

    let newHands = hands;
    if (used) {
      // replace card in hand if not found yet
      newHands =
        replaceCard(hands.hand1, "hand1", jokerInfo) ||
        replaceCard(hands.hand2, "hand2", jokerInfo) ||
        replaceCard(hands.hand3, "hand3", jokerInfo);
    }

    submitJoker(roomId, name, newHands, used, (data) => {
      socket.emit("action", { type: "FETCH_DATA", payload: { roomId } });
      setJokerInfo(defaultJokerInfo);

      if (data.gameStatus !== STAGES.PREDICT) {
        setGameStatus(STAGES.SUBMIT);
      } else {
        socket.emit("action", {
          type: "TO_PRED_ROUND",
          payload: { roomId },
        });
      }
    });
  }

  function submitPredictInfo() {
    submitPrediction(roomId, name, prediction, (data) => {
      socket.emit("action", { type: "FETCH_DATA", payload: { roomId } });
      if (data.gameStatus !== STAGES.RESULT) {
        setGameStatus(STAGES.SUBMIT);
      } else {
        socket.emit("action", {
          type: "TO_RESULTS_ROUND",
          payload: { roomId },
        });
      }
    });
  }

  let topDiv;
  if (gameStatus === STAGES.RESULT) {
    topDiv = <Results />;
  } else if (gameStatus === STAGES.END) {
    topDiv = <EndResults goHomeHandler={goHome} />;
  } else {
    topDiv = (
      <React.Fragment>
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
          {gameStatus !== STAGES.WAIT && <RightSidebar />}
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <CardsContext.Provider
      value={{
        name,
        roomId,
        metadata,
        hands,
        setHands,
        gameStatus,
        jokerInfo,
        setJokerInfo,
        prediction,
        setPrediction,
        showHistory,
        setShowHistory,
        startGameHandler,
        nextRoundHandler,
        endGameHandler,
        submitCards,
        submitJokerInfo,
        submitPredictInfo,
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
            {topDiv}
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
