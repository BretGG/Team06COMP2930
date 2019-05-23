const router = require("express").Router();
const debug = require("debug")("comp2930-team2:server");
const bcrypt = require("bcrypt");
const { User, validate } = require("../src/models/user");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Item } = require("../src/models/item");

/*

This file is the router for handling user connections (creating, updating, getting)

*/

// Creates a user off of the req body, this call will return the username and email of the new user.
// If an error occurs due to invalid req body or requirements, this call will return code 400.
router.post("/", async (req, res) => {
  var user = _.pick(req.body, ["username", "email", "password"]);

  // Check if valid user data
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user is in the database (email or username)
  userEmail = await User.findOne({ email: user.email });
  if (userEmail) return res.status(400).send("Email Taken");
  userName = await User.findOne({ username: user.username });
  if (userName) return res.status(400).send("Username Taken");

  // Creating email for sending to a user on account creation
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ecoquestteam06@gmail.com",
      pass: "ecoquest2"
    }
  });

  // Setting mail options
  var mailOptions = {
    from: "ecoquestteam06@gmail.com",
    to: user.email,
    subject: "Welcome to EcoQuest",
    html:
      '<img style="display: block; width: 100%" src="cid:ecoQuestEmailHeader"/>' +
      "<p><b>Hi " +
      user.username +
      "!</b></p><br><p>Thank you for creating an account with our app." +
      "Are you ready to embark on your first EcoQuest? We hope to amaze you with our project" +
      "that was completed in five weeks. Our team worked hard to bring this project to you " +
      "so we hope you truly enjoy the experience.</p><br><p><b>From, the EcoQuest Team</b></p>" +
      '<img style="display: inline; width: 100%" src="cid:ecoQuestEmailFooter"/>',
    attachments: [
      {
        filename: "emailHeader.png",
        path: __dirname + "/../public/images/emailHeader.png",
        cid: "ecoQuestEmailHeader"
      },
      {
        filename: "emailerFooter.png",
        path: __dirname + "/../public/images/emailFooter.png",
        cid: "ecoQuestEmailFooter"
      }
    ]
  };

  // Finish sending maiil to user
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      debug(error);
    } else {
      debug("Email sent: " + info.response);
    }
  });

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

  user.cosmetics.activeAvatar = defaultAvatar;
  user.cosmetics.activePlatform = defaultPlatform;
  user.cosmetics.activeBackground = defaultBackground;

  // Set new user to own the default items
  user.items.push(
    defaultAvatar._id,
    defaultPlatform._id,
    defaultBackground._id
  );

  // Save user to database
  await user.save();
  debug(
    "Creating user: " + JSON.stringify(_.pick(user, ["username", "email"]))
  );

  // Respond with the new user's username and email
  res.send(_.pick(user, ["username", "email"]));
});

// Set the equipped item for the specific category and item
router.put("/:category/:itemId", async (req, res) => {
  var token = req.get("auth-token");
  if (!token) return res.status(400).send("Uh Oh! You dont have a token!");
  token = jwt.decode(token);

  const user = await User.findById(token._id).select("-password");
  if (!user) return res.status(400).send("Uh Oh! You dont exist!");

  // Check if valid item
  let item = await Item.findById(req.params.itemId);
  if (!item) return res.status(404).send("No item exists with that id");

  // Set correct category
  switch (req.params.category) {
    case "avatar":
      user.cosmetics.activeAvatar = item;
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

  // Update user in database
  await user.save();
  res.status(200).send(item);
});

// Returns the current players equipped items using jwt
router.get("/updateCosmetics", async (req, res) => {
  var token = req.get("auth-token");
  if (!token) return res.status(400).send("Uh Oh! You dont have a token!");
  token = jwt.decode(token);

  // Check if user exists
  const user = await User.findById(token._id).select("-password");
  if (!user) return res.status(400).send("Uh Oh! You dont exist!");

  res.send(user.cosmetics);
});

module.exports = router;
