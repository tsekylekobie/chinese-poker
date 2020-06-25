import React, { createContext, useState, useEffect } from "react";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import io from "socket.io-client";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";

import Lobby from "./containers/Lobby";
import Game from "./containers/Game";
import "./App.css";

const socket = io();

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  titleText: {
    cursor: "pointer",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#6200EE", // purple
      light: "#EFE5FD",
    },
    secondary: {
      main: "#03DAC6", // teal
      faded: "rgba(3, 218, 198, 0.4)",
    },
    error: {
      main: "#B00020", // red
    },
    action: {
      active: "#6200EE", // purple
    },
  },
});

export const AppContext = createContext();

const history = createBrowserHistory();

function App() {
  const classes = useStyles();
  const [name, setName] = useState(localStorage.getItem("playerName"));

  useEffect(
    function persistName() {
      localStorage.setItem("playerName", name);
    },
    [name]
  );

  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              <span
                className={classes.titleText}
                onClick={() => history.push("/")}
              >
                Chinese Poker
              </span>
            </Typography>
            <Button color="inherit">Rules</Button>
          </Toolbar>
        </AppBar>
        <AppContext.Provider value={{ socket, name, setName }}>
          <Switch>
            <Route path="/game/:roomID" component={Game} />
            <Route path="/" component={Lobby} />
          </Switch>
        </AppContext.Provider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
