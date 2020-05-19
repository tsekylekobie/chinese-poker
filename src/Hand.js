import React from "react";

import Card from "./Card";

export default class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
    };
  }

  onDrop = (e) => {
    e.preventDefault();
    const state = JSON.parse(e.dataTransfer.getData("cardState"));
    const newCard = <Card key={state.code} data={state} />;
    this.setState({ cards: [...this.state.cards, newCard] });
  };

  onDragOver = (e) => {
    e.preventDefault();
  };

  render() {
    return (
      <div
        className="row"
        style={{ borderStyle: "solid", height: 100, backgroundColor: "red" }}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
      >
        {this.state.cards}
      </div>
    );
  }
}
