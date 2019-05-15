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
router.get("/myCard", function(req, res) {
  res.render(path.resolve(__dirname, "../public/views/myCards.html"));
});


/* GET BretsTest page. */
router.get("/login", function(req, res) {
  res.render(path.resolve(__dirname, "../login/BretsTest.html"));
});
/* GET hannahtest page. */
router.get("/hannahtest", function(req, res) {
  res.render(path.resolve(__dirname, "../public/views/hannahtest.html"));
});

/* GET shop page. */
router.get("/shop", function(req, res) {
  res.render(path.resolve(__dirname, "../public/views/shop.html"));
});


module.exports = router;
