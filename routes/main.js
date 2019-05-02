const express = require("express");
const router = express.Router();
const path = require("path");

/* GET home page. */
router.get("/", function(req, res) {
  res.render(path.resolve(__dirname, "../public/views/index.html"));
});

/* GET login page. */
router.get("/login", function(req, res) {
  res.render(path.resolve(__dirname, "../login/BretsTest.html"));
});

module.exports = router;
