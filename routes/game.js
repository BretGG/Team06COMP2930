const express = require("express");
const router = express.Router();
const path = require("path");
const debug = require("debug")("comp2930-team2:server");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { User } = require("../src/models/user");
const http = require("http");

var port = normalizePort(process.env.PORT || "3001");
const gameServer = http.createServer().listen(port, function() {
  console.log("Game server is listening on port 3001");
});

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

const io = require("socket.io")(gameServer);
/* Example session/game object:

  {
    gameType: "ecoQuizlet",
    owner: "[playerId]",
    sessionId: "bobsGame", // Used for joining a running game
    sessionPass: "password" // Can be stored in plane text
  }

  This file contains the router for sending the game files, creating lobbies, and joining lobbies.

  This file also contains the socket code for joining and leaving the lobbies. The lobbies use namespaces
  to allow for multiple game instances to be running.

  Lobby data transfers into the game instance.

  Would be nice to split routing into seperate file.

*/

// -------------------------------------------------Socket code----------------------------------------
// Create new connection and register the user
io.on("connection", socket => {
  socket.on("register", async playerInfo => {
    const decode = jwt.verify(playerInfo, "FiveAlive");
    token = jwt.decode(playerInfo);
    const user = await User.findById(token._id).select("-password");

    // Register to the correct lobby
    let lobbyHolder;
    for (let lobby of lobbies) {
      for (let player of lobby.players) {
        if (JSON.stringify(player._id) == JSON.stringify(user._id)) {
          lobbyHolder = lobby;
        }
      }
    }

    // Disconnect or join namespace
    if (!lobbyHolder) {
      socket.emit("noavailablelobby");
      socket.disconnect();
    } else {
      lobbyHolder.players.filter(
        player => JSON.stringify(player._id) === JSON.stringify(user._id)
      )[0].socketId = socket.id;
      socket.join(lobbyHolder.sessionId);
      io.to(lobbyHolder.sessionId).emit(
        "users",
        usersInLobby(lobbyHolder.sessionId)
      );
    }
  });

  // Handling a user leaving the lobby
  socket.on("disconnect", () => {
    let sessionId = getSessionIdBySocketId(socket.id);
    removePlayerBySocketId(socket.id);
    io.to(sessionId).emit("users", usersInLobby(sessionId));
    if (getLobbyBySession(sessionId).players.length == 0) {
      removeLobbyBySession(sessionId);
    }
  });
});

// ---------------------------Lobby helper functions for getting and updating data---------------------------------

function removeLobbyBySession(sessionId) {
  lobbies.forEach((value, index) => {
    if (value.sessionId === sessionId) {
      return lobbies.splice(index, 1);
    }
  });
}

function usersInLobby(sessionId) {
  for (let lobby of lobbies) {
    if (lobby.sessionId === sessionId) return lobby.players;
  }
}

function getLobbyBySession(sessionId) {
  for (let lobby of lobbies) {
    if (lobby.sessionId === sessionId) return lobby;
  }
}

function getSessionIdBySocketId(socketId) {
  for (let lobby of lobbies) {
    for (let player of lobby.players) {
      if (player.socketId === socketId) {
        return lobby.sessionId;
      }
    }
  }
}

function getPlayerBySocketId(socketId) {
  for (let lobby of lobbies) {
    for (let player of lobby.players) {
      if (player._id === socketId) return player;
    }
  }
}

// Update both lobbies and players
function removePlayerBySocketId(socketId) {
  for (let lobby of lobbies) {
    lobby.players.forEach((value, index) => {
      if (value.socketId === socketId) {
        return lobby.players.splice(index, 1);
      }
    });
  }
}

let lobbies = [];

// -------------------------------------------------- Routing -----------------------------------------------------

/* GET game home page. */
// Probably  remove this because the game files will be served based on the post (create game)
// and put (join game)
router.get("/", (req, res) => {
  res.render(path.resolve(__dirname, "../game/public/index.html"), {
    title: "Express"
  });
});

// Sends the information on the lobby that the given user is registered in or 404
// if not registered in a lobby
router.get("/lobbyinfo", async (req, res) => {
  var token = req.get("auth-token");
  if (!token) return res.status(400).send("Uh Oh! You dont have a token!");
  const decode = jwt.verify(token, "FiveAlive");
  token = jwt.decode(token);

  const user = await User.findById(token._id).select("-password");
  if (!user) return res.status(400).send("Uh Oh! You dont exist!");

  for (let lobby of lobbies) {
    for (let player of lobby.players) {
      if (JSON.stringify(player._id) == JSON.stringify(user._id)) {
        return res.send(lobby);
      }
    }
  }

  res.status(404).send("No lobby found");
});

// Routing to game lobby
router.get("/lobby", (req, res) => {
  res.render(path.resolve(__dirname, "../public/views/gameLobby.html"));
});

