const { Card } = require("./card");
const mongoose = require("mongoose");
const _ = require("lodash");

/*

This file contains the the schema (essentially a class) for the database, that
holds the information for a card deck.

*/

const deckSchema = new mongoose.Schema({
  category: {
    //category for cards
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  }
});

deckSchema.methods.getCards = async function() {
  return await Card.findAll({ deck: this._id });
};

exports.Deck = mongoose.model("Deck", deckSchema);
