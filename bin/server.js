#!/usr/bin/env node

var io = require("socket.io")
  .listen(server);
module.exports = io;

var app = require("../app");
var debug = require("debug")("comp2930-team2:server");
var http = require("http");
const _ = require("lodash");
const {
  Card
} = require("../src/models/card.js");
var glob = this;

// Get port from environment and store in Express.
// var port = normalizePort(process.env.PORT || "3000");
// app.set("port", port);
//
// app.listen(3000, '0.0.0.0', function() {
//     console.log('Listening to port:  ' + 3000);
// });

// Create HTTP server.
var server = http.Server(app);

// Listen on provided port, on all network interfaces.
// server.listen(port);
server.listen(3000, "0.0.0.0", function() {
  console.log("Listening to port:  " + 3000);
});

server.on("error", onError);
server.on("listening", onListening);

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

//--------------------------------------------------------Game code------------------------------------------------------------
const self = this;
const maxPlayers = 4;
const players = new Map();
let roundStarted;
var round = 0;
let currentRoundCard;
var gameStarted = false;
const losers = [];

var io = require("socket.io")
  .listen(server);
app.io = io;

io.on("connection", function(socket) {
  // Don't allow a player to connect when at max capacity, should handle this before
  self.id = socket.id;
  // the connecion is made
  if (players.length >= maxPlayers) {
    return socket.disconnect();
  }

  console.log("A user connected: " + socket.id);

  // Add a player to the master list (Map)
  players.set(socket.id, {
    playerId: socket.id,
    wrongAnswers: 0,
    correctAnswers: 0,
    answeredRound: false,
    ready: false,
    gameOver: false
  });

  socket.on("currentPlayers", () => {
    let playerHolder = [];
    for (let player of players.values()) {
      playerHolder.push(player);
    }
    socket.emit("currentPlayers", playerHolder);
  });

  // update all other players of the new player

  socket.broadcast.emit("newPlayer", players.get(socket.id));

  //user disconnected, broadcast to all other users and remove from list
  socket.on("disconnect", () => onDisconnect(socket));
  socket.on("me", () => onMe(socket));
  socket.on("playerAnswered", info => onPlayerAnswered(info, socket));
  socket.on("playerJump", () => onPlayerJumped(socket));
  socket.on("playerStateChange", state => onPlayerStateChange(socket, state));

  ////////////////////////////////////////// test code
  let roundCard = {
    question: "What is Stella's first name",
    answer: "Hannah"
  };

  currentRoundCard = roundCard;
});

// Find and return the players information at the given port
function onMe(socket) {
  socket.emit("me", players.get(socket.id));
}

// When the player leaves the game or dic
function onDisconnect(socket) {
  // remove player from list
  let removePlayer = players.get(socket.id);
  if (removePlayer) {
    players.delete(socket.id);
    socket.broadcast.emit("removePlayer", removePlayer);
  } else {
    return;
  }
  console.log("removed player: " + JSON.stringify(removePlayer));
  socket.disconnect();
}

function onPlayerAnswered(info, socket) {
  if (info && glob.cards) {
    let currentPlayer = players.get(info.playerId);
    currentPlayer.answeredRound = true;
    io.emit("playerStateChange", {
      playerId: socket.id,
      state: "exclamation"
    });
    if (info.answer === glob.cards[round].answer) {
      this.answer = true;
      currentPlayer.correctAnswers++;
      console.log(
        "player :",
        currentPlayer.playerId,
        " / correctAnswers, ",
        currentPlayer.correctAnswers
      );
    } else if (info.answer !== "N/A") {
      this.answer = false;
      currentPlayer.wrongAnswers++;
      console.log(
        "player :",
        currentPlayer.playerId,
        " / wrongAnswers, ",
        currentPlayer.wrongAnswers
      );
    }
    if (allPlayerAnswered()) {
      endRound();
    }

    // onPlayerStateChange(socket, { state: "answered" });
  }
}

function onPlayerJumped(socket) {
  socket.broadcast.emit("playerJump", socket.id);
}

