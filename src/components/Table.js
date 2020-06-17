import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { default as MuiTable } from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const StyledTableCell = withStyles((theme) => ({
  root: {
    maxWidth: 50,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  head: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
  },
  sizeSmall: {
    padding: "6px 8px",
  },
}))(TableCell);

const useStyles = makeStyles((theme) => ({
  highlighted: {
    backgroundColor: theme.palette.secondary.faded,
  },
}));

function displayRow(data, rowData) {
  return (
    <TableRow key={rowData.name}>
      <StyledTableCell component="th" scope="row">
        {rowData.name}
      </StyledTableCell>
      {data.names.map((_, i) => {
        const key = `player_${i + 1}`;
        return (
          <StyledTableCell key={rowData.name + (i + 1)} align="center">
            {rowData[key]}
          </StyledTableCell>
        );
      })}
    </TableRow>
  );
}

function Table(props) {
  const classes = useStyles();
  const { data, rows } = props;

  return (
    <TableContainer component={Paper}>
      <MuiTable size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell className={classes.head} />
            {data.names &&
              data.names.map((name, i) => (
                <React.Fragment key={i}>
                  <StyledTableCell className={classes.head} align="center">
                    {name}
                  </StyledTableCell>
                </React.Fragment>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>{rows.map((row) => displayRow(data, row))}</TableBody>
      </MuiTable>
    </TableContainer>
  );
}

export default Table;
