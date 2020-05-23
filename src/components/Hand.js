import React from "react";

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
    const { children } = this.props;
    return (
      <div className="row" onDrop={this.onDrop} onDragOver={this.onDragOver}>
        {children.map((card) => (
          <Card key={card.name} data={card} />
        ))}
      </div>
    );
  }
}
