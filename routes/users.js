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

  // Setting default items
  let defaultAvatar = await Item.findOne({
    name: "Black Sesame",
    category: "avatar"
  });
  let defaultPlatform = await Item.findOne({
    name: "Flying Grass",
    category: "platform"
  });
  let defaultBackground = await Item.findOne({
    name: "Forest View",
    category: "background"
  });

  console.log(defaultAvatar);
  // Should include error handling (i.e. can't find the default items)

  user.cosmetics.activeAvatar = defaultAvatar;
  user.cosmetics.activePlatform = defaultPlatform;
  user.cosmetics.activeBackground = defaultBackground;

  user.items.push(defaultAvatar._id, defaultPlatform._id, defaultBackground._id);

  console.log(user);

  await user.save();
  debug("Creating user: " + JSON.stringify(user));
  res.send(_.pick(user, ["username", "email"]));
});

// Set user skin for specified category
router.put("/:category/:itemId", async (req, res) => {
  var token = req.get("auth-token");
  if (!token) return res.status(400).send("Uh Oh! You dont have a token!");
  const decode = jwt.verify(token, "FiveAlive");
  token = jwt.decode(token);

  const user = await User.findById(token._id).select("-password");
  if (!user) return res.status(400).send("Uh Oh! You dont exist!");

  let item = await Item.findById(req.params.itemId);
  if (!item) return res.status(404).send("No item exists with that id");

  console.log(req.params);
  console.log(item);

  switch (req.params.category) {
    case "avatar":
      user.cosmetics.activeAvatar = item;
      console.log("avatar");
      break;
    case "platform":
      user.cosmetics.activePlatform = item;
      break;
    case "background":
      user.cosmetics.activeBackground = item;
      break;
    default:
      return res.status(400).send("Invalid category");
  }

  await user.save();
  res.status(200).send(item);
});

router.get("/updateCosmetics", async (req, res) => {
  var token = req.get("auth-token");
  if (!token) return res.status(400).send("Uh Oh! You dont have a token!");
  const decode = jwt.verify(token, "FiveAlive");
  token = jwt.decode(token);

  const user = await User.findById(token._id).select("-password");
  if (!user) return res.status(400).send("Uh Oh! You dont exist!");

  var cosmetic = user.cosmetics;
  res.send(cosmetic);
});

// TODO: update user

// TODO: delete user

// TODO: login/validate

module.exports = router;
