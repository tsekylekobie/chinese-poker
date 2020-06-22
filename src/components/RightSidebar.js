import React, { useContext, useState } from "react";
import { Typography, Switch, FormControlLabel } from "@material-ui/core";

import { CardsContext } from "../containers/Game";
import Table, { createRowData } from "./Table";

function RightSidebar() {
  const { metadata, showHistory, setShowHistory } = useContext(CardsContext);

  let overall = [],
    round = [],
    history = [];
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
        metadata.players.map((p) => (p.useJoker ? "Y" : "N"))
      ),
      createRowData(
        "Prediction",
        metadata.players.map((p) => p.prediction || "-")
      ),
    ];
    history = metadata.prevRounds.map((round) =>
      createRowData(
        `Round ${round.round}`,
        round.players.map((p) => p.score)
      )
    );
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
      {showHistory && <Table data={metadata} rows={history} />}
    </React.Fragment>
  );
}

export default RightSidebar;
