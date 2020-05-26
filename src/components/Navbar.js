import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core/";
import EditIcon from "@material-ui/icons/Edit";

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.theme = props.theme;
    this.setNameRef = React.createRef();
    this.state = {
      open: false,
      playerName: props.playerName,
    };
    this.onNameChange = props.onNameChange;
    this.saveName = this.saveName.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.goHome = this.goHome.bind(this);
  }

  goHome() {
    this.props.history.push("/");
  }

  saveName() {
    const name = this.setNameRef.current;

    this.setState({ open: false, playerName: name.value.trim() });
    this.onNameChange(name.value.trim());
  }

  onKeyDown(ev) {
    if (ev.key === "Enter") {
      this.saveName();
      ev.preventDefault();
    }
  }

  displayName() {
    return this.state.open ? (
      <input
        ref={this.setNameRef}
        type="text"
        placeholder="Name"
        defaultValue={this.state.playerName}
        onKeyDown={this.onKeyDown}
        onBlur={this.saveName}
        autoFocus
      />
    ) : (
      <Button
        color="inherit"
        className={"button"}
        startIcon={<EditIcon />}
        onClick={() => this.setState({ open: true })}
      >
        {this.state.playerName || "Enter a name"}
      </Button>
    );
  }

  render() {
    return (
      <ThemeProvider theme={this.theme}>
        <AppBar position="fixed" color="primary">
          <Toolbar>
            <Typography variant="h6" className="title">
              <span style={{ cursor: "pointer" }} onClick={this.goHome}>
                Chinese Poker
              </span>
            </Typography>
            {this.displayName()}
            <Button color="inherit">Rules</Button>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    );
  }
}
