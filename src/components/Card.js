import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CardsContext } from "./Game";
import { STAGES } from "../common/constants";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  highlighted: {
    backgroundColor: theme.palette.secondary.main,
    opacity: 0.4,
    position: "absolute",
    width: "100%",
    height: 100,
  },
}));

function Card(props) {
  const classes = useStyles();
  const { gameStatus, highlight, toggleHighlight } = useContext(CardsContext);
  const { name } = props.data;

  const onDragStart = (e) => {
    e.dataTransfer.setData("text", JSON.stringify(props.data));
  };

  const onDragOver = (e) => {
    e.stopPropagation();
  };

  const onClick = () => {
    if (highlight === name) {
      toggleHighlight("");
    } else {
      toggleHighlight(name);
    }
  };

  return (
    <div
      className={classes.root}
      draggable={gameStatus === STAGES.PLAY}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onClick={gameStatus === STAGES.JOKER ? onClick : null}
    >
      <div className={highlight === name ? classes.highlighted : null}></div>
      <img alt={name} src={`/images/${name}.png`} height="100" />
    </div>
  );
}

export default Card;
