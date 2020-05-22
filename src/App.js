import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Lobby from "./components/Lobby";
import Game from "./components/Game";
import "./App.css";

export default function App() {
  return (
    <Router>
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
