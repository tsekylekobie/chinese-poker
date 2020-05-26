import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { createMuiTheme } from "@material-ui/core/styles";
import { Toolbar } from "@material-ui/core";

import Navbar from "./components/Navbar";
import Lobby from "./components/Lobby";
import Game from "./components/Game";
import "./App.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#6200EE", // purple
    },
    secondary: {
      main: "#03DAC6", // teal
    },
    error: {
      main: "#B00020", // red
    },
  },
});

const history = createBrowserHistory();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: this.getName(),
    };
    this.onNameChange = this.onNameChange.bind(this);
  }

  onNameChange(x) {
    localStorage.setItem("playerName", x);
    this.setState({ playerName: x });
  }

  getName() {
    return localStorage.getItem("playerName");
  }

  render() {
    return (
      <Router history={history}>
        <Navbar
          theme={theme}
          playerName={this.state.playerName}
          onNameChange={this.onNameChange}
          history={history}
        />
        <Toolbar />
        <Switch>
          <Route path="/game/:roomID" component={Game} />
          <Route
            path="/"
            render={(props) => (
              <Lobby {...props} theme={theme} getName={this.getName} />
            )}
          />
        </Switch>
      </Router>
    );
  }
}
