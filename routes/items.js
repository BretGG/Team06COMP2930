const router = require("express").Router();
const debug = require("debug")("comp2930-team2:server");
const { Item } = require("../src/models/item");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { User } = require("../src/models/user");

/*

This router handles everything related to items, mainly used from the shop page

*/

// Get all items of given category
router.get("/category/:category", async (req, res) => {
  let items = await Item.find({ category: req.params.category });
  res.send(items);
});

// Get item at given id
router.get("/:itemId", async (req, res) => {
  if (!req.params.itemId) return res.status(400).send("Invalid item id");

  let items = await Item.findById(req.params.itemId);
  if (!items) return res.status(404).send("No item with that Id");
  res.send(items);
});

// Request to buy item, checks the current logged in users balance and either
// returns with an error on failure to buy item or returns the item on success
router.put("/:selectedItem", async (req, res) => {
  // Finding the item
  debug("Request to buy item: " + JSON.stringify(req.params));
  let item = await Item.findById(req.params.selectedItem);
  if (!item) return res.status(404).send("Could not find item");

  // Checking token
  var token = req.get("auth-token");
  if (!token) return res.status(400).send("Uh Oh! You dont have a token!");
  const decode = jwt.verify(token, "FiveAlive");
  token = jwt.decode(token);

  // Getting user info
  const user = await User.findById(token._id).select("-password");
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
    return res.status(400).send("Insufficient Funds");
  }
});

// Create an item based of req.body
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
