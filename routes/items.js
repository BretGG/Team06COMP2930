const router = require("express").Router();
const debug = require("debug")("comp2930-team2:server");
const { Item } = require("../src/models/item");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { User } = require("../src/models/user");

router.get("/:category", async (req, res) => {
  let items = await Item.find({ category: req.params.category });
  res.send(items);
});

// Request to buy item
router.put("/:selectedItem", async (req, res) => {
  // Finding the item
  console.log("Request to buy item: " + JSON.stringify(req.params));
  let item = await Item.findById(req.params.selectedItem);
  if (!item) return res.status(404).send("Could not find item");

  // Checking token
  var token = req.get("auth-token");
  if (!token) return res.status(400).send("Uh Oh! You dont have a token!");
  const decode = jwt.verify(token, "FiveAlive");
  token = jwt.decode(token);

  console.log(
    `Request for me from user ${token._id} at ${req.connection.remoteAddress}`
  );

  // Getting user info
  const user = await User.findById(token._id).select("-password");
  console.log(user);
  if (!user) return res.status(400).send("Uh Oh! You dont exist!");

  // Check if they already own it
  if (user.items.indexOf(item._id) != -1) {
    return res.status(400).send("Already Purchased");
  }
  if (user.points >= item.cost) {
    // Check if they have the points
    user.points -= item.cost;
    user.items.push(item._id);
    await user.save();
    res.send(item);
  } else {
    returnres.status(400).send("Insufficient Funds");
  }
});

router.post("/", async (req, res) => {
  let item = _.pick(req.body, [
    "cost",
    "name",
    "category",
    "imageLink",
    "shopIcon"
  ]);
  debug("Request to make new item: " + item);

  item = new Item(item);
  if (!item) return res.status(200).send("Failed to create new item");

  await item.save().then("Yay a new item was saved");

  res.status(400).send(item);
});

module.exports = router;
