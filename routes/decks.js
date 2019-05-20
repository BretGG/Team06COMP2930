const router = require("express").Router();
const debug = require("debug")("comp2930-team2:server");
const { Deck, validate } = require("../src/models/deck");
const { Card } = require("../src/models/card");
const { User } = require("../src/models/user");
const _ = require("lodash");
const jwt = require('jsonwebtoken');


router.post("/", async (req, res) => {

    let token = req.header('auth-token');
    token = jwt.decode(token);

    let user = await User.findById(token._id);
    let deck = new Deck(_.pick(req.body, 'name'));
    deck.owner = token._id;

    console.log(`Creating new deck from: ${req.connection.remoteAddress} user: ${user.username}`);

    debug("Request to create decks: " + JSON.stringify(deck));

    // Create deck
    // deck = new Deck(deck);

    // Saving the deck to the database
    await deck.save();

    // debug("Creating deck: " + JSON.stringify(deck));
    res.send(_.pick(deck, ["name", "_id"]));
});

// TODO: update deck

// TODO: delete deck

// get the decks
router.get('/', async (req, res) => {
    let token = req.get('auth-token');
    if (!token) return res.status(401).send("Invalid token! No deck for you!");
    token = jwt.decode(token);

    let user = await User.findById(token._id);

    console.log(`Get all decks from: ${req.connection.remoteAddress} user: ${user.username}`);

    let decks = await Deck.find( { owner: token._id });
    if (!decks) return res.status(400).send("You have no deck! Get your own deck first!");

    console.log(`Returning ${decks.length} decks to ${token._id} at ${req.connection.remoteAddress}`);
    res.send({ decks: decks });
});

//get the cards from this decks with the deck ID
router.get('/card', async (req, res) => {
    let deckId = _.pick(req.body, ["deckId"]);
    let mydeck = await Deck.findById(deckId);
    let cards = mydeck.getCards();

    console.log(`Get all decks from: ${req.connection.remoteAddress} user: ${mydeck.name}`);

    let decks = await Deck.find( { owner: token._id });
    if (!cards) return res.status(400).send("You have no card here! Get your card first!");

    console.log(`Returning ${cards.length} cards on ${mydeck._id} at ${req.connection.remoteAddress}`);
    res.send({ cards: card });
});

module.exports = router;
