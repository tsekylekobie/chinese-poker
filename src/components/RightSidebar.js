import React, { useContext, useState } from "react";
import { Typography, Switch, FormControlLabel } from "@material-ui/core";

import { CardsContext } from "../containers/Game";
import Table from "./Table";

function RightSidebar() {
  const { metadata } = useContext(CardsContext);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <React.Fragment>
      <Typography variant="h6">Overall</Typography>
      <Table data={metadata} />
      <Typography variant="h6" style={{ marginTop: 16 }}>
        Current Round
      </Typography>
      <Table data={metadata} />
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
      {showHistory && <Table data={metadata} />}
    </React.Fragment>
  );
}

export default RightSidebar;
