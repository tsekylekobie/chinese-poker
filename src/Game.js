import React from "react";
import axios from "axios";

import Hand from "./Hand";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deckID: "",
      // the thirteen cards to choose from
      cards: [],
      // the hands to submit
      hand1: [],
      hand2: [],
      hand3: [],
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
        const cards = res.data.cards;
        this.setState({ cards });
      });
  }

  onClick = (e) => {
    console.log(this.state.hand1);
    console.log(this.state.hand2);
    console.log(this.state.hand3);
  };

  render() {
    const onChange1 = (x) => this.setState({ hand1: x });
    const onChange2 = (x) => this.setState({ hand2: x });
    const onChange3 = (x) => this.setState({ hand3: x });
    const onChangeCards = (x) => this.setState({ cards: x });

    const remove1 = (code) =>
      this.setState({ hand1: this.state.hand1.filter((x) => x.code !== code) });
    const remove2 = (code) =>
      this.setState({ hand2: this.state.hand2.filter((x) => x.code !== code) });
    const remove3 = (code) =>
      this.setState({
        hand3: this.state.hand3.filter((x) => x.code !== code),
      });
    const removeCards = (code) =>
      this.setState({
        cards: this.state.cards.filter((x) => x.code !== code),
      });

    return (
      <div className="flexbox">
        <div className="flexbox">
          <Hand
            onChange={onChange1}
            removeCard={remove1}
            cards={this.state.hand1}
          />
          <Hand
            onChange={onChange2}
            removeCard={remove2}
            cards={this.state.hand2}
          />
          <Hand
            onChange={onChange3}
            removeCard={remove3}
            cards={this.state.hand3}
          />
          <button onClick={this.onClick} style={{ width: 70 }}>
            Submit
          </button>
        </div>
        <Hand
          onChange={onChangeCards}
          removeCard={removeCards}
          cards={this.state.cards}
        />
      </div>
    );
  }
}
