const { Card } = require("./card");
const mongoose = require("mongoose");
const _ = require("lodash");

/*

This file contains the the schema for the database, that
holds the information for a deck.

*/

const deckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  }
});

// Returns all cards in this deck (i.e. have this decks id), QoL function
deckSchema.methods.getCards = async function() {
  return await Card.find({ deck: this._id });
};

exports.Deck = mongoose.model("Deck", deckSchema);
