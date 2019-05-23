const router = require("express").Router();
const debug = require("debug")("comp2930-team2:server");
const { Deck, validate } = require("../src/models/deck");
const { Card } = require("../src/models/card");
const { User } = require("../src/models/user");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

/*

Holds API for creating and upate decks

*/

// Endpoint for creating a deck
router.post("/", async (req, res) => {
  let token = req.header("auth-token");
  token = jwt.decode(token);

  let deck = new Deck(_.pick(req.body, "name"));
  deck.owner = token._id;

  debug("Request to create decks: " + JSON.stringify(deck));

  // Saving the deck to the database
  await deck.save();

  // debug("Creating deck: " + JSON.stringify(deck));
  res.send(_.pick(deck, ["name", "_id"]));
});

// Endpoint to get all decks owen be current user (jwt)
router.get("/", async (req, res) => {
  let token = req.get("auth-token");
  if (!token) return res.status(401).send("Invalid token! No deck for you!");
  token = jwt.decode(token);

  let user = await User.findById(token._id);

  let decks = await Deck.find({ owner: token._id });
  if (!decks)
    return res.status(400).send("You have no deck! Get your own deck first!");

  res.send(decks);
});

// Endpoint to get all cards in the deck passed in through the req.body
router.get("/card", async (req, res) => {
  let mydeck = await Deck.findById(_.pick(req.body, ["deckId"]));
  let cards = mydeck.getCards();

  if (!cards)
    return res.status(400).send("You have no card here! Get your card first!");

  res.send(cards);
});

// Endpoint to get all cards in all decks owned by the user (jwt)
router.get("/allcards", async (req, res) => {
  let token = req.get("auth-token");
  if (!token) return res.status(401).send("Invalid token! No deck for you!");
  token = jwt.decode(token);

  let user = await User.findById(token._id);

  let decks = await Deck.find({ owner: token._id });

  // Check if we found deckSchema
  let cards = [];
  for (let deck of decks) {
    cards = cards.concat(await deck.getCards());
  }

  res.send(cards);
});

module.exports = router;
