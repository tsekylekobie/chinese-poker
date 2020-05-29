import React, { useContext } from "react";
import { Grid } from "@material-ui/core";
import _ from "lodash";

import { CardsContext } from "./Game";
import Card from "./Card";

function Hand(props) {
  const { hands, setHands } = useContext(CardsContext);
  const { children, name } = props;

  // removeCard removes a specific card from ALL hands
  function removeCard(name) {
    const removeFromHand = (arr) =>
      _.filter(arr, (x) => !_.isEqual(x.name, name));
    return _.mapValues(hands, (arr) => removeFromHand(arr));
  }
  const onDrop = (e) => {
    e.preventDefault();
    const newCard = JSON.parse(e.dataTransfer.getData("text"));
    // remove card from all hands
    let newHands = removeCard(newCard.name);
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
      {children.map((card) => (
        <Card key={card.name} data={card} />
      ))}
    </Grid>
  );
}

export default Hand;
