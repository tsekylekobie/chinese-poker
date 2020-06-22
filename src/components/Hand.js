import React, { useContext } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import _ from "lodash";

import { removeCard } from "../common/helper";
import { CardsContext } from "../containers/Game";
import Card from "./Card";
import { STAGES } from "../common/constants";

const useStyles = makeStyles((theme) => ({
  hand: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    boxSizing: "content-box",
    minHeight: 127,
    borderRadius: 4,
  },
  bottomHand: {
    marginBottom: theme.spacing(2),
  },
  main: { backgroundColor: theme.palette.primary.light },
  highlight: { backgroundColor: theme.palette.secondary.main },
}));

function Hand(props) {
  const classes = useStyles();
  const { hands, setHands, jokerInfo, gameStatus } = useContext(CardsContext);
  const { children, name, highlight } = props;

  const onDrop = (e) => {
    e.preventDefault();
    const newCard = JSON.parse(e.dataTransfer.getData("text"));
    // remove card from all hands
    let newHands = removeCard(hands, newCard.name);
    // add it to current hand
    newHands = _.set(newHands, name, [...newHands[name], newCard]);
    setHands(newHands);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  let xs;
  switch (name) {
    case "hand1":
      xs = 7;
      break;
    case "hand2":
    case "hand3":
      xs = 10;
      break;
    default:
      xs = 12;
  }

  return (
    <Grid
      container
      item
      className={clsx(
        classes.hand,
        highlight ? classes.highlight : classes.main,
        name === "hand3" && classes.bottomHand
      )}
      direction="row"
      justify="center"
      alignItems="center"
      xs={xs}
      onDrop={gameStatus === STAGES.PLAY ? onDrop : null}
      onDragOver={gameStatus === STAGES.PLAY ? onDragOver : null}
    >
      {children &&
        children.map((card) => (
          <Card
            key={card.name}
            data={card}
            handName={name}
            jokerInfo={jokerInfo}
          />
        ))}
    </Grid>
  );
}

export default Hand;
