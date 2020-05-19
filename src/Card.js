import React from "react";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.data.image,
      suit: this.props.data.suit,
      value: this.props.data.value,
    };
  }

  render() {
    const text = `${this.state.suit} of ${this.state.value}`;
    return <img alt={text} src={this.state.url} width="100" />;
  }
}
