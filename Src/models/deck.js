/*

This file contains the the schema (essentially a class) for the database, that
holds the information for a card deck.

*/

const mongoose = require("mongoose");
const joi = require("joi");
const _ = require('lodash');

// const jwt = require("jsonwebtoken");

//question, answer
//answer, t/f
const deckSchema = new mongoose.Schema({
  category: {       //category for cards
    type: String,
    required: true
},
  owner: {
      type: String,
      required: true
  }
});


const Deck = mongoose.model('Deck', deckSchema);

// Validates if the card object follows validation rules.
exports.validate = deck => {
  const schema = joi.object().keys({
    category: joi.type().required(),
    owner: joi.type().required()
  });

  return joi.validate(_.pick(deck, ['category']), schema);
};

exports.Deck = mongoose.model("Deck", schema);
