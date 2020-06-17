import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";

import { removeCard } from "../common/helper";
import { CardsContext } from "../containers/Game";
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
  const { hands, setHands, gameStatus, jokerInfo, setJokerInfo } = useContext(
    CardsContext
  );

  const { handName, data } = props;
  let { name } = data;
  if (name.startsWith("10")) name = name.substring(1);

  const onDragStart = (e) => {
    e.dataTransfer.setData("text", JSON.stringify(data));
  };

  const onDrop = (e) => {
    e.stopPropagation();
    const newCard = JSON.parse(e.dataTransfer.getData("text"));
    const idx = _.findIndex(hands[handName], (c) => _.isEqual(c, data));
    // remove from all hands
    let newHands = removeCard(hands, newCard.name);
    // add into specific index
    newHands = _.set(newHands, handName, [
      ...newHands[handName].slice(0, idx),
      newCard,
      ...newHands[handName].slice(idx),
    ]);
    setHands(newHands);
  };

  const onClick = () => {
    if (!jokerInfo.useJoker) return;
    if (jokerInfo.highlight === name) {
      setJokerInfo((state) => ({ ...state, highlight: "" }));
    } else {
      setJokerInfo((state) => ({ ...state, highlight: name }));
    }
  };

  return (
    <div
      className={classes.root}
      draggable={gameStatus === STAGES.PLAY}
      onDragStart={gameStatus === STAGES.PLAY ? onDragStart : null}
      onDrop={gameStatus === STAGES.PLAY ? onDrop : null}
      onClick={gameStatus === STAGES.JOKER ? onClick : null}
    >
      <div
        className={
          jokerInfo && jokerInfo.useJoker && jokerInfo.highlight === name
            ? classes.highlighted
            : null
        }
      ></div>
      <img alt={name} src={`/images/${name}.png`} height="100" />
    </div>
  );
}

export default Card;
