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

//declare instances of global varibles
const self = this;
const maxPlayers = 4;
const players = new Map();
let roundStarted;
var round = 0;
let currentRoundCard;
var gameStarted = false;
const losers = [];

//require socket io using express
var io = require("socket.io")
  .listen(server);
app.io = io;

// incomming information. The connection is made
io.on("connection", function(socket) {
  self.id = socket.id;
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

  let roundCard = {};
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
//On player click on the answer
function onPlayerAnswered(info, socket) {
  console.log("round:::::", round);
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
    } else if (info.answer !== "N/A") {
      this.answer = false;
      currentPlayer.wrongAnswers++;
    } else {
      console.log("");
    }
    if (allPlayerAnswered() && !currentPlayer.gameOver) {
      endRound();
    }
  }
}
//Broadcast player jumping to the other clients
function onPlayerJumped(socket) {
  socket.broadcast.emit("playerJump", socket.id);
}
//At the end of the game emit information to the clients and determine the game over rule
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
//Sends game over massege to clients
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
//On the change of current state of player that's incoming,
// apply or call functions accordingly.
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

// Imports deck of cards from the mongo database asynchronously and
// send the incoming data to the clients.
// Shuffling the answers and make them into a set of 4 multiple choices.
// If the number of question is less than 4, add in dummy choices.
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

  io.emit("startRound", {
    question: question,
    answer: answers
  });
  roundStarted = true;
  gamestarted = true;
}

//Check if all player have answered
function allPlayerAnswered() {
  for (let player of players.values()) {
    if (!player.answeredRound && !player.gameOver) {
      return false;
    }
  }

  return true;
}
//Check if all players are ready and good to go
function allPlayerReady() {
  for (let player of players.values()) {
    if (player.ready != true) {
      return false;
    }
  }
  return true;
}