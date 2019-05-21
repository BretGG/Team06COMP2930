const router = require("express").Router();
const debug = require("debug")("comp2930-team2:server");
const bcrypt = require("bcrypt");
const { User, validate } = require("../src/models/user");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { Item } = require("../src/models/item");

/*

This file is the router for handling user connections (creating, updating, removing)

*/

// Creates a user off of the req body, this call will return the username and email of the new user.
// If an error occurs due to invalid req body or requirements, this call will return code 400.
router.post("/", async (req, res) => {
  var user = _.pick(req.body, ["username", "email", "password"]);
  debug("Request to create user: " + JSON.stringify(user));

  // Check if valid user data
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user is in the database (email or username)
  userEmail = await User.findOne({ email: user.email });
  if (userEmail) return res.status(400).send("Email Taken");
  userName = await User.findOne({ username: user.username });
  if (userName) return res.status(400).send("Username Taken");

  // Create user and hash password
  user = new User(user);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // Saving the user to the database

  user.cosmetics.activeAvatar = "../images/avatar/default.png";
  user.cosmetics.activePlatform = "../images/platform/default.png";
  user.cosmetics.activeBackground = "../images/background/default.png";

  //WHY WONT THIS LINE WORK?!?!?
  // await Item.find().forEach( function(e){User.items.insert(e)} );
  await user.save();
  debug("Creating user: " + JSON.stringify(user));
  res.send(_.pick(user, ["username", "email"]));
});

router.get("/updateCosmetics", async (req, res) => {
  var token = req.get("auth-token");
  if (!token) return res.status(400).send("Uh Oh! You dont have a token!");
  const decode = jwt.verify(token, "FiveAlive");
  token = jwt.decode(token);

  console.log(
    `Request for me from user ${token._id} at ${req.connection.remoteAddress}`
    );

  const user = await User.findById(token._id).select("-password");
  if (!user) return res.status(400).send("Uh Oh! You dont exist!");

  var cosmetic = user.cosmetics;
  res.send(cosmetic);


});

// TODO: update user

// TODO: delete user

// TODO: login/validate

module.exports = router;
