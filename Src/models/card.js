const mongoose = require("mongoose");
const joi = require("joi");

/*

This file contains the the schema (essentially a class) for the database, that
holds the information for a question card.

*/

const cardSchema = new mongoose.Schema({

    format: { //either multiple choice or t/f
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    deck: {
        type: String, // Hold deckId to deck
        required: true
    }
});

const Card = mongoose.model('Card', cardSchema);

// Validates if the card object follows validation rules.
exports.validate = card => {
    const schema = joi.object().keys({
        format: joi.string().required(),
        category: joi.string().required(),
        question: joi.string().required(),
        answer: joi.string().required(),
        deck: joi.string().required()
    });

    return joi.validate(card, schema);
};


// cardSchema.methods.getCard = function() { //deck<-getCard and then retunrs whatever card it has

exports.Card = mongoose.model('Card', cardSchema); //Card constructor
