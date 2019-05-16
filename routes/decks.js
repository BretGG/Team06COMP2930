const router = require("express").Router();
const debug = require("debug")("comp2930-team2:server");
const { Deck, validate } = require("../src/models/deck");
const { Card } = require("../src/models/card");
const { User } = require("../src/models/user");
const _ = require("lodash");
const jwt = require('jsonwebtoken');


router.post("/", async (req, res) => {
    console.log('.. posting ..');
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send("Invalid deck body");

    // const { error } = validate(user);
    // if (error) return res.status(400).send(error.details[0].message);


    let token = req.header('auth-token');
    token = jwt.decode(token);

    let user = await User.findById(token._id);
    let deck = new Deck(_.pick(req.body, 'deckname'));
    deck.owner = token._id;

    console.log(`Creating new deck from: ${req.connection.remoteAddress} user: ${user.username}`);

    debug("Request to create decks: " + JSON.stringify(deck));

    // Create deck
    deck = new Deck(deck);

    // Saving the deck to the database
    await deck.save();

    debug("Creating deck: " + JSON.stringify(deck));
    res.send(_.pick(deck, ["deckname"]));
});

// TODO: update deck

// TODO: delete deck

// get the decks
router.get('/', async (req, res) => {
    let token = req.get('auth-token');
    if (!token) return res.status(401).send("Invalid token! No trip for you!");
    token = jwt.decode(token);

    let user = await User.findById(token._id);

    console.log(`Get all decks from: ${req.connection.remoteAddress} user: ${user.username}`);

    let decks = await Deck.find( { owner: token._id });
    if (!decks) return res.status(400).send("You have no trips! Go on a trip!");

    console.log(`Returning ${decks.length} decks to ${token._id} at ${req.connection.remoteAddress}`);
    res.send({ decks: decks });
});


module.exports = router;
