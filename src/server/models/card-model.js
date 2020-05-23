const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cardSchema = new Schema({
  name: String,
  suit: String,
  value: Number,
});

const Card = mongoose.model("Card", cardSchema);

module.exports = {
  model: Card,
  schema: cardSchema,
};
