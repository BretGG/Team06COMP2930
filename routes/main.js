const express = require("express");
const router = express.Router();
const path = require("path");

/* GET home page. */
router.get("/", function(req, res) {
  res.render(path.resolve(__dirname, "../public/views/index.html"));
});

/* GET main page. */
router.get("/main", function(req, res) {
  res.render(path.resolve(__dirname, "../public/views/mainPage.html"));
});

/* GET createRoom page. */
router.get("/createRoom", function(req, res) {
  res.render(path.resolve(__dirname, "../public/views/createRoom.html"));
});

/* GET gameLobby page. */
router.get("/gameLobby", function(req, res) {
  res.render(path.resolve(__dirname, "../public/views/gameLobby.html"));
});

/* GET joinRoom page. */
router.get("/joinRoom", function(req, res) {
  res.render(path.resolve(__dirname, "../public/views/joinRoom.html"));
});

/* GET myCard page. */
router.get("/mycard", function(req, res) {
  res.render(path.resolve(__dirname, "../public/views/myCards.html"));
});

/* GET login page. */
router.get("/login", function(req, res) {
  res.render(path.resolve(__dirname, "../login/BretsTest.html"));
});

module.exports = router;
