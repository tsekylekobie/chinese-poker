import React, { useState, useEffect } from "react";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

import Lobby from "./components/Lobby";
import Game from "./components/Game";
import "./App.css";

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
    },
    secondary: {
      main: "#03DAC6", // teal
    },
    error: {
      main: "#B00020", // red
    },
  },
});

export const AppContext = React.createContext();

const history = createBrowserHistory();

function App() {
  const classes = useStyles();
  const [name, setName] = useState(localStorage.getItem("playerName"));
  const [open, toggleDisplay] = useState(false);

  const getName = () => {
    return localStorage.getItem("playerName");
  };

  useEffect(
    function persistName() {
      localStorage.setItem("playerName", name);
    },
    [name]
  );

  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <AppBar position="fixed" color="primary">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              <span
                className={classes.titleText}
                onClick={() => history.push("/")}
              >
                Chinese Poker
              </span>
            </Typography>
            {open ? (
              <input
                type="text"
                placeholder="Name"
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => toggleDisplay(false)}
                autoFocus
              />
            ) : (
              <Button
                color="inherit"
                className={classes.button}
                startIcon={<EditIcon />}
                onClick={() => toggleDisplay(true)}
              >
                {name || "Enter a name"}
              </Button>
            )}
            <Button color="inherit">Rules</Button>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Switch>
          <Route
            path="/game/:roomID"
            render={(props) => <Game {...props} getName={getName} />}
          />
          <Route
            path="/"
            render={(props) => <Lobby {...props} getName={getName} />}
          />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
