import React from "react";
import _ from "lodash";
import { ThemeProvider } from "@material-ui/core/styles";
import { Container, Grid, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab/";
import pokerSolver from "pokersolver";
import io from "socket.io-client";

import Hand from "./Hand";
import { startGame, getPlayer } from "../actions/index";

const ps = pokerSolver.Hand;
const socket = io.connect("http://localhost:8080", { reconnect: true });

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.theme = props.theme;
    this.getName = props.getName;

    this.state = {
      playerName: this.getName(),
      roomID: props.match.params.roomID,
      deckID: "",
      error: "",
      // the thirteen cards to choose from
      cards: [],
      // the hands to submit
      hand1: [],
      hand2: [],
      hand3: [],
      gameStart: false,
    };

    this.startGame = this.startGame.bind(this);
    this.startCallback = this.startCallback.bind(this);
    this.getCardsCallback = this.getCardsCallback.bind(this);
  }

  componentDidMount() {
    socket.on("startGame", () => {
      console.log("heard from server");
      // Draw cards
      getPlayer(
        this.state.roomID,
        this.state.playerName,
        this.getCardsCallback
      );
    });
  }

  getCardsCallback(data) {
    this.setState({ cards: data.hand });
  }

  startGame() {
    startGame(this.state.roomID, this.startCallback);
    this.setState({ gameStart: true });
  }

  startCallback() {
    socket.emit("action", {
      type: "START_GAME",
      payload: { roomId: this.state.roomID },
    });
  }

  onClick = (e) => {
    const { hand1, hand2, hand3 } = this.state;
    const error = this.isValidHands();
    this.setState({ error });
    if (!error) {
      socket.emit("submit", hand1, hand2, hand3);
    }
  };

  isValidHands = () => {
    const { hand1, hand2, hand3 } = this.state;
    if (hand1.length !== 3 || hand2.length !== 5 || hand3.length !== 5)
      return "Invalid hand size";

    const h1 = ps.solve(hand1.map((card) => this.cardToCode(card)));
    const h2 = ps.solve(hand2.map((card) => this.cardToCode(card)));
    const h3 = ps.solve(hand3.map((card) => this.cardToCode(card)));

    // Check h2 >= h1
    let ws = ps.winners([h1, h2]);
    const check1 = _.findIndex(ws, (w) => _.isEqual(w, h2)) !== -1;
    // Assert h3 >= h2
    ws = ps.winners([h2, h3]);
    const check2 = _.findIndex(ws, (w) => _.isEqual(w, h3)) !== -1;
    if (!check1 || !check2) return "Invalid hand order";
    return null;
  };

  cardToCode = (card) => {
    if (card.value === "10") return "T" + card.suit;
    return card.name;
  };

  // removeCard removes given card from all hands
  // Returns new state
  removeCard = (name) => {
    const keys = ["hand1", "hand2", "hand3", "cards"];
    const newState = {};
    for (let i in keys) {
      let k = keys[i];
      newState[k] = _.filter(this.state[k], (x) => x.name !== name);
    }
    return newState;
  };

  onChange = (newState) => {
    this.setState(newState);
  };

  render() {
    const { error, gameStart, hand1, hand2, hand3, cards } = this.state;

    return (
      <ThemeProvider theme={this.theme}>
        <Container className="root">
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            {this.state.error && <Alert severity="error">{error}</Alert>}
            <Hand
              name={"hand1"}
              onChange={this.onChange}
              removeCard={this.removeCard}
            >
              {hand1}
            </Hand>
            <Hand
              name={"hand2"}
              onChange={this.onChange}
              removeCard={this.removeCard}
            >
              {hand2}
            </Hand>
            <Hand
              name={"hand3"}
              onChange={this.onChange}
              removeCard={this.removeCard}
            >
              {hand3}
            </Hand>
            <Grid
              container
              className="control"
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                className="button"
                color="primary"
                onClick={this.onClick}
              >
                Submit
              </Button>
              {!gameStart && (
                <Button
                  variant="contained"
                  className="button"
                  color="primary"
                  onClick={this.startGame}
                >
                  Start
                </Button>
              )}
            </Grid>
            <Hand
              name={"cards"}
              onChange={this.onChange}
              removeCard={this.removeCard}
            >
              {cards}
            </Hand>
          </Grid>
        </Container>
      </ThemeProvider>
    );
  }
}
