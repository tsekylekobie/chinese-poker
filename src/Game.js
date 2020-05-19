import React from "react";
import axios from "axios";

import Card from "./Card";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deckID: "",
      cards: [],
    };
  }

  componentDidMount() {
    axios
      .get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then((res) => {
        this.setState({ deckID: res.data.deck_id });
      });
  }

  getCards() {
    axios
      .get(
        `https://deckofcardsapi.com/api/deck/${this.state.deckID}/draw/?count=13`
      )
      .then((res) => {
        this.setState({ cards: res.data.cards });
      });
  }

  render() {
    return (
      <div>
        <button onClick={this.getCards.bind(this)}>Draw a card!</button>
        <div>
          {this.state.cards.map((card, i) => (
            <Card key={card.code} data={card} />
          ))}
        </div>
      </div>
    );
  }
}
