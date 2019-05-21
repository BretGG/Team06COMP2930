const router = require("express").Router();
const debug = require("debug")("comp2930-team2:server");
const { Card, validate } = require("../src/models/card");
const _ = require("lodash");

router.post("/", async (req, res) => {
  var card = _.pick(req.body, [
    "format",
    "category",
    "question",
    "answer",
    "deck"
  ]);
  debug("Request to create cards: " + JSON.stringify(card));

  // Check if valid card data
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if question is already in the database
  // I should talk about this if we need this
  // cardQuestion = await Card.findOne({ question: card.question });
  // if (cardQuestion) return res.status(400).send("Same Question already exists");

  // let decks = await Deck.findAll({   owner: someId
  // }); // Find decks by user
  //
  // for each await deck.getCards(); // Ask decks for cards

  // Create card
  card = new Card(card);
  // Saving the user to the database
  await card.save();

  debug("Creating card: " + JSON.stringify(card));
  res.send(_.pick(card, ["question", "answer"])); // do i need this
});

// TODO: update card

// TODO: delete card

module.exports = router;
