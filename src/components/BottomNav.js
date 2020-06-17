import React, { useContext } from "react";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import { CardsContext } from "../containers/Game";
import Hand from "../components/Hand";
import { STAGES } from "../common/constants";

const useStyles = makeStyles((theme) => ({
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
    hands,
    setHands,
    gameStatus,
    jokerInfo,
    setJokerInfo,
    startGameHandler,
    submitCards,
    submitJoker,
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
              onClick={submitJoker}
            >
              Submit
            </Button>
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

  return bottomDiv;
}

export default BottomNav;
