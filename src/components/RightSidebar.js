import React, { useContext, useState } from "react";
import { Typography, Switch, FormControlLabel } from "@material-ui/core";

import { CardsContext } from "../containers/Game";
import Table from "./Table";

function createRowData(name, players) {
  const data = { name };
  for (let i = 0; i < players.length; i++) {
    const key = `player_${i + 1}`;
    data[key] = players[i];
  }
  return data;
}

function RightSidebar() {
  const { metadata } = useContext(CardsContext);
  const [showHistory, setShowHistory] = useState(false);

  let overall = [],
    round = [];
  if (metadata && metadata.players) {
    overall = [
      createRowData(
        "Jokers",
        metadata.players.map((p) => p.jokersRemaining)
      ),
      createRowData(
        "Score",
        metadata.players.map((p) => p.score)
      ),
    ];
    round = [
      createRowData(
        "Joker?",
        metadata.players.map((p) => p.useJoker || "-")
      ),
      createRowData(
        "Prediction",
        metadata.players.map((p) => p.prediction || "-")
      ),
    ];
  }

  return (
    <React.Fragment>
      <Typography variant="h6">Overall</Typography>
      <Table rows={overall} data={metadata} />
      <Typography variant="h6" style={{ marginTop: 16 }}>
        Current Round
      </Typography>
      <Table rows={round} data={metadata} />
      <FormControlLabel
        control={
          <Switch
            checked={showHistory}
            onChange={() => setShowHistory(!showHistory)}
            color="primary"
          />
        }
        label="View past rounds"
        style={{ marginTop: 16 }}
      />
      {showHistory && <Table data={metadata} rows={overall} />}
    </React.Fragment>
  );
}

export default RightSidebar;