function endRound() {
  round++;
  roundStarted = false;

  let filteredPlayers = [...players.values()];
  filteredPlayers = filteredPlayers.map(player =>
    _.pick(player, ["playerId", "correctAnswers", "wrongAnswers"])
  );

  io.emit("endRound", {
    players: filteredPlayers,
    answer: currentRoundCard.answer
  });

  setTimeout(() => {
    if (round < glob.cards.length && !roundStarted) {
      roundStart(round);
    } else {
      console.log("The end----------------------------");
      io.emit("gameEnd", {
        playerId: self.id,
        state: "gameEnd"
      });
      clearTimeout();
    }
  }, 3000);
  for (let player of filteredPlayers) {
    //If the player get 3 wrong answers, turn it into a ghost.
    if (player.wrongAnswers === 3 && round < glob.cards.length + 1) {
      gameOver(player.playerId);
    }
  }
}

function gameOver(id) {
  console.log(id, " Game Over");

  //check duplicates before adding
  if (id !== losers.find(element => element === id)) {
    losers.push(id);
  }

  let currentPlayer = players.get(id);
  currentPlayer.gameOver = true;
  let filteredPlayers = [...players.values()];
  filteredPlayers = filteredPlayers.map(player =>
    _.pick(player, ["playerId", "correctAnswers", "wrongAnswers"])
  );

  io.emit("gameOver", {
    playerId: id,
    players: filteredPlayers,
    losers: losers,
    state: "gameOver"
  });
}

function onPlayerStateChange(socket, data) {
  let player = players.get(socket.id);
  switch (data.state) {
    case "ready":
      player.ready = true;

      io.emit("playerStateChange", {
        playerId: socket.id,
        state: "ready"
      });
      // Start round if all players are ready
      if (allPlayerReady()) {
        if (!roundStarted) {
          console.log("round has not started yet");
          roundStart(round);
        }
        onPlayerStateChange("doesn't matter", {
          state: "questionMark"
        });
      }
      break;

    case "questionMark":
      io.emit("playerStateChange", {
        playerId: "Not needed",
        state: "questionMark"
      });
      break;
    case "answered":
      io.emit("playerStateChange", {
        playerId: socket.id,
        state: "answered"
      });
      // Check if all players have answered
      // if so, emit round finished
      break;
  }
}

async function roundStart(s) {
  console.log("starting round: " + JSON.stringify(s));

  for (let o of players.values()) {
    o.answeredRound = false;
  }
  glob.cards = await Card.find({
    format: "tf",
    category: "test",
    deck: "test"
  });
  console.log("card length: ", glob.cards.length);

  let question;
  let answers = [];

  currentRoundCard.question = glob.cards[s].question;
  currentRoundCard.answer = glob.cards[s].answer;

  question = glob.cards[s].question;
  answers.push(glob.cards[s].answer);
  if (glob.cards.length >= 4) {
    for (let i = 0; i < 4; i++) {
      if (glob.cards[i].answer != glob.cards[s].answer) {
        answers.push(glob.cards[i].answer);
      }
    }
  } else {
    for (let i = 0; i < glob.cards.length; i++) {
      if (glob.cards[i].answer != glob.cards[s].answer) {
        answers.push(glob.cards[i].answer);
      }
    }
    let temp = 4 - glob.cards.length;
    switch (temp) {
      case 1:
        answers.push("Chocolate");
        break;

      case 2:
        answers.push("coffee");
        answers.push("water");
        break;
      case 3:
        answers.push("145");
        answers.push("Ocean");
        answers.push("Carbonated water");

        break;
      default:
    }
  }
  //shuffling the answers
  answers.sort(() => Math.random() - 0.5);
  //**************************
  io.emit("startRound", {
    question: question,
    answer: answers
  });
  //************************
  roundStarted = true;
  gamestarted = true;
}

function allPlayerAnswered() {
  for (let player of players.values()) {
    if (!player.answeredRound && !player.gameOver) {
      return false;
    }
  }

  return true;
}

function allPlayerReady() {
  for (let player of players.values()) {
    if (player.ready != true) {
      return false;
    }
  }
  return true;
}