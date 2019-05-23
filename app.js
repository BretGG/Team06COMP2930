// var authAccess = require('./middleware/auth'); //h

const express = require("express");
const path = require("path");
const logger = require("morgan");
const debug = require("debug")("comp2930-team2:server");
const consolidate = require("consolidate");
const mongoose = require("mongoose");
const auth = require("./routes/auth");

const mainRouter = require("./routes/main");
const gameRouter = require("./routes/game");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/login");
const cardRouter = require("./routes/cards");
const deckRouter = require("./routes/decks");
const itemRouter = require("./routes/items");

var app = express();

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set the rendering engine to mustache
app.engine("html", consolidate.mustache);
app.set("view engine", "html");

// Starting database connection
mongoose
  .connect("mongodb://localhost/ecoQuest")
  .then(() => console.log("Connected to mongo...\n"))
  .catch(err => console.log("Failed connection to mongo ", err));

// Setting the console color to include time and color
require("console-stamp")(console, {
  pattern: "ddd mmm dd HH:MM:ss",
  colors: {
    stamp: "yellow"
  }
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// TODO: Add in the authentication middleware
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// / - route to index type files...
// /game - route to game files...
// /users - creating account...
// /login - logging in...
app.use("/", mainRouter);
app.use("/game", auth, gameRouter);
app.use("/users", auth, usersRouter);
app.use("/login", authRouter);
app.use("/cards", auth, cardRouter);
app.use("/decks", auth, deckRouter);
app.use("/items", auth, itemRouter);

// app.get('/mainPage', function(req, res) {
//   res.render('public/views/mainPage.html');
// });

// public will hold static basic files
// game/public will hold static files for games
// Remove the public static folder if handling all UI with Phaser
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "game/public")));
app.use((req, res, next) => {
  res.render(path.resolve(__dirname, "./public/views/404.html"));
});

module.exports = app;
