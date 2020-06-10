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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Jokers", 10, 10.5, 12.5, 13.5),
  createData("Score", 3, 3, 2, 0),
];

function Table(props) {
  const classes = useStyles();
  const { data } = props;
  console.log(data);

  return (
    <TableContainer component={Paper}>
      <MuiTable size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell className={classes.head} />
            {data.names &&
              data.names.map((name) => (
                <React.Fragment>
                  <StyledTableCell className={classes.head} align="center">
                    kyle
                  </StyledTableCell>
                  <StyledTableCell className={classes.head} align="center">
                    kyndall
                  </StyledTableCell>
                  <StyledTableCell className={classes.head} align="center">
                    terrance
                  </StyledTableCell>
                  <StyledTableCell className={classes.head} align="center">
                    kenneth
                  </StyledTableCell>
                </React.Fragment>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="center" className={classes.highlighted}>
                {row.calories}
              </StyledTableCell>
              <StyledTableCell align="center">{row.fat}</StyledTableCell>
              <StyledTableCell align="center">{row.carbs}</StyledTableCell>
              <StyledTableCell align="center">{row.protein}</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}

export default Table;
