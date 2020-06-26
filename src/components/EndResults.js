import React, { useContext } from "react";
import _ from "lodash";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button } from "@material-ui/core";
import { CardsContext } from "../containers/Game";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

function EndResults(props) {
  const classes = useStyles();
  const { name, metadata } = useContext(CardsContext);

  const winner = _.maxBy(metadata.players, (p) => p.score);
  const isWinner = winner.playerName === name;

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Typography variant="h5">
        {isWinner ? "You win!" : "You lose!"}
      </Typography>
      <Typography variant="subtitle1">
        {isWinner ? "Congrats!" : "Better luck next time!"}
      </Typography>
      <Button
        variant="contained"
        className={classes.button}
        color="primary"
        onClick={props.goHomeHandler}
      >
        Home
      </Button>
    </Grid>
  );
}

export default EndResults;
