import React, { useContext } from "react";
import { Grid } from "@material-ui/core";
import _ from "lodash";

import { removeCard } from "../common/helper";
import { CardsContext } from "./Game";
import Card from "./Card";

function Hand(props) {
  const { hands, setHands } = useContext(CardsContext);
  const { children, name } = props;

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

  let classes, xs;
  switch (name) {
    case "hand1":
      classes = "hand three";
      xs = 3;
      break;
    case "hand2":
    case "hand3":
      classes = "hand five";
      xs = 5;
      break;
    default:
      classes = "hand";
      xs = 12;
  }

  return (
    <Grid
      container
      item
      className={classes}
      direction="row"
      justify="center"
      alignItems="center"
      xs={xs}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {children &&
        children.map((card) => (
          <Card key={card.name} data={card} handName={name} />
        ))}
    </Grid>
  );
}

export default Hand;
