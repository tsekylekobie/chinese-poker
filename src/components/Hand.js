import React from "react";
import { Grid } from "@material-ui/core";

import Card from "./Card";

export default class Hand extends React.Component {
  onDrop = (e) => {
    e.preventDefault();
    const { onChange, removeCard, name } = this.props;
    const cardState = JSON.parse(e.dataTransfer.getData("text"));
    // remove card from all hands
    const newGameState = removeCard(cardState.name);
    // add it to current hand
    newGameState[[name]].push(cardState);
    // update parent state using handler
    onChange(newGameState);
  };

  onDragOver = (e) => {
    e.preventDefault();
  };

  render() {
    const { children, name } = this.props;
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
    console.log(children);
    return (
      <Grid
        container
        className={classes}
        direction="row"
        justify="center"
        alignItems="center"
        xs={xs}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
      >
        {children.map((card) => (
          <Card key={card.name} data={card} />
        ))}
      </Grid>
    );
  }
}
