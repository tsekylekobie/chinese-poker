import React from "react";

import Card from "./Card";

export default class Hand extends React.Component {
  onDrop = (e) => {
    const { cards, onChange } = this.props;
    const state = JSON.parse(e.dataTransfer.getData("cardState"));
    cards.push(state);
    onChange(cards);
    e.preventDefault();
  };

  onDragOver = (e) => {
    e.preventDefault();
  };

  render() {
    const { cards, removeCard } = this.props;
    return (
      <div
        className="row"
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
      >
        {cards.map((card) => <Card key={card.code} data={card} removeCard={() => removeCard(card.code)} />)}
      </div>
    );
  }
}
