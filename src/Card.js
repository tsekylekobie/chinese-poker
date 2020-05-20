import React from "react";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.data.image,
      suit: this.props.data.suit,
      value: this.props.data.value,
      code: this.props.data.code,
    };
  }

  onDragStart = (e) => {
    e.dataTransfer.setData("cardState", JSON.stringify(this.state));
  };

  onDragOver = (e) => {
    e.stopPropagation();
  };

  onDragEnd = (e) => {
    // Card disappears only if successful drag and drop
    if (e.dataTransfer.dropEffect === "move") {
      this.props.removeCard();
    }
  };

  render() {
    const text = `${this.state.suit} of ${this.state.value}`;
    return (
      <div
        draggable={true}
        onDragStart={this.onDragStart}
        onDragOver={this.onDragOver}
        onDragEnd={this.onDragEnd}
      >
        <img alt={text} src={this.state.image} width="75" />
      </div>
    );
  }
}
