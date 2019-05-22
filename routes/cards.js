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

  // Create new card and save the database
  card = new Card(card);
  await card.save();

  debug("Creating card: " + JSON.stringify(card));
  res.send(_.pick(card, ["question", "answer"]));
});

// To update card
router.put("/", async (req, res) => {
  let cardInfo = _.pick(req.body, [
    "cardId",
    "format",
    "category",
    "question",
    "answer",
    "deck"
  ]);

  let card = Card.findById(cardInfo.cardId);
  if (!card) if (error) return res.status(400).send("No card by that id");

  card.update({
    format: cardInfo.format,
    category: cardInfo.category,
    question: cardInfo.question,
    answer: cardInfo.answer ? cardInfo.answer : card.answer,
    deck: cardInfo.deck ? cardInfo.deck : card.deck
  });
});


// to delete card
router.delete("/:cardId", async (req, res) => {
    console.log('router.delete starts');
    let cardId = req.params.cardId;
  let card = await Card.findById(cardId);
  console.log(card);

  // TODO: check if they are the owner
  if (!card) if (error) return res.status(400).send("No card by that id");

  card = await Card.deleteOne({
    _id: cardId
  });
  res.status(200).send(card);
});

// get the cards
// router.put("/get", async (req, res) => {
//   let cardtype = _.pick(req.body, ["format", "deck", "category"]);
//   console.log(`Get all cards from: ${req.connection.remoteAddress}`);
//   console.log(cardtype);
//   let cards;
//   if (!cardtype.deck && !cardtype.category) {
//     console.log("case 1");
//     cards = await Card.find({
//       format: cardtype.format
//     });
//   } else if (!cardtype.category) {
//     console.log("case 2");
//     cards = await Card.find({
//       format: cardtype.format,
//       deck: cardtype.deck
//     });
//   } else if (!cardtype.deck) {
//     console.log("case 3");
//     cards = await Card.find({
//       format: cardtype.format,
//       category: cardtype.category
//     });
//   } else {
//     console.log("case 4");
//     cards = await Card.find({
//       format: cardtype.format,
//       deck: cardtype.deck,
//       category: cardtype.category
//     });
//   }
//
//   if (!cards || cards.length <= 0)
//     return res.status(400).send("You have no cards!");
//
//   console.log(
//     `Returning ${cards.length} cards at ${req.connection.remoteAddress}`
//   );
//   res.send({
//     cards: cards
//   });
// });

module.exports = router;
