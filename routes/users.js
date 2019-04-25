const router = require("express").Router();
const { User } = require("../src/models/user");
const _ = require("lodash");

/*

This file is the router for handling user connections (creating, updating, removing, validating/login)

*/

// Creates a user off of the req body, this call will return the username and email of the new user.
// If an error occurs due to invalid req body or requirements, this call will return code (fill in).
router.post("/", (req, res) => {
  // TODO: validate user

  let user = new User(_.pick(req.body, ["username", "email", "password"]));

  // TODO: insert user into the database, salt password using bcrypt

  res.send(_.pick(user, ["username", "email"]));
});

// TODO: update user

// TODO: delete user

// TODO: login/validate

module.exports = router;
