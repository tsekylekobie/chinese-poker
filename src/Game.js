import React from "react";
import axios from "axios";

import Hand from "./Hand";
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
        this.getCards();
      });
  }

  getCards() {
    axios
      .get(
        `https://deckofcardsapi.com/api/deck/${this.state.deckID}/draw/?count=13`
      )
      .then((res) => {
        const cards = res.data.cards.map((card) => (
          <Card key={card.code} data={card} />
        ));
        this.setState({ cards });
      });
  }

  onClick = (e) => {
    console.log("onSubmit");
  };

  render() {
    return (
      <div className="flexbox">
        <div className="flexbox">
          <Hand />
          <Hand />
          <Hand />
          <button onClick={this.onClick} style={{ width: 70 }}>
            Submit
          </button>
        </div>
        <div className="row">{this.state.cards}</div>
      </div>
    );
  }
}
