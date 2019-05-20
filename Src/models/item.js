const mongoose = require("mongoose");
const joi = require("joi");
const _ = require("lodash");

/*

This file contains the the schema (essentially a class) for the database, that
holds the information for the shop items a user has. 

*/

const itemSchema = new mongoose.Schema({
  cost: Number,
  name: String,
  category: String,
  imageLink: String,
  shopIcon: String,
  owned: Boolean
});

exports.Item = mongoose.model("Item", itemSchema);