// Creating a game lobby
router.post("/", async (req, res) => {
  var token = req.get("auth-token");
  if (!token) return res.status(400).send("Uh Oh! You dont have a token!");
  const decode = jwt.verify(token, "FiveAlive");
  token = jwt.decode(token);

  const user = await User.findById(token._id).select("-password");
  if (!user) return res.status(400).send("Uh Oh! You dont exist!");

  const lobby = _.pick(req.body, ["gameType", "sessionId", "sessionPass"]);

  // Check if session id is taken
  if (getLobbyBySession(lobby.sessionId)) {
    return res.status(400).send("GameId taken");
  }

  // Create the players array and add the owner to that array
  lobby.owner = user._id;
  lobby.players = [];
  lobby.players.push(user);
  lobbies.push(lobby);

  console.log("Creating a new session: " + lobby);

  res.send(lobby);
});

// Register a user to a lobby
router.put("/", async (req, res) => {
  var token = req.get("auth-token");
  if (!token) return res.status(400).send("Uh Oh! You dont have a token!");
  const decode = jwt.verify(token, "FiveAlive");
  token = jwt.decode(token);

  const user = await User.findById(token._id).select("-password");
  if (!user) return res.status(400).send("Uh Oh! You dont exist!");

  const lobbyInfo = _.pick(req.body, ["sessionId", "sessionPass"]);
  const lobby = getLobbyBySession(lobbyInfo.sessionId);

  // Didn't find a lobby
  if (!lobby)
    return res
      .status(404)
      .send("Failed to find room at: " + lobbyInfo.sessionId);

  // Invalid password
  if (lobby.sessionPass !== lobbyInfo.sessionPass)
    return res.status(400).send("Invalid session password");

  // Add user to the lobby and return lobby info
  lobby.players.push(user);
  res.send(lobby);
});

module.exports = router;

// ----------------------------------------------------Game code------------------------------------------

//declare instances of global varibles
// const self = this;
// const maxPlayers = 4;
// const players = new Map();
// let roundStarted;
// var round = 0;
// let currentRoundCard;
// var gameStarted = false;
// const losers = [];

// //require socket io using express
// var io = require("socket.io").listen(server);
// app.io = io;

// // incomming information. The connection is made
// io.on("connection", function(socket) {
//   self.id = socket.id;
//   if (players.length >= maxPlayers) {
//     return socket.disconnect();
//   }

//   console.log("A user connected: " + socket.id);
//   // Add a player to the master list (Map)
//   players.set(socket.id, {
//     playerId: socket.id,
//     wrongAnswers: 0,
//     correctAnswers: 0,
//     answeredRound: false,
//     ready: false,
//     gameOver: false
//   });

//   socket.on("currentPlayers", () => {
//     let playerHolder = [];
//     for (let player of players.values()) {
//       playerHolder.push(player);
//     }
//     socket.emit("currentPlayers", playerHolder);
//   });

//   // update all other players of the new player
//   socket.broadcast.emit("newPlayer", players.get(socket.id));

//   //user disconnected, broadcast to all other users and remove from list
//   socket.on("disconnect", () => onDisconnect(socket));
//   socket.on("me", () => onMe(socket));
//   socket.on("playerAnswered", info => onPlayerAnswered(info, socket));
//   socket.on("playerJump", () => onPlayerJumped(socket));
//   socket.on("playerStateChange", state => onPlayerStateChange(socket, state));

//   let roundCard = {};
//   currentRoundCard = roundCard;
// });

// // Find and return the players information at the given port
// function onMe(socket) {
//   socket.emit("me", players.get(socket.id));
// }

// // When the player leaves the game or dic
// function onDisconnect(socket) {
//   // remove player from list
//   let removePlayer = players.get(socket.id);
//   if (removePlayer) {
//     players.delete(socket.id);
//     socket.broadcast.emit("removePlayer", removePlayer);
//   } else {
//     return;
//   }
//   console.log("removed player: " + JSON.stringify(removePlayer));
//   socket.disconnect();
// }
// //On player click on the answer
// function onPlayerAnswered(info, socket) {
//   if (info && glob.cards) {
//     let currentPlayer = players.get(info.playerId);
//     currentPlayer.answeredRound = true;
//     io.emit("playerStateChange", {
//       playerId: socket.id,
//       state: "exclamation"
//     });
//     if (info.answer === glob.cards[round].answer) {
//       this.answer = true;
//       currentPlayer.correctAnswers++;
//     } else if (info.answer !== "N/A") {
//       this.answer = false;
//       currentPlayer.wrongAnswers++;
//     } else {
//     }
//     if (allPlayerAnswered() && !currentPlayer.gameOver) {
//       endRound();
//     }
//   }
// }
// //Broadcast player jumping to the other clients
// function onPlayerJumped(socket) {
//   socket.broadcast.emit("playerJump", socket.id);
// }
// //At the end of the game emit information to the clients and determine the game over rule
// function endRound() {
//   round++;
//   roundStarted = false;

