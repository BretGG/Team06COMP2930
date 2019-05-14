/*

This file contains the the schema (essentially a class) for the database, that
holds the information for a question card.

*/

const mongoose = require("mongoose");
const joi = require("joi");
// const jwt = require("jsonwebtoken");

//question, answer
//answer, t/f
const cardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  format: {
      type: String,
      required: true
  },
  answer: {
      type: String,
      required: true
  },
  deck: {
      type: String, // Hold id to deck
      required: true
  }
});

const Card = mongoose.model('Card', cardSchema);

// Validates if the card object follows validation rules.
exports.validate = card => {
  const schema = joi.object().keys({
    question: joi.string().required(),
    format: joi.string().required(),
    answer: joi.string().required(),
    deck: joi.string().required()
  });

  return joi.validate(card, schema);
};



// cardSchema.methods.getCard = function() { //deck<-getCard and then retunrs whatever card it has
//
//   return jwt.sign({ _id: this._id, card: this.username }, "FiveAlive");
// };

exports.Card = mongoose.model('Card', cardSchema); //Card constructor
