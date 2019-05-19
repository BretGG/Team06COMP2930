const router = require("express").Router();
const debug = require("debug")("comp2930-team2:server");
const { Item } = require("../src/models/user");
const _ = require("lodash");
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    console.log("Getting Items");
    let token = req.get('auth-token');
    if (!token) return res.status(401).send("Invalid token! No trip for you!");
    token = jwt.decode(token);

    let user = await User.findById(token._id);

    let items = await Item.find( { owner: token._id });
    if (!items) return res.status(400).send("You have no trips! Go on a trip!");

    console.log(`Returning ${items.length} items to ${token._id} at ${req.connection.remoteAddress}`);
    res.send({ items: items });
});


module.exports = router;