//   let filteredPlayers = [...players.values()];
//   filteredPlayers = filteredPlayers.map(player =>
//     _.pick(player, ["playerId", "correctAnswers", "wrongAnswers"])
//   );

//   io.emit("endRound", {
//     players: filteredPlayers,
//     answer: currentRoundCard.answer
//   });

//   setTimeout(() => {
//     if (round < glob.cards.length && !roundStarted) {
//       roundStart(round);
//     } else {
//       console.log("The end----------------------------");
//       io.emit("gameEnd", {
//         playerId: self.id,
//         state: "gameEnd"
//       });
//       clearTimeout();
//     }
//   }, 3000);
//   for (let player of filteredPlayers) {
//     //If the player get 3 wrong answers, turn it into a ghost.
//     if (player.wrongAnswers === 3 && round < glob.cards.length + 1) {
//       gameOver(player.playerId);
//     }
//   }
// }
// //Sends game over massege to clients
// function gameOver(id) {
//   console.log(id, " Game Over");

//   //check duplicates before adding
//   if (id !== losers.find(element => element === id)) {
//     losers.push(id);
//   }

//   let currentPlayer = players.get(id);
//   currentPlayer.gameOver = true;
//   let filteredPlayers = [...players.values()];
//   filteredPlayers = filteredPlayers.map(player =>
//     _.pick(player, ["playerId", "correctAnswers", "wrongAnswers"])
//   );

//   io.emit("gameOver", {
//     playerId: id,
//     players: filteredPlayers,
//     losers: losers,
//     state: "gameOver"
//   });
// }
// //On the change of current state of player that's incoming,
// // apply or call functions accordingly.
// function onPlayerStateChange(socket, data) {
//   let player = players.get(socket.id);
//   switch (data.state) {
//     case "ready":
//       player.ready = true;

//       io.emit("playerStateChange", {
//         playerId: socket.id,
//         state: "ready"
//       });
//       // Start round if all players are ready
//       if (allPlayerReady()) {
//         if (!roundStarted) {
//           console.log("round has not started yet");
//           roundStart(round);
//         }
//         onPlayerStateChange("doesn't matter", {
//           state: "questionMark"
//         });
//       }
//       break;

//     case "questionMark":
//       io.emit("playerStateChange", {
//         playerId: "Not needed",
//         state: "questionMark"
//       });
//       break;
//     case "answered":
//       io.emit("playerStateChange", {
//         playerId: socket.id,
//         state: "answered"
//       });
//       // Check if all players have answered
//       // if so, emit round finished
//       break;
//   }
// }

// // Imports deck of cards from the mongo database asynchronously and
// // send the incoming data to the clients.
// // Shuffling the answers and make them into a set of 4 multiple choices.
// // If the number of question is less than 4, add in dummy choices.
// async function roundStart(s) {
//   console.log("starting round: " + JSON.stringify(s));

//   for (let o of players.values()) {
//     o.answeredRound = false;
//   }
//   glob.cards = await Card.find({
//     format: "tf",
//     category: "test",
//     deck: "test"
//   });
//   console.log("card length: ", glob.cards.length);

//   let question;
//   let answers = [];

//   currentRoundCard.question = glob.cards[s].question;
//   currentRoundCard.answer = glob.cards[s].answer;

//   question = glob.cards[s].question;
//   answers.push(glob.cards[s].answer);
//   if (glob.cards.length >= 4) {
//     for (let i = 0; i < 4; i++) {
//       if (glob.cards[i].answer != glob.cards[s].answer) {
//         answers.push(glob.cards[i].answer);
//       }
//     }
//   } else {
//     for (let i = 0; i < glob.cards.length; i++) {
//       if (glob.cards[i].answer != glob.cards[s].answer) {
//         answers.push(glob.cards[i].answer);
//       }
//     }
//     let temp = 4 - glob.cards.length;
//     switch (temp) {
//       case 1:
//         answers.push("Chocolate");
//         break;

//       case 2:
//         answers.push("coffee");
//         answers.push("water");
//         break;
//       case 3:
//         answers.push("145");
//         answers.push("Ocean");
//         answers.push("Carbonated water");

//         break;
//       default:
//     }
//   }
//   //shuffling the answers
//   answers.sort(() => Math.random() - 0.5);

//   io.emit("startRound", {
//     question: question,
//     answer: answers
//   });
//   roundStarted = true;
//   gamestarted = true;
// }

// //Check if all player have answered
// function allPlayerAnswered() {
//   for (let player of players.values()) {
//     if (!player.answeredRound && !player.gameOver) {
//       return false;
//     }
//   }

//   return true;
// }
// //Check if all players are ready and good to go
// function allPlayerReady() {
//   for (let player of players.values()) {
//     if (player.ready != true) {
//       return false;
//     }
//   }
//   return true;
// }
