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
              value={newCard.rank}
              onChange={(e) =>
                setJokerInfo((state) => ({
                  ...state,
                  newCard: { suit: newCard.suit, rank: e.target.value },
                }))
              }
            >
              {RANKS.map((rank, i) => {
                const val = rank === "0" ? 10 : rank;
                return (
                  <MenuItem key={i} value={rank}>
                    {val}
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
                  newCard: { rank: newCard.rank, suit: e.target.value },
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
            src={`/images/${newCard.rank + newCard.suit[0]}.png`}
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
