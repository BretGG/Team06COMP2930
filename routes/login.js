const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const debug = require("debug")("comp2930-team2:server");
const {
    User
} = require("../src/models/user");
const jwt = require("jsonwebtoken"); //h
// const auth = require('../middleware/auth'); //h

const router = express.Router();

/*

Login is seperated from users so that we can use router.post.

'post' is more secure than 'get' dues to post storing less information

*/

// Authorizing a user, reurns status 400 if not a valid login.
// A valid login will return a web token
router.post("/", async (req, res) => {
    let user = _.pick(req.body, ["username", "password"]);

    // Check if the information is in the correct format
    const {
        error
    } = validate(user);
    if (error) return res.status(400).send(error.details[0].message);
    debug(
        `Login request from: ${req.connection.remoteAddress} user: ${user.username}`
    );

    // Grabbing the user from the database, and check if it found one
    user = await User.findOne({
        username: user.username
    });
    if (!user) {
        // req.connection.remoteAddress will return ::1 if logging in from localhost
        debug(
            `Invalid login from: ${req.connection.remoteAddress} user: ${
        user.username
      }`
        );
        return res.status(400).send("Invalid email or password.");
    }

    // Using bcrypt to check the password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        console.log(
            `Invalid login from: ${req.connection.remoteAddress} user: ${
        req.body.username
      }`
        );
        return res.status(400).send("Invalid username or password.");
    }

    // req.connection.remoteAddress will return ::1 if logging in from localhost
    console.log(
        `Valid login from: ${req.connection.remoteAddress} user: ${
      req.body.username
    }`
    );

    // Returning a json object containing success and the jwt token that needs to be stored
    const token = user.generateAuthToken();
    console.log("Sending token: " + token);
    console.log("decoded: " + JSON.stringify(jwt.decode(token)));
    res.status(200).send({
        success: true,
        token: token
    });
});

router.get("/me", async (req, res) => {
    var token = req.get("auth-token");
    if (!token) return res.status(400).send("Uh Oh! You dont have a token!");
    const decode = jwt.verify(token, "FiveAlive");
    token = jwt.decode(token);

    console.log(
        `Request for me from user ${token._id} at ${req.connection.remoteAddress}`
    );

    const user = await User.findById(token._id).select("-password");
    console.log(JSON.stringify(user));

    if (!user) return res.status(400).send("Uh Oh! You dont exist!");
    console.log(`Returning user ${user._id} to ${req.connection.remoteAddress}`);
    res.send(user);
});

//  Validates if the input is correct before authorizing function
// Using this validate over the User class one due to this one only checking email and password
function validate(req) {
    const schema = {
        username: Joi.string()
            .max(50)
            .required(),
        password: Joi.string()
            .min(8)
            .max(20)
            .required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;
