import React, { useContext } from "react";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import { CardsContext } from "../containers/Game";
import Hand from "../components/Hand";
import Table, { createRowData } from "./Table";
import { STAGES } from "../common/constants";

const useStyles = makeStyles((theme) => ({
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

function BottomNav() {
  const classes = useStyles();
  const {
    metadata,
    hands,
    setHands,
    gameStatus,
    jokerInfo,
    setJokerInfo,
    prediction,
    setPrediction,
    startGameHandler,
    nextRoundHandler,
    endGameHandler,
    submitCards,
    submitJokerInfo,
    submitPredictInfo,
  } = useContext(CardsContext);

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

  function updateJoker(_, newStatus) {
    if (newStatus !== null)
      setJokerInfo((state) => ({ ...state, useJoker: newStatus }));
  }

  function updatePrediction(_, newStatus) {
    if (newStatus !== null) setPrediction(newStatus);
  }

  let rows = [];
  if (metadata && metadata.players) {
    rows = [
      createRowData(
        "Predicted",
        metadata.players.map((p) => p.prediction)
      ),
      createRowData(
        "Hands Won",
        metadata.players.map((p) => p.handsWon)
      ),
      createRowData(
        "Total Score",
        metadata.players.map((p) => p.score)
      ),
    ];
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
          I'm ready
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
            Use a joker this round?
            <ToggleButtonGroup
              classes={{ root: classes.toggleButtonGroup }}
              color="primary"
              value={jokerInfo.useJoker}
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
          <Grid item xs={12}>
            <Button
              variant="contained"
              className={classes.button}
              color="primary"
              onClick={submitJokerInfo}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      );
      break;
    case STAGES.PREDICT:
      bottomDiv = (
        <Grid container direction="column" alignItems="center" spacing={1}>
          <Grid item xs={12}>
            How many hands will you win?
            <ToggleButtonGroup
              classes={{ root: classes.toggleButtonGroup }}
              color="primary"
              value={prediction}
              exclusive
              onChange={updatePrediction}
            >
              <ToggleButton color="primary" value={0}>
                0
              </ToggleButton>
              <ToggleButton color="primary" value={1}>
                1
              </ToggleButton>
              <ToggleButton color="primary" value={2}>
                2
              </ToggleButton>
              <ToggleButton color="primary" value={3}>
                3
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              className={classes.button}
              color="primary"
              onClick={submitPredictInfo}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      );
      break;
    case STAGES.RESULT:
      bottomDiv = (
        <Grid container item xs={4} direction="column" alignItems="center">
          <Table rows={rows} data={metadata} />
          <Grid className={classes.control} item xs={12}>
            {metadata.round < metadata.totalRounds ? (
              <Button
                variant="contained"
                className={classes.button}
                color="primary"
                onClick={nextRoundHandler}
              >
                Next round
              </Button>
            ) : (
              <Button
                variant="contained"
                className={classes.button}
                color="primary"
                onClick={endGameHandler}
              >
                See Results
              </Button>
            )}
          </Grid>
        </Grid>
      );
      break;
    case STAGES.END:
    default:
      bottomDiv = <div />;
  }

  return bottomDiv;
}

export default BottomNav;
