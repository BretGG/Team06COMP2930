const router = require("express").Router();
const debug = require("debug")("comp2930-team2:server");
const { Item } = require("../src/models/item");
const _ = require("lodash");

router.get("/:category", async (req, res) => {
  let items = await Item.find({ category: req.params.category });
  res.send(items);
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
