import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";

import { Grid, Typography } from "@material-ui/core";

import Hand from "../components/Hand";
import { CardsContext } from "../containers/Game";

function Results() {
  const { metadata } = useContext(CardsContext);
  const width = 12 / metadata.names.length;
  const { winner1, winner2, winner3 } = metadata.prevRounds[metadata.round - 1];

  return (
    <React.Fragment>
      {metadata.players.map((p) => {
        return (
          <Grid
            container
            item
            xs={width}
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Typography variant="subtitle1">{p.playerName}</Typography>
            <Hand
              highlight={_.indexOf(winner1, p.playerName) !== -1}
              name={"hand1"}
            >
              {p.hand1}
            </Hand>
            <Hand
              highlight={_.indexOf(winner2, p.playerName) !== -1}
              name={"hand2"}
            >
              {p.hand2}
            </Hand>
            <Hand
              highlight={_.indexOf(winner3, p.playerName) !== -1}
              name={"hand3"}
            >
              {p.hand3}
            </Hand>
          </Grid>
        );
      })}
    </React.Fragment>
  );
}

export default Results;
