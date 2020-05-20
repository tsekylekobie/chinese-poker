import React from "react";
import axios from "axios";
import openSocket from 'socket.io-client';
import _ from "lodash";
import pokerSolver from "pokersolver";

import Hand from "./Hand";

const socket = openSocket('http://localhost:8080');
socket.on('winner', (x) => console.log('the winner is ', x));

const ps = pokerSolver.Hand;

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deckID: "",
      error: "",
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
        // this.setState({ cards });
        this.setState({ hand1: cards.slice(0, 3), hand2: cards.slice(3, 8), hand3: cards.slice(8) }); // for testing
      });
  }

  onClick = (e) => {
    const { hand1, hand2, hand3 } = this.state;
    const error = this.isValidHands();
    if (!error) {
      socket.emit('submit', hand1, hand2, hand3);
    } else {
      this.setState({ error })
    }
  };

  isValidHands = () => {
    const { hand1, hand2, hand3 } = this.state;
    if (hand1.length !== 3 || hand2.length !== 5 || hand3.length !== 5)
      return "Invalid hand size";

    const h1 = ps.solve(hand1.map(card => this.cardToCode(card)));
    const h2 = ps.solve(hand2.map(card => this.cardToCode(card)));
    const h3 = ps.solve(hand3.map(card => this.cardToCode(card)));

    // Check h2 >= h1
    let ws = ps.winners([h1, h2]);
    const check1 = _.findIndex(ws, (w) => { _.isEqual(w, h2) });
    // Assert h3 >= h2
    ws = ps.winners([h2, h3]);
    const check2 = _.findIndex(ws, (w) => { _.isEqual(w, h3) });

    if (!check1 || !check2)
      return "Invalid hand order";
    return null;
  }

  cardToCode(card) {
    if (card.value === "10")
      return 'T' + card.suit;
    return card.code
  }

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
          <p className="error">{this.state.error}</p>
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
