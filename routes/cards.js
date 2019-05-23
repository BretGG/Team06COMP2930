const router = require("express").Router();
const debug = require("debug")("comp2930-team2:server");
const { Card, validate } = require("../src/models/card");
const _ = require("lodash");

/*

API points for creating, deleting, and getting cards

*/

// Endpoint for creating cards
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

  // Create new card and save the database
  card = new Card(card);
  await card.save();

  debug("Creating card: " + JSON.stringify(card));
  res.send(_.pick(card, ["question", "answer"]));
});

// To update card
router.put("/:cardId", async (req, res) => {
  let cardInfo = _.pick(req.body, [
    "format",
    "category",
    "question",
    "answer",
    "deck"
  ]);

  let card = await Card.findById(req.params.cardId);

  if (!card) if (error) return res.status(400).send("No card by that id");

  card.format = cardInfo.format;
  card.category = cardInfo.category;
  card.question = cardInfo.question;
  card.answer = cardInfo.answer ? cardInfo.answer : card.answer;
  card.deck = cardInfo.deck ? cardInfo.deck : card.deck;
  await card.save();
  res.send(card);
});

// Delete a card based of given cardId
router.delete("/:cardId", async (req, res) => {
  let cardId = req.params.cardId;
  let card = await Card.findById(cardId);
  console.log(card);

  if (!card) if (error) return res.status(400).send("No card by that id");

  card = await Card.deleteOne({
    _id: cardId
  });
  res.status(200).send(card);
});

module.exports = router;
