import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
}));

function Rules(props) {
  const classes = useStyles();

  return (
    <Container className={classes.root} maxWidth="md">
      <Typography variant="h5">Basic Rules</Typography>
      <Typography variant="body1">
        13 Cards is a game that consists of 3 or 4 players. Each players starts
        with 13 cards in their hand. Players must create 3 poker hands
        consisting of 3 cards, 5 cards, and 5 cards.
        <br />
        The 3 card hand is referred to as the front hand. The middle 5 hand is
        referred to as the middle hand. The top 5 hand is referred to as the
        back hand.
        <br />
        The back hand must be the highest ranking hand and the front hand must
        be the lowest ranking hand. The rankings are based on standard poker
        hand ratings. (Note that straights and flushes cannot be used in the
        front 3 card hand.)
      </Typography>
      <br />
      <Typography variant="h5">Gameplay</Typography>
      <Typography variant="body1">
        There will be 12 rounds total. Each player rolls a dice to determine the
        order of play. In a 3P game, round 4, 8, and 12 will be a special round.
        Rounds 5, A special round will be played in the order from the player
        with the least points to the player with the most.
      </Typography>
      <br />
      <Typography variant="h5">Predictions</Typography>
      <Typography variant="h6">Tokens</Typography>
      <Typography variant="body1">
        Before the cards are revealed each player must predict the amount of
        hands they believe they will win. Tokens act as a wild card and can be
        used to After the cards are revealed each player with a correct
        prediction recieves an additional 1.5 points.
      </Typography>
    </Container>
  );
}

export default Rules;
