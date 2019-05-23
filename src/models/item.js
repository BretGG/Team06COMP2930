const mongoose = require("mongoose");

/*

This file contains the the schema for the database, that
holds the information for the shop items.

*/

const itemSchema = new mongoose.Schema({
  cost: Number,
  name: String,
  category: String,
  imageLink: String,
  shopIcon: String
});

exports.Item = mongoose.model("Item", itemSchema);
