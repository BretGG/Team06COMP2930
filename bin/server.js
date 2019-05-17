#!/usr/bin/env node

var app = require("../app");
var debug = require("debug")("comp2930-team2:server");
var http = require("http");
const { Card } = require("../src/models/card.js");
var glob = this;

// Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// Create HTTP server.
var server = http.Server(app);

// Listen on provided port, on all network interfaces.
server.listen(port);
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
let round = 0;
let currentRoundCard;

// const dummycards = [
//   { question: "1 + 1 = ?", answer: "2" },
//   { question: "9 + 1 = ?", answer: "10" },
//   { question: "5 + 1 = ?", answer: "6" },
//   { question: "8 x 3", answer: "24" }
// ];

var io = require("socket.io").listen(server);
io.on("connection", function(socket) {
  // Don't allow a player to connect when at max capacity, should handle this before
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
    answeredRound: false
  });

  socket.on("currentPlayers", () => {
    let playerHolder = [];
    for (let player of players.values()) {
      playerHolder.push(player);
    }
    console.log(playerHolder);
    socket.emit("currentPlayers", playerHolder);
  });

  // update all other players of the new player
  socket.broadcast.emit("newPlayer", players.get(socket.id));

  //user disconnected, broadcast to all other users and remove from list
  socket.on("disconnect", onDisconnect(socket));
  socket.on("me", onMe(socket));
  socket.on("playerAnswered", info => onPlayerAnswered(info, socket));
  socket.on("playerJump", onPlayerJumped(socket));
  socket.on("answered", info => {
    let player = players.get(socket.id);

    console.log(`Player: ${player.playerId} answered: ${info}`);

    // Don't let them answer again
    if (player.answeredRound) return;
    player.answeredRound = true;

    if (answerInfo.answer === currentRoundCard.answer) {
      player.correctAnswers++;
    } else {
      player.wrongAnswers++;
    }

    console.log("yay: " + JSON.stringify(player));

    if (1 === 1) {
      console.log("round end");
      io.emit("endRound", { answer: "Hannah" });
    }
  });

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
  let removedPlayer;
  for (let i = 0; i < players.length; i++) {
    if (players[i].playerId === socket.id) {
      removedPlayer = players.splice(i, 1);
      break;
    }
  }

  function onPlayerAnswered(info, socket) {
    let playeri = info.playerId;
    console.log("test!!", JSON.stringify(info));

    console.log(playeri, "testing ! ");
    let currentPlayer = players.find(m => m.playerId === playeri);
    currentPlayer.answeredRound = true;
    if (info.answer === glob.cards[round].answer) {
      currentPlayer.correctAnswers++;
      console.log("player.correctAnswers, ", currentPlayer.correctAnswers);
    } else {
      currentPlayer.wrongAnswers++;
      console.log("player.wrongAnswers, ", currentPlayer.correctAnswers);
    }

    if (allPlayerAnswered() && round < glob.cards.length) {
      for (let p of players) {
        p.answeredRound = false;
      }

      socket.broadcast.emit("playerAnswered", {
        player: currentPlayer,
        answer: glob.cards[round].answer
      });
      round++;
      console.log("ROUND: ", round);
    }
    //emit updated player object. to be received in game.js

    console.log("removed player: " + JSON.stringify(removedPlayer));
    // find and let all other players know
    if (removedPlayer) {
      socket.broadcast.emit("removePlayer", removedPlayer);
      console.log("broadcast");
    }

    socket.disconnect();
  }
}

function onPlayerJumped(socket) {
  socket.broadcast.emit("playerJump", socket.id);
}

async function roundInfo(s, socket) {
  glob.cards = await Card.find({ format: "tf", category: "test" });
  console.log("from the DB...length:", glob.cards.length);
  // console.log("testing, ",glob.cards);
  let question;
  let answers = [];
  question = glob.cards[s].question;
  answers.push(glob.cards[s].answer);
  for (let i = 0; i < 4; i++) {
    if (glob.cards[i].answer != glob.cards[s].answer) {
      answers.push(glob.cards[i].answer);
    }
  }
  //shuffling the answers
  answers.sort(() => Math.random() - 0.5);
  // return {question: question, answer: answers};
  socket.broadcast.emit("startRound", { question: question, answer: answers });
  console.log("currently....", players);
}

function allPlayerAnswered() {
  for (let o of players) {
    console.log(
      "Inside allPlayerAnswered : \n",
      o.playerId + "\n",
      "has answered?:",
      o.answeredRound
    );
    if (!o.answeredRound) {
      return false;
    }
  }

  return true;
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// function disconnectPlayer(id) {
//   console.log("user ", id, " attempts to disconnect..");
//   if (players[id] != undefined) {
//     // console.log("disc: ", players[id].playerNo);
//     Game1_players[players[id].playerNo].isTaken = false;
//     delete players[id];
//     io.emit("disconnect", id);
//     if (self.EcoQuest_numberOfCurrentPlayers > 0) {
//       self.EcoQuest_numberOfCurrentPlayers--;
//     }
//     console.log(
//       "current number of players ",
//       self.EcoQuest_numberOfCurrentPlayers
//     );
//     printPlayers(Game1_players);
//   } else {
//     console.log("User not exist, deleted already or never created");
//     console.log(
//       "current number of players ",
//       self.EcoQuest_numberOfCurrentPlayers
//     );
//   }
// }
