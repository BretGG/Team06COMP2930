var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const consolidate = require("consolidate");

var indexRouter = require("./routes/index");
var gameRouter = require("./routes/game");
var usersRouter = require("./routes/users");

var app = express();

// Set the rendering engine
// Using mustache to render static html pages
app.engine("html", consolidate.mustache);
app.set("view engine", "html");

// Setting the console color to include time and color
require("console-stamp")(console, {
  pattern: "ddd mmm dd HH:MM:ss",
  colors: {
    stamp: "yellow"
  }
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "game/public")));

// Main routers
app.use("/", indexRouter);
app.use("/game", gameRouter);

module.exports = app;
