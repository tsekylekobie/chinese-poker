import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  Grid,
} from "@material-ui/core";

import { CardsContext } from "../containers/Game";
import { RANKS, SUITS, STAGES } from "../common/constants";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(2),
  },
}));

function LeftSidebar() {
  const classes = useStyles();
  const { gameStatus, jokerInfo, setJokerInfo, metadata } = useContext(
    CardsContext
  );
  const { useJoker, highlight, newCard } = jokerInfo;

  const currRound = metadata && metadata.round;
  const startingPlayer =
    metadata && metadata.names && metadata.names.length > 0
      ? metadata.names[(metadata.round - 1) % metadata.names.length]
      : "";
  const selectCardWindow = (
    <Paper className={classes.card}>
      <Grid container direction="row">
        <Grid container item xs={6} direction="column">
          <span>Replace with:</span>
          <FormControl className={classes.control}>
            <InputLabel>Rank</InputLabel>
            <Select
              value={newCard.value}
              onChange={(e) =>
                setJokerInfo((state) => ({
                  ...state,
                  newCard: {
                    suit: newCard.suit,
                    value: e.target.value,
                    name: `${e.target.value}${newCard.suit[0]}`,
                  },
                }))
              }
            >
              {RANKS.map((rank, i) => {
                const val = rank === "10" ? 0 : rank;
                return (
                  <MenuItem key={i} value={val}>
                    {rank}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl className={classes.control}>
            <InputLabel>Suit</InputLabel>
            <Select
              value={newCard.suit}
              onChange={(e) =>
                setJokerInfo((state) => ({
                  ...state,
                  newCard: {
                    value: newCard.value,
                    suit: e.target.value,
                    name: `${newCard.rank}${e.target.value[0]}`,
                  },
                }))
              }
            >
              {SUITS.map((suit, i) => (
                <MenuItem key={i} value={suit}>
                  {suit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid container item xs={6} justify="center" alignItems="center">
          <img
            alt={newCard.rank + newCard.suit}
            src={`/images/${newCard.value + newCard.suit[0]}.png`}
            height="100"
          />
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <React.Fragment>
      <Typography variant="subtitle1">
        <b>Round:</b>&nbsp;{currRound}
      </Typography>
      <Typography variant="subtitle1">
        <b>Starting player:</b>&nbsp;{startingPlayer}
      </Typography>
      {gameStatus === STAGES.JOKER && useJoker && highlight && selectCardWindow}
    </React.Fragment>
  );
}

export default LeftSidebar;
