import React from "react";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.data.name,
      suit: this.props.data.suit,
      value: this.props.data.value,
    };
  }

  onDragStart = (e) => {
    e.dataTransfer.setData("text", JSON.stringify(this.state));
  };

  onDragOver = (e) => {
    e.stopPropagation();
  };

  render() {
    const text = `${this.state.suit} of ${this.state.value}`;
    return (
      <div
        draggable={true}
        onDragStart={this.onDragStart}
        onDragOver={this.onDragOver}
      >
        <img alt={text} src={`/images/${this.state.name}.png`} width="75" />
      </div>
    );
  }
}
