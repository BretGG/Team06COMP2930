const { Card } = require("./card");
const mongoose = require("mongoose");
const joi = require("joi");
const _ = require('lodash');


/*

This file contains the the schema (essentially a class) for the database, that
holds the information for a card deck.

*/

const deckSchema = new mongoose.Schema({
//   category: {       //category for cards
//     type: String,
//     required: true
// },
    deckname: {         //deckName
        type: String,
        required: true
    },
    owner: {        //Do not validate for owner
        type: String,
        required: true
    }
});

// easier way to get cards
// deckSchema.methods.getCards = async function() {
//     return await Card.findAll({ deck: this._id })
// }

const Deck = mongoose.model('Deck', deckSchema);



// Validates if the card object follows validation rules.
exports.validate = deck => {
    console.log(deck);

  const schema = joi.object().keys({
    ndecknameame: joi.string().required()
  });

  return joi.validate(_.pick(deck, 'deckname'), schema);
};

exports.Deck = mongoose.model("Deck", deckSchema);
