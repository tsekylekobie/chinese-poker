import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Grid,
  Button,
  TextField,
  Snackbar,
  Tabs,
  Tab,
  Paper,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab/";

import { AppContext } from "../App";
import { createGame, joinGame } from "../actions/index";

// Error messages
const NAME_ERR = "Please enter a name";
const GAMEID_ERR = "Invalid GameID";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
  },
  control: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
  },
  input: {
    margin: theme.spacing(1),
  },
}));

function Lobby(props) {
  const classes = useStyles();
  const { socket, name, setName } = useContext(AppContext);

  function TabPanel(props) {
    const { children, value, index } = props;

    return (
      <div hidden={value !== index}>
        {value === index && (
          <Grid
            container
            className={classes.control}
            direction="column"
            justify="center"
            alignItems="center"
          >
            {children}
          </Grid>
        )}
      </div>
    );
  }

  // For displaying errors
  const [error, setError] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setError("");
  };

  const [gameId, setGameId] = useState("");

  function onSuccess(data) {
    if (data.error) {
      setError(data.error);
    } else {
      socket.emit("action", {
        type: "JOIN_GAME",
        payload: { roomId: data.gameId },
      });
      props.history.push(`/game/${data.gameId}`);
    }
  }

  function createRoom() {
    if (!name) {
      setError(NAME_ERR);
    } else {
      createGame(name, onSuccess);
    }
  }

  function joinRoom() {
    if (!name) {
      setError(NAME_ERR);
    } else if (!gameId) {
      setError(GAMEID_ERR);
    } else {
      joinGame(gameId, name, onSuccess);
    }
  }

  return (
    <Container className={classes.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        {error && (
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={error.length > 0}
            autoHideDuration={5000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="error">
              {error}
            </Alert>
          </Snackbar>
        )}
        <Grid
          container
          className={classes.control}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Paper>
            <Tabs
              value={tabIndex}
              indicatorColor="primary"
              textColor="primary"
              onChange={(_, val) => setTabIndex(val)}
            >
              <Tab label="Create room" value={0} />
              <Tab label="Join room" value={1} />
            </Tabs>
            <TabPanel value={tabIndex} index={0}>
              <TextField
                label="Name"
                className={classes.input}
                variant="outlined"
                size="small"
                defaultValue={name}
                onBlur={(e) => setName(e.target.value)}
              />
              <Button
                variant="contained"
                className={classes.input}
                color="primary"
                onClick={createRoom}
              >
                Create game
              </Button>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <TextField
                label="Name"
                className={classes.input}
                variant="outlined"
                size="small"
                defaultValue={name}
                onBlur={(e) => setName(e.target.value)}
              />
              <TextField
                label="Game ID"
                className={classes.input}
                variant="outlined"
                size="small"
                defaultValue={gameId}
                onBlur={(e) => setGameId(e.target.value)}
              />
              <Button
                variant="contained"
                className={classes.input}
                color="primary"
                onClick={joinRoom}
              >
                Join game
              </Button>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Lobby;
