const mongoose = require("mongoose");
const joi = require("./node_modules/joi");
const jwt = require("./node_modules/jsonwebtoken");

/*

This file contains the the schema (essentially a class) for the database, that
holds the information for a user account. This file will also contain the validation
for User account creation, this will be added after meshing with the database.

*/

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 15
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  },
  points: {
    type: Number,
    default: 0
  }
});

// Validates if the user object follows validation rules.
exports.validate = user => {
  const schema = joi.object().keys({
    username: joi
      .string()
      .min(5)
      .max(12)
      .required(),
    email: joi
      .string()
      .max(50)
      .required()
      .email(),
    password: joi
      .string()
      .min(8)
      .max(20)
      .required()
  });

  return joi.validate(user, schema);
};

function somethng() {}

schema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id, username: this.username }, "FiveAlive");
};

exports.User = mongoose.model("User", schema);
