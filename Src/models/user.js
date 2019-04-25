const mongoose = require("mongoose");

/*

This file contains the the schema (essentially a class) for the database, that
holds the information for a user account. This file will also contain the validation 
for User account creation, this will be added after meshing with the database.

*/

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 0
  }
});

exports.User = mongoose.model("User", schema);
