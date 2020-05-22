import React from "react";
import { Router, Switch, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";

import Lobby from "./components/Lobby";
import Game from "./components/Game";
import "./App.css";

const history = createBrowserHistory();

export default function App() {
  return (
    <Router history={history}>
      <div>
        <Link to="/">Home</Link>

        <Switch>
          <Route path="/game/:roomID" component={Game} />
          <Route path="/" component={Lobby} />
        </Switch>
      </div>
    </Router>
  );
}
